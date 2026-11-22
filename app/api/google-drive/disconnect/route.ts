import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { disconnectCustomerDrive } from '@/lib/customerDrive';

export const dynamic = 'force-dynamic';

/**
 * POST /api/google-drive/disconnect
 * Disconnects the customer's Google Drive account, revokes token, and updates status in Neon.
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await disconnectCustomerDrive(admin.id);

    return NextResponse.json({
      success: true,
      message: 'Google Drive account disconnected successfully. Your uploaded files remain safe in your Google Drive.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to disconnect Google Drive';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
