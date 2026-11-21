import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET all guests (with optional search & status filter)
export async function GET(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || 'all';

    let guests;
    if (search && status !== 'all') {
      const searchPattern = `%${search}%`;
      guests = await sql`
        SELECT * FROM guests
        WHERE (name ILIKE ${searchPattern} OR mobile ILIKE ${searchPattern} OR email ILIKE ${searchPattern} OR invite_code ILIKE ${searchPattern})
          AND rsvp_status = ${status}
        ORDER BY id DESC
      `;
    } else if (search) {
      const searchPattern = `%${search}%`;
      guests = await sql`
        SELECT * FROM guests
        WHERE name ILIKE ${searchPattern} OR mobile ILIKE ${searchPattern} OR email ILIKE ${searchPattern} OR invite_code ILIKE ${searchPattern}
        ORDER BY id DESC
      `;
    } else if (status !== 'all') {
      guests = await sql`
        SELECT * FROM guests
        WHERE rsvp_status = ${status}
        ORDER BY id DESC
      `;
    } else {
      guests = await sql`
        SELECT * FROM guests
        ORDER BY id DESC
      `;
    }

    return NextResponse.json({ success: true, guests });
  } catch (error: unknown) {
    console.error('Fetch guests error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch guests' },
      { status: 500 }
    );
  }
}

// POST: Add single guest or bulk guests via CSV
export async function POST(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Support bulk insertion for CSV upload
    const guestList = Array.isArray(body) ? body : Array.isArray(body?.guests) ? body.guests : null;

    if (guestList) {
      if (guestList.length === 0) {
        return NextResponse.json({ error: 'No guests found in upload' }, { status: 400 });
      }

      let insertedCount = 0;
      const insertedGuests = [];

      for (const g of guestList) {
        const name = g.name?.trim();
        const mobile = g.mobile?.trim();
        if (!name || !mobile) continue;

        const title = g.title?.trim() || 'Mr.';
        const email = g.email?.trim() || null;
        const randomCode = 'DITVI-' + Math.floor(1000 + Math.random() * 9000);

        const res = await sql`
          INSERT INTO guests (title, name, mobile, email, invite_code, rsvp_status, invited)
          VALUES (${title}, ${name}, ${mobile}, ${email}, ${randomCode}, 'pending', true)
          RETURNING *
        `;
        if (res.length > 0) {
          insertedCount++;
          insertedGuests.push(res[0]);
        }
      }

      return NextResponse.json({
        success: true,
        count: insertedCount,
        guests: insertedGuests
      });
    }

    // Single guest addition
    const { title = 'Mr.', name, mobile, email } = body;

    if (!name?.trim() || !mobile?.trim()) {
      return NextResponse.json({ error: 'Name and mobile number are required' }, { status: 400 });
    }

    // Generate cute invite code e.g. DITVI-8492
    const randomCode = 'DITVI-' + Math.floor(1000 + Math.random() * 9000);

    const inserted = await sql`
      INSERT INTO guests (title, name, mobile, email, invite_code, rsvp_status, invited)
      VALUES (${title}, ${name.trim()}, ${mobile.trim()}, ${email?.trim() || null}, ${randomCode}, 'pending', true)
      RETURNING *
    `;

    return NextResponse.json({ success: true, guest: inserted[0] });
  } catch (error: unknown) {
    console.error('Add guest error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to add guest' },
      { status: 500 }
    );
  }
}

// DELETE: Delete guest by id
export async function DELETE(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    await sql`
      DELETE FROM guests WHERE id = ${parseInt(id, 10)}
    `;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Delete guest error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to delete guest' },
      { status: 500 }
    );
  }
}

// PATCH: Update guest status or details
export async function PATCH(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, rsvp_status, invited, name, mobile, email, title } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    const updated = await sql`
      UPDATE guests
      SET 
        rsvp_status = COALESCE(${rsvp_status}, rsvp_status),
        invited = COALESCE(${invited}, invited),
        title = COALESCE(${title}, title),
        name = COALESCE(${name}, name),
        mobile = COALESCE(${mobile}, mobile),
        email = COALESCE(${email}, email)
      WHERE id = ${parseInt(id, 10)}
      RETURNING *
    `;

    return NextResponse.json({ success: true, guest: updated[0] });
  } catch (error: unknown) {
    console.error('Update guest error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to update guest' },
      { status: 500 }
    );
  }
}
