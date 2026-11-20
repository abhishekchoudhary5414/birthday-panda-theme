import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalGuestsRes = await sql`SELECT count(*) FROM guests`;
    const attendingRes = await sql`SELECT count(*) FROM guests WHERE rsvp_status = 'confirmed' OR rsvp_status = 'attending'`;
    const pendingRes = await sql`SELECT count(*) FROM guests WHERE rsvp_status = 'pending'`;
    const declinedRes = await sql`SELECT count(*) FROM guests WHERE rsvp_status = 'declined'`;

    return NextResponse.json({
      success: true,
      stats: {
        totalGuests: parseInt(totalGuestsRes[0].count, 10),
        attending: parseInt(attendingRes[0].count, 10),
        pending: parseInt(pendingRes[0].count, 10),
        declined: parseInt(declinedRes[0].count, 10),
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
