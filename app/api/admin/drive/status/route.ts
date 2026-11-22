import { NextRequest, NextResponse } from 'next/server';
import { testGoogleDriveConnection, getDriveFolderId } from '@/lib/googleDrive';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await testGoogleDriveConnection();

    return NextResponse.json({
      success: true,
      ...result,
      hasClientId: Boolean(process.env.GOOGLE_CLIENT_ID),
      hasClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
      hasRefreshToken: Boolean(process.env.GOOGLE_REFRESH_TOKEN),
      hasFolderId: Boolean(process.env.GOOGLE_DRIVE_FOLDER_ID),
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error checking Google Drive';
    return NextResponse.json({
      success: false,
      connected: false,
      message,
    });
  }
}
