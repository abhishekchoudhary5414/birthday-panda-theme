import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/invitations/history
 * Returns the customer's email invitation log
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await sql`
      SELECT 
        h.id, h.recipient_email, h.subject, h.status, h.gmail_message_id, 
        h.attempt_count, h.sent_at, h.last_attempt_at, h.error_message, h.created_at,
        g.name as guest_name, g.id as guest_id
      FROM invitation_history h
      LEFT JOIN guests g ON h.guest_id = g.id
      WHERE h.user_id = ${admin.id}
      ORDER BY h.id DESC
      LIMIT 100
    `;

    return NextResponse.json({
      success: true,
      history: rows,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch invitation history';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
