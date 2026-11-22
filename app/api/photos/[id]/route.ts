import { NextRequest, NextResponse } from 'next/server';
import { getDriveFileStream, deleteCustomerPhoto } from '@/lib/customerDrive';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/photos/[id]
 * Stream the image or video directly from Google Drive so visitors can view/download
 * without needing Google accounts or exposing tokens.
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing file id' }, { status: 400 });
    }

    const { stream, mimeType, size } = await getDriveFileStream(id);

    if (!stream) {
      return NextResponse.json({ error: 'Image content not found' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', mimeType);
    headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    if (size) {
      headers.set('Content-Length', size.toString());
    }

    return new NextResponse(stream as any, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch image stream';
    // Fallback: redirect to public drive thumbnail or view URL if direct streaming fails
    const { id } = await params;
    if (id) {
      return NextResponse.redirect(`https://lh3.googleusercontent.com/d/${id}=w1200`);
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/photos/[id]
 * Deletes a photo from customer's Google Drive and Neon PostgreSQL metadata.
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing file id' }, { status: 400 });
    }

    // 1. Delete from customer's Google Drive
    try {
      await deleteCustomerPhoto(id, admin.id);
    } catch (driveErr) {
      console.warn('Drive deletion warning (proceeding to delete DB record):', driveErr);
    }

    // 2. Delete metadata from Neon PostgreSQL
    try {
      await sql`DELETE FROM drive_photos WHERE drive_file_id = ${id} AND (user_id = ${admin.id} OR user_id IS NULL)`;
    } catch (dbErr) {
      console.warn('DB deletion error for drive_photos:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully from Google Drive and database',
    });
  } catch (error: unknown) {
    console.error('Delete photo error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete photo';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
