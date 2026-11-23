import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { addEmailOptOut, removeEmailOptOut, isValidEmail } from '@/lib/invitationQueue';

export const dynamic = 'force-dynamic';

// GET: List all opted out emails
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId') || '1');

    const rows = await sql`
      SELECT id, email, reason, created_at
      FROM email_opt_outs
      WHERE user_id = ${userId}
      ORDER BY id DESC
    `;

    return NextResponse.json({ success: true, optOuts: rows });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST: Add email to opt-out list
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 1, email, reason = 'Unsubscribed by host or guest request' } = body;

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'A valid email address is required' }, { status: 400 });
    }

    await addEmailOptOut(Number(userId), email, reason);

    return NextResponse.json({
      success: true,
      message: `${email.trim().toLowerCase()} has been added to the suppression/opt-out list.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE: Remove email from opt-out list
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 1, email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    await removeEmailOptOut(Number(userId), email);

    return NextResponse.json({
      success: true,
      message: `${email.trim().toLowerCase()} has been removed from the suppression list.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
