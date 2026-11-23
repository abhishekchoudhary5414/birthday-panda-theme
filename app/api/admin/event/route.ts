import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET event details for admin
export async function GET(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await sql`SELECT key, value FROM event_settings`;
    const settingsMap: Record<string, string> = {};
    rows.forEach((r: any) => {
      settingsMap[r.key] = r.value || '';
    });

    const eventDetails = {
      eventTitle: settingsMap['event_title'] || "1st Birthday Celebration",
      childName: settingsMap['child_name'] || 'Birthday Star',
      turningAge: settingsMap['turning_age'] || '1',
      eventDate: settingsMap['event_date'] || 'Saturday, December 12, 2026',
      eventDateIso: settingsMap['event_date_iso'] || '2026-12-12',
      eventTime: settingsMap['event_time'] || '3:30 PM - 7:30 PM CST',
      venueName: settingsMap['venue_name'] || '',
      venueAddress: settingsMap['venue_address'] || '',
      venueCity: settingsMap['venue_city'] || '',
      venueMapUrl: settingsMap['venue_map_url'] || '',
      contactPhone: settingsMap['contact_phone'] || '',
      contactEmail: settingsMap['contact_email'] || '',
      dressCode: settingsMap['dress_code'] || 'Pastel forest tones, sage, cream, or panda-inspired accents',
      childPhotoUrl: settingsMap['child_photo_url'] || '',
    };

    return NextResponse.json({ success: true, event: eventDetails });
  } catch (error: unknown) {
    console.error('Admin fetch event settings error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch event settings' },
      { status: 500 }
    );
  }
}

// POST: Save event settings to database
export async function POST(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      eventTitle,
      childName,
      turningAge,
      eventDate,
      eventDateIso,
      eventTime,
      venueName,
      venueAddress,
      venueCity,
      venueMapUrl,
      contactPhone,
      contactEmail,
      dressCode,
      childPhotoUrl,
    } = body;

    const entries = [
      { key: 'event_title', value: eventTitle || "1st Birthday Celebration" },
      { key: 'child_name', value: childName || 'Birthday Star' },
      { key: 'turning_age', value: String(turningAge || '1') },
      { key: 'event_date', value: eventDate || 'Saturday, December 12, 2026' },
      { key: 'event_date_iso', value: eventDateIso || '2026-12-12' },
      { key: 'event_time', value: eventTime || '3:30 PM - 7:30 PM CST' },
      { key: 'venue_name', value: venueName || '' },
      { key: 'venue_address', value: venueAddress || '' },
      { key: 'venue_city', value: venueCity || '' },
      { key: 'venue_map_url', value: venueMapUrl || '' },
      { key: 'contact_phone', value: contactPhone || '' },
      { key: 'contact_email', value: contactEmail || '' },
      { key: 'dress_code', value: dressCode || 'Pastel forest tones, sage, cream, or panda-inspired accents' },
      { key: 'child_photo_url', value: childPhotoUrl || '' },
    ];

    for (const item of entries) {
      await sql`
        INSERT INTO event_settings (key, value)
        VALUES (${item.key}, ${item.value})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
    }

    return NextResponse.json({ success: true, message: 'Event details saved successfully' });
  } catch (error: unknown) {
    console.error('Admin save event settings error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to save event settings' },
      { status: 500 }
    );
  }
}

// DELETE: Delete venue details from database
export async function DELETE(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await sql`
      UPDATE event_settings
      SET value = ''
      WHERE key IN ('venue_name', 'venue_address', 'venue_city', 'venue_map_url')
    `;

    return NextResponse.json({ success: true, message: 'Venue details deleted successfully from database' });
  } catch (error: unknown) {
    console.error('Admin delete venue error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to delete venue' },
      { status: 500 }
    );
  }
}
