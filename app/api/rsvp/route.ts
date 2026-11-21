import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      attending = 'yes',
      guestsCount = 1,
      dietary = '',
      allergies = '',
      message = '',
    } = body;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email ? email.trim() : null;
    const rsvpStatus = attending === 'yes' ? 'attending' : 'declined';
    const parsedGuestsCount = parseInt(guestsCount, 10) || 1;

    // 1. Ensure rsvps table exists and insert RSVP record
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        attending VARCHAR(20) NOT NULL,
        guests_count INTEGER DEFAULT 1,
        dietary VARCHAR(100),
        allergies TEXT,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const inserted = await sql`
      INSERT INTO rsvps (full_name, phone, email, attending, guests_count, dietary, allergies, message)
      VALUES (
        ${trimmedName},
        ${trimmedPhone},
        ${trimmedEmail},
        ${attending},
        ${parsedGuestsCount},
        ${dietary ? dietary.trim() : null},
        ${allergies ? allergies.trim() : null},
        ${message ? message.trim() : null}
      )
      RETURNING *
    `;

    // 2. Also sync with guests table:
    // If a guest with this phone/mobile exists, update their rsvp_status
    // If not, automatically register them in guests table
    try {
      const existing = await sql`
        SELECT id FROM guests WHERE mobile = ${trimmedPhone} LIMIT 1
      `;

      if (existing && existing.length > 0) {
        await sql`
          UPDATE guests
          SET rsvp_status = ${rsvpStatus},
              email = COALESCE(${trimmedEmail}, email),
              notes = COALESCE(${message ? message.trim() : null}, notes)
          WHERE id = ${existing[0].id}
        `;
      } else {
        const randomCode = 'DITVI-' + Math.floor(1000 + Math.random() * 9000);
        await sql`
          INSERT INTO guests (title, name, mobile, email, invite_code, rsvp_status, invited, notes)
          VALUES ('Mr./Ms.', ${trimmedName}, ${trimmedPhone}, ${trimmedEmail}, ${randomCode}, ${rsvpStatus}, true, ${message ? message.trim() : null})
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
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        attending VARCHAR(20) NOT NULL,
        guests_count INTEGER DEFAULT 1,
        dietary VARCHAR(100),
        allergies TEXT,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const rsvps = await sql`
      SELECT * FROM rsvps ORDER BY id DESC
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
