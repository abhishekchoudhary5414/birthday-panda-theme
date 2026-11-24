import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCustomerGmailConnection, getCustomerGmailAccessToken } from '@/lib/customerGmail';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/gmail/status
 * Returns Gmail connection status & guest invitation statistics for customer dashboard.
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conn = await getCustomerGmailConnection(admin.id);

    let liveValid = false;
    let liveError: string | null = null;

    if (conn && conn.connected) {
      try {
        await getCustomerGmailAccessToken(admin.id);
        liveValid = true;
      } catch (err: unknown) {
        liveValid = false;
        liveError = err instanceof Error ? err.message : 'Gmail token verification failed';
      }
    }

    const isConnected = Boolean(conn && conn.connected && liveValid);

    // Fetch invitation statistics for this customer
    const guestCounts = await sql`
      SELECT 
        COUNT(*)::int as total_guests,
        COUNT(CASE WHEN invitation_status = 'sent' THEN 1 END)::int as sent_count,
        COUNT(CASE WHEN invitation_status = 'failed' THEN 1 END)::int as failed_count,
        COUNT(CASE WHEN invitation_status = 'pending' OR invitation_status IS NULL THEN 1 END)::int as pending_count
      FROM guests
      WHERE user_id = ${admin.id}
    `;

    const stats = guestCounts[0] || {
      total_guests: 0,
      sent_count: 0,
      failed_count: 0,
      pending_count: 0,
    };

    return NextResponse.json({
      success: true,
      connected: isConnected,
      accountEmail: isConnected ? conn?.googleEmail : null,
      connectedAt: conn?.createdAt || null,
      updatedAt: conn?.updatedAt || null,
      errorMessage: liveError || conn?.errorMessage || null,
      stats: {
        totalGuests: stats.total_guests,
        invitationsSent: stats.sent_count,
        failedInvitations: stats.failed_count,
        pendingInvitations: stats.pending_count,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve Gmail status';
    return NextResponse.json({ success: false, connected: false, error: message }, { status: 500 });
  }
}
