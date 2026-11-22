import { NextRequest, NextResponse } from 'next/server';
import { listPhotosFromDrive, uploadPhotoToDrive, testGoogleDriveConnection } from '@/lib/googleDrive';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET: List all photos from Google Drive (merged with DB metadata if present)
export async function GET(req: NextRequest) {
  try {
    let drivePhotos: any[] = [];
    let driveError: string | null = null;

    try {
      drivePhotos = await listPhotosFromDrive({ pageSize: 120 });
    } catch (err: unknown) {
      driveError = err instanceof Error ? err.message : 'Failed to connect to Google Drive';
      console.warn('Google Drive list error in /api/photos:', driveError);
    }

    // Try fetching database metadata to augment captions / uploader names
    let dbPhotosMap = new Map<string, any>();
    try {
      const rows = await sql`
        SELECT drive_file_id, caption, uploader_name, created_at 
        FROM drive_photos 
        ORDER BY created_at DESC
      `;
      for (const row of rows) {
        dbPhotosMap.set(row.drive_file_id, row);
      }
    } catch (dbErr) {
      console.warn('DB read error for drive_photos (ignoring):', dbErr);
    }

    // Merge Google Drive files with DB metadata
    const photos = drivePhotos.map((photo) => {
      const dbMeta = dbPhotosMap.get(photo.id);
      return {
        ...photo,
        caption: dbMeta?.caption || photo.caption || '',
        uploaderName: dbMeta?.uploader_name || 'Ditvi Party Guest',
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

// POST: Upload a photo to Google Drive
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const caption = (formData.get('caption') as string) || '';
    const uploaderName = (formData.get('uploaderName') as string) || 'Admin / Guest';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check mime type (images & short clips)
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Only image or video files are allowed' },
        { status: 400 }
      );
    }

    // Check size limit: 15MB
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit (15MB)' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize file name with timestamp prefix
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = `ditvi-birthday-${timestamp}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // Upload to Google Drive
    const uploadedPhoto = await uploadPhotoToDrive({
      buffer,
      fileName: safeName,
      mimeType: file.type || 'image/jpeg',
      description: caption ? `${caption} (Uploaded by ${uploaderName})` : `Uploaded by ${uploaderName}`,
    });

    // Save record to DB for fast lookup & metadata retention
    try {
      await sql`
        INSERT INTO drive_photos (
          drive_file_id, file_name, mime_type, file_size, web_view_link, thumbnail_link, caption, uploader_name
        ) VALUES (
          ${uploadedPhoto.id},
          ${uploadedPhoto.name},
          ${uploadedPhoto.mimeType},
          ${uploadedPhoto.size || file.size},
          ${uploadedPhoto.webViewLink || ''},
          ${uploadedPhoto.thumbnailLink || ''},
          ${caption},
          ${uploaderName}
        )
        ON CONFLICT (drive_file_id) DO UPDATE SET
          caption = EXCLUDED.caption,
          uploader_name = EXCLUDED.uploader_name;
      `;
    } catch (dbErr) {
      console.warn('Database insert warning for drive_photos (non-fatal):', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Photo uploaded to Google Drive successfully!',
      photo: {
        ...uploadedPhoto,
        caption,
        uploaderName,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Upload failed';
    console.error('Photo upload error:', err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
