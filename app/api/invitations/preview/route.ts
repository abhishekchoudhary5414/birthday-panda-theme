import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { generateInvitationHtml, generateInvitationPlainText } from '@/lib/invitationTemplates';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/invitations/preview
 * Generates rendered HTML and plain-text email previews for selected guest
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      guestId,
      guestName: customGuestName,
      subject = "You're Invited to My Birthday! 🎂",
      message = '',
      birthdayPersonName = 'Birthday Star',
      birthdayDate = 'Saturday, December 12, 2026',
      birthdayTime = '3:30 PM - 7:30 PM CST',
      birthdayLocation = 'Austin, TX',
      birthdayWebsiteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://birthday-panda.gracetechnologies.uk',
      hostName = admin.name || 'Birthday Star Family',
    } = body;

    let targetGuestName = customGuestName || 'Valued Guest';

    if (guestId) {
      const rows = await sql`
        SELECT name FROM guests WHERE id = ${parseInt(guestId, 10)} AND (user_id = ${admin.id} OR user_id IS NULL)
      `;
      if (rows.length > 0 && rows[0].name) {
        targetGuestName = rows[0].name;
      }
    }

    const templateData = {
      guestName: targetGuestName,
      birthdayPersonName,
      birthdayDate,
      birthdayTime,
      birthdayLocation,
      birthdayWebsiteUrl,
      hostName,
      customMessage: message || undefined,
    };

    const html = generateInvitationHtml(templateData);
    const plainText = generateInvitationPlainText(templateData);

    return NextResponse.json({
      success: true,
      preview: {
        subject,
        html,
        plainText,
        guestName: targetGuestName,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate preview';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
