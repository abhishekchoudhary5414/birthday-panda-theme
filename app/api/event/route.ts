import { NextRequest, NextResponse } from 'next/server';
import { sql, getDefaultOwnerUserId } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { getCached, setCached } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get('userId');

    let targetUserId = admin?.id || (queryUserId ? Number(queryUserId) : null);
    if (!targetUserId) {
      targetUserId = await getDefaultOwnerUserId();
    }

    const cacheKey = `public_event_details_${targetUserId}`;
    if (!admin) {
      const cached = getCached(cacheKey, 60000);
      if (cached) {
        return NextResponse.json(cached, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        });
      }
    }

    const rows = await sql`SELECT key, value FROM event_settings WHERE user_id = ${targetUserId}`;
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

    const payload = { success: true, event: eventDetails };
    if (!admin) {
      setCached(cacheKey, payload);
    }

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': admin ? 'no-store' : 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: unknown) {
    console.error('Fetch public event details error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch event details' },
      { status: 500 }
    );
  }
}
