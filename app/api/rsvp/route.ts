import { NextRequest, NextResponse } from 'next/server';
import { sql, getDefaultOwnerUserId } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    const body = await req.json();
    const {
      title = 'Mr.',
      fullName,
      phone,
      email,
      attending = 'yes',
      guestsCount = 1,
      dietary = '',
      allergies = '',
      message = '',
      userId,
    } = body;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    let targetUserId = admin?.id || (userId ? Number(userId) : null);
    if (!targetUserId) {
      targetUserId = await getDefaultOwnerUserId();
    }

    const cleanTitle = title ? title.trim() : 'Mr.';
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const rsvpStatus = attending === 'yes' ? 'attending' : 'declined';
    const parsedGuestsCount = parseInt(guestsCount, 10) || 1;

    // 1. Ensure rsvps table exists
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        title VARCHAR(50) DEFAULT 'Mr.',
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        attending VARCHAR(20) NOT NULL,
        guests_count INTEGER DEFAULT 1,
        dietary VARCHAR(100),
        allergies TEXT,
        message TEXT,
        user_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Ensure title and user_id columns exist in case table was created earlier
    try {
      await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS title VARCHAR(50) DEFAULT 'Mr.'`;
      await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS user_id INTEGER`;
    } catch {
      // ignore
    }

    // 2. Disallow duplicate RSVP by email for the same user/event
    if (trimmedEmail) {
      const existingRsvp = await sql`
        SELECT id, title, full_name, attending, guests_count, created_at 
        FROM rsvps 
        WHERE LOWER(email) = ${trimmedEmail} AND user_id = ${targetUserId}
        LIMIT 1
      `;
      if (existingRsvp && existingRsvp.length > 0) {
        const isAttending = existingRsvp[0].attending === 'yes';
        const displayGreetingName = `${existingRsvp[0].title ? existingRsvp[0].title + ' ' : ''}${existingRsvp[0].full_name}`;
        return NextResponse.json(
          {
            error: isAttending
              ? `Warm greetings! An RSVP has already been confirmed for ${displayGreetingName} (${trimmedEmail}). You are happily ON THE GUEST LIST! We can't wait to celebrate together.`
              : `Thank you for checking! An RSVP was previously received for ${displayGreetingName} (${trimmedEmail}) indicating you are unable to attend. We will miss you dearly!`,
            isDuplicateEmail: true,
            attending: existingRsvp[0].attending,
            title: existingRsvp[0].title,
            fullName: existingRsvp[0].full_name,
            email: trimmedEmail,
            guestsCount: existingRsvp[0].guests_count,
            existingRSVP: existingRsvp[0],
          },
          { status: 409 }
        );
      }
    }

    const inserted = await sql`
      INSERT INTO rsvps (title, full_name, phone, email, attending, guests_count, dietary, allergies, message, user_id)
      VALUES (
        ${cleanTitle},
        ${trimmedName},
        ${trimmedPhone},
        ${trimmedEmail},
        ${attending},
        ${parsedGuestsCount},
        ${dietary ? dietary.trim() : null},
        ${allergies ? allergies.trim() : null},
        ${message ? message.trim() : null},
        ${targetUserId}
      )
      RETURNING *
    `;

    // 2. Also sync with guests table for this user:
    try {
      const existing = await sql`
        SELECT id FROM guests WHERE mobile = ${trimmedPhone} AND user_id = ${targetUserId} LIMIT 1
      `;

      if (existing && existing.length > 0) {
        await sql`
          UPDATE guests
          SET title = ${cleanTitle},
              rsvp_status = ${rsvpStatus},
              email = COALESCE(${trimmedEmail}, email),
              notes = COALESCE(${message ? message.trim() : null}, notes)
          WHERE id = ${existing[0].id} AND user_id = ${targetUserId}
        `;
      } else {
        const randomCode = 'PANDA-' + Math.floor(1000 + Math.random() * 9000);
        await sql`
          INSERT INTO guests (title, name, mobile, email, invite_code, rsvp_status, invited, notes, user_id)
          VALUES (${cleanTitle}, ${trimmedName}, ${trimmedPhone}, ${trimmedEmail}, ${randomCode}, ${rsvpStatus}, true, ${message ? message.trim() : null}, ${targetUserId})
        `;
      }
    } catch (guestSyncErr) {
      console.warn('Note: guest sync in guests table non-fatal warning:', guestSyncErr);
    }

    return NextResponse.json({
      success: true,
      data: inserted[0],
      message: 'RSVP saved successfully to database',
    });
  } catch (error: unknown) {
    console.error('Error saving RSVP to database:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to save RSVP' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    const { searchParams } = new URL(req.url);
    const emailCheck = searchParams.get('email');
    const queryUserId = searchParams.get('userId');

    let targetUserId = admin?.id || (queryUserId ? Number(queryUserId) : null);
    if (!targetUserId) {
      targetUserId = await getDefaultOwnerUserId();
    }

    // Quick lookup by email for pre-checking RSVP status
    if (emailCheck && emailCheck.trim()) {
      const cleanEmail = emailCheck.trim().toLowerCase();
      const existing = await sql`
        SELECT id, full_name, attending, guests_count, dietary, allergies, message, created_at 
        FROM rsvps 
        WHERE LOWER(email) = ${cleanEmail} AND user_id = ${targetUserId}
        LIMIT 1
      `;
      if (existing.length > 0) {
        return NextResponse.json({
          success: true,
          exists: true,
          rsvp: existing[0],
        });
      }
      return NextResponse.json({ success: true, exists: false });
    }

    const rsvps = await sql`
      SELECT * FROM rsvps WHERE user_id = ${targetUserId} ORDER BY id DESC
    `;

    return NextResponse.json({ success: true, rsvps });
  } catch (error: unknown) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}
