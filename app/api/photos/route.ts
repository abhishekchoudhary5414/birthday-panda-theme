import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import {
  listCustomerDrivePhotos,
  uploadPhotoToCustomerDrive,
  getCustomerDriveConnection,
} from '@/lib/customerDrive';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/photos
 * Returns media photos and videos from Google Drive merged with database metadata.
 * Works for both public guests (rendering gallery) and admin dashboard.
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    // Determine target customer userId:
    // 1. If admin is logged in, use admin.id
    // 2. Otherwise default to the active customer in google_drive_connections or id 1
    let targetUserId = admin?.id;
    if (!targetUserId) {
      const activeConn = await sql`
        SELECT user_id FROM google_drive_connections WHERE connected = TRUE LIMIT 1
      `;
      targetUserId = (activeConn.length > 0 && activeConn[0].user_id) ? Number(activeConn[0].user_id) : 1;
    }

    let drivePhotos: any[] = [];
    let driveError: string | null = null;

    try {
      drivePhotos = await listCustomerDrivePhotos(targetUserId, 120);
    } catch (err: unknown) {
      driveError = err instanceof Error ? err.message : 'Failed to connect to Google Drive';
      console.warn('Google Drive list warning in /api/photos:', driveError);
    }

    // Augment with database metadata
    let dbPhotosMap = new Map<string, any>();
    try {
      const rows = await sql`
        SELECT drive_file_id, caption, uploader_name, media_type, target_section, milestone_index, created_at 
        FROM drive_photos 
        ORDER BY created_at DESC
      `;
      for (const row of rows) {
        dbPhotosMap.set(row.drive_file_id, row);
      }
    } catch (dbErr) {
      console.warn('DB read error for drive_photos (ignoring):', dbErr);
    }

    const photos = drivePhotos.map((photo) => {
      const dbMeta = dbPhotosMap.get(photo.id);
      return {
        ...photo,
        caption: dbMeta?.caption || photo.caption || '',
        uploaderName: dbMeta?.uploader_name || 'Party Guest',
        mediaType: dbMeta?.media_type || (photo.mimeType.startsWith('video/') ? 'video' : 'image'),
        targetSection: dbMeta?.target_section || 'gallery',
        milestoneIndex: dbMeta?.milestone_index !== undefined && dbMeta?.milestone_index !== null ? Number(dbMeta.milestone_index) : null,
        createdAt: dbMeta?.created_at || photo.createdTime,
      };
    });

    return NextResponse.json({
      success: true,
      photos,
      count: photos.length,
      warning: driveError,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      {
        success: false,
        error: message,
        photos: [],
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/photos
 * Customer-specific media upload to their connected Google Drive.
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    // Use logged in customer ID or fallback to primary customer ID 1
    const userId = admin?.id || 1;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const caption = (formData.get('caption') as string) || '';
    const uploaderName = (formData.get('uploaderName') as string) || (admin ? admin.name : 'Host / Guest');
    const websiteId = (formData.get('websiteId') as string) || 'default';
    const targetSectionRaw = (formData.get('targetSection') as string) || 'none';
    const targetSection = (targetSectionRaw === 'none' || targetSectionRaw === 'null' || !targetSectionRaw) ? null : targetSectionRaw;
    const milestoneIndexStr = formData.get('milestoneIndex') as string | null;
    const milestoneIndex = (targetSection === 'timeline' && milestoneIndexStr) ? parseInt(milestoneIndexStr, 10) : null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'Only image or video files are allowed' },
        { status: 400 }
      );
    }

    // Validate size limit (15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit (15MB)' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    let uploadBuffer = Buffer.from(arrayBuffer);
    let finalMimeType = file.type;
    let finalFileName = file.name;

    // Apply high-performance smart compression for images
    if (isImage) {
      try {
        // Resize to max 1920x1920 maintaining aspect ratio, convert to WebP with 82% quality (crystal clear yet 70-85% smaller)
        uploadBuffer = await sharp(uploadBuffer)
          .rotate() // Auto-orient based on EXIF
          .resize(1920, 1920, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 82, effort: 4 })
          .toBuffer();

        finalMimeType = 'image/webp';
        finalFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
      } catch (compressionErr) {
        console.warn('Image compression fallback to original buffer:', compressionErr);
        uploadBuffer = Buffer.from(arrayBuffer);
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = `birthday-${timestamp}-${finalFileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // Upload directly to customer's Google Drive folder
    const uploadedPhoto = await uploadPhotoToCustomerDrive({
      userId,
      fileName: safeName,
      mimeType: finalMimeType,
      buffer: uploadBuffer,
      caption,
      description: caption ? `${caption} (Uploaded by ${uploaderName})` : `Uploaded by ${uploaderName}`,
    });

    // Save metadata in Neon PostgreSQL drive_photos table
    try {
      await sql`
        INSERT INTO drive_photos (
          drive_file_id, file_name, mime_type, file_size, web_view_link, thumbnail_link, caption, uploader_name, user_id, website_id, media_type, target_section, milestone_index
        ) VALUES (
          ${uploadedPhoto.id},
          ${uploadedPhoto.name},
          ${uploadedPhoto.mimeType},
          ${uploadedPhoto.size || file.size},
          ${uploadedPhoto.webViewLink || ''},
          ${uploadedPhoto.thumbnailLink || ''},
          ${caption},
          ${uploaderName},
          ${userId},
          ${websiteId},
          ${isVideo ? 'video' : 'image'},
          ${targetSection},
          ${milestoneIndex}
        )
        ON CONFLICT (drive_file_id) DO UPDATE SET
          caption = EXCLUDED.caption,
          uploader_name = EXCLUDED.uploader_name,
          target_section = EXCLUDED.target_section,
          milestone_index = EXCLUDED.milestone_index,
          updated_at = CURRENT_TIMESTAMP;
      `;
    } catch (dbErr) {
      console.warn('Failed to insert metadata into drive_photos table (file still uploaded to Drive):', dbErr);
    }

    // If target section is child photo or hero, also update event_settings so ecard & hero use it immediately
    const photoUrl = uploadedPhoto.directUrl || uploadedPhoto.thumbnailLink || `/api/photos/${uploadedPhoto.id}`;
    if (targetSection === 'child_photo' || targetSection === 'hero') {
      try {
        await sql`
          INSERT INTO event_settings (key, value)
          VALUES ('child_photo_url', ${photoUrl})
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
        `;
      } catch (settingsErr) {
        console.warn('Failed to update event_settings with child_photo_url:', settingsErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Photo uploaded to customer Google Drive successfully!',
      photo: {
        ...uploadedPhoto,
        caption,
        uploaderName,
        mediaType: isVideo ? 'video' : 'image',
        targetSection,
        milestoneIndex,
        photoUrl,
      },
    });
  } catch (err: unknown) {
    console.error('Customer Drive photo upload error:', err);
    const message = err instanceof Error ? err.message : 'Failed to upload photo to Google Drive';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
