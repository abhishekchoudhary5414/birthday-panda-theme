import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { disconnectCustomerGmail } from '@/lib/customerGmail';

export const dynamic = 'force-dynamic';

/**
 * POST /api/gmail/disconnect
 * Disconnects Gmail, revokes OAuth access token, clears tokens from database,
 * while completely preserving guest records and invitation history.
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await disconnectCustomerGmail(admin.id);

    return NextResponse.json({
      success: true,
      message: 'Gmail disconnected successfully. Guest records and invitation history remain preserved.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to disconnect Gmail';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
