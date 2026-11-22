import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCustomerDriveConnection, getCustomerAccessToken } from '@/lib/customerDrive';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conn = await getCustomerDriveConnection(admin.id);
    let liveValid = false;
    let liveError: string | null = null;

    if (conn && conn.connected) {
      try {
        await getCustomerAccessToken(admin.id);
        liveValid = true;
      } catch (err: unknown) {
        liveValid = false;
        liveError = err instanceof Error ? err.message : 'Token verification failed';
      }
    }

    const isConnected = Boolean(conn && conn.connected && liveValid);

    return NextResponse.json({
      success: true,
      connected: isConnected,
      isCustomerSpecific: Boolean(conn && conn.connected),
      accountEmail: isConnected ? (conn?.googleEmail || null) : null,
      folderId: isConnected ? (conn?.rootFolderId || '') : '',
      folderName: conn?.rootFolderName || 'Birthday Website Media',
      sharingStatus: conn?.sharingStatus || 'disconnected',
      connectedAt: conn?.createdAt || null,
      errorMessage: liveError || conn?.errorMessage || null,
      hasClientId: Boolean(process.env.GOOGLE_CLIENT_ID),
      hasClientSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
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
