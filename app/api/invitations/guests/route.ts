import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET all guests
export async function GET(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || 'all';
    const invStatus = searchParams.get('invitationStatus')?.trim() || 'all';

    let guests = await sql`
      SELECT id, name, mobile, email, invite_code, rsvp_status, invited, notes, 
             COALESCE(invitation_status, 'pending') as invitation_status,
             created_at, title
      FROM guests
      WHERE (user_id = ${admin.id} OR user_id IS NULL)
      ORDER BY id DESC
    `;

    // Apply filtering
    if (search) {
      const q = search.toLowerCase();
      guests = guests.filter((g: any) =>
        (g.name && g.name.toLowerCase().includes(q)) ||
        (g.email && g.email.toLowerCase().includes(q)) ||
        (g.mobile && g.mobile.toLowerCase().includes(q)) ||
        (g.invite_code && g.invite_code.toLowerCase().includes(q))
      );
    }

    if (status !== 'all') {
      guests = guests.filter((g: any) => g.rsvp_status === status);
    }

    if (invStatus !== 'all') {
      guests = guests.filter((g: any) => g.invitation_status === invStatus);
    }

    return NextResponse.json({ guests });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch guests';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create a single guest
export async function POST(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, mobile = '', title = 'Guest', notes = '' } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Guest name is required' }, { status: 400 });
    }

    const inviteCode = 'PANDA-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const result = await sql`
      INSERT INTO guests (name, email, mobile, title, notes, invite_code, rsvp_status, invitation_status, user_id)
      VALUES (${name.trim()}, ${email?.trim() || null}, ${mobile.trim()}, ${title}, ${notes}, ${inviteCode}, 'pending', 'pending', ${admin.id})
      RETURNING *
    `;

    return NextResponse.json({ success: true, guest: result[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create guest';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT update guest details
export async function PUT(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, name, email, mobile, title, notes, rsvp_status, invitation_status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Guest id is required' }, { status: 400 });
    }

    const result = await sql`
      UPDATE guests SET
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        mobile = COALESCE(${mobile}, mobile),
        title = COALESCE(${title}, title),
        notes = COALESCE(${notes}, notes),
        rsvp_status = COALESCE(${rsvp_status}, rsvp_status),
        invitation_status = COALESCE(${invitation_status}, invitation_status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id} AND (user_id = ${admin.id} OR user_id IS NULL)
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Guest not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, guest: result[0] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update guest';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE delete guest
export async function DELETE(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Guest id required' }, { status: 400 });
    }

    await sql`
      DELETE FROM guests 
      WHERE id = ${parseInt(id, 10)} AND (user_id = ${admin.id} OR user_id IS NULL)
    `;

    return NextResponse.json({ success: true, message: 'Guest deleted successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete guest';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
