import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
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
    console.error('Fetch public event details error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch event details' },
      { status: 500 }
    );
  }
}
