import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCustomerGmailConnection, sendGmailMessage } from '@/lib/customerGmail';
import { generateInvitationHtml, generateInvitationPlainText } from '@/lib/invitationTemplates';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/invitations/retry
 * Retries a failed invitation from history or guest table
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conn = await getCustomerGmailConnection(admin.id);
    if (!conn || !conn.connected || !conn.googleEmail) {
      return NextResponse.json({ error: 'Please connect your Gmail account before sending invitations.' }, { status: 400 });
    }

    const body = await req.json();
    const {
      guestId,
      historyId,
      subject = "You're Invited to My Birthday! 🎂",
      message = '',
      birthdayPersonName = 'Birthday Star',
      birthdayDate = 'Saturday, December 12, 2026',
      birthdayTime = '3:30 PM - 7:30 PM CST',
      birthdayLocation = 'Austin, TX',
      birthdayWebsiteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://birthday-panda.gracetechnologies.uk',
      hostName = admin.name || 'Birthday Star Family',
    } = body;

    let targetGuestId = guestId;
    let recipientEmail = '';
    let guestName = 'Valued Guest';

    if (historyId) {
      const hRows = await sql`
        SELECT guest_id, recipient_email FROM invitation_history 
        WHERE id = ${historyId} AND user_id = ${admin.id}
      `;
      if (hRows.length > 0) {
        targetGuestId = hRows[0].guest_id;
        recipientEmail = hRows[0].recipient_email;
      }
    }

    if (targetGuestId) {
      const gRows = await sql`
        SELECT id, name, email FROM guests 
        WHERE id = ${targetGuestId} AND user_id = ${admin.id}
      `;
      if (gRows.length > 0) {
        guestName = gRows[0].name;
        if (!recipientEmail) recipientEmail = gRows[0].email;
      }
    }

    if (!recipientEmail || !recipientEmail.includes('@')) {
      return NextResponse.json({ error: 'No valid recipient email address found for retry.' }, { status: 400 });
    }

    const templateData = {
      guestName,
      birthdayPersonName,
      birthdayDate,
      birthdayTime,
      birthdayLocation,
      birthdayWebsiteUrl,
      hostName,
      customMessage: message || undefined,
    };

    const htmlBody = generateInvitationHtml(templateData);
    const textBody = generateInvitationPlainText(templateData);

    const { messageId } = await sendGmailMessage({
      userId: admin.id,
      toEmail: recipientEmail,
      toName: guestName,
      fromName: hostName,
      subject,
      htmlBody,
      textBody,
    });

    if (targetGuestId) {
      await sql`
        UPDATE guests SET 
          invitation_status = 'sent',
          invited = TRUE,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${targetGuestId}
      `;
    }

    if (historyId) {
      await sql`
        UPDATE invitation_history SET 
          status = 'sent',
          gmail_message_id = ${messageId},
          attempt_count = attempt_count + 1,
          last_attempt_at = CURRENT_TIMESTAMP,
          sent_at = CURRENT_TIMESTAMP,
          error_message = NULL
        WHERE id = ${historyId}
      `;
    } else {
      await sql`
        INSERT INTO invitation_history (
          website_id, guest_id, user_id, recipient_email, subject, status, gmail_message_id, attempt_count, last_attempt_at, sent_at
        ) VALUES (
          'default', ${targetGuestId || null}, ${admin.id}, ${recipientEmail}, ${subject}, 'sent', ${messageId}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
      `;
    }

    return NextResponse.json({
      success: true,
      message: `Invitation successfully sent to ${guestName} (${recipientEmail})!`,
      gmailMessageId: messageId,
    });
  } catch (error: unknown) {
    console.error('Retry send error:', error);
    const message = error instanceof Error ? error.message : 'Failed to retry sending invitation';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
