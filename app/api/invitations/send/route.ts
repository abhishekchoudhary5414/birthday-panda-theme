import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCustomerGmailConnection, sendGmailMessage } from '@/lib/customerGmail';
import { generateInvitationHtml, generateInvitationPlainText } from '@/lib/invitationTemplates';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Helper to pause execution between sends for rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * POST /api/invitations/send
 * Controlled sequential batch sender with rate-limiting, duplicate protection, and history logging
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
      guestIds = [], // Array of numbers
      forceResend = false,
      subject = "You're Invited to My Birthday! 🎂",
      message = '',
      birthdayPersonName = 'Birthday Star',
      birthdayDate = 'Saturday, December 12, 2026',
      birthdayTime = '3:30 PM - 7:30 PM CST',
      birthdayLocation = 'Austin, TX',
      birthdayWebsiteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://birthday-panda.gracetechnologies.uk',
      hostName = admin.name || 'Birthday Star Family',
    } = body;

    if (!Array.isArray(guestIds) || guestIds.length === 0) {
      return NextResponse.json({ error: 'No recipients selected for sending.' }, { status: 400 });
    }

    // Retrieve selected guests with valid emails
    const guests = await sql`
      SELECT id, name, email, invitation_status 
      FROM guests 
      WHERE id = ANY(${guestIds}) AND (user_id = ${admin.id} OR user_id IS NULL)
    `;

    const validGuests = guests.filter((g: any) => g.email && g.email.includes('@'));
    if (validGuests.length === 0) {
      return NextResponse.json({ error: 'None of the selected guests have a valid email address.' }, { status: 400 });
    }

    let successCount = 0;
    let failedCount = 0;
    let skippedCount = 0;
    const results: Array<{ guestId: number; name: string; email: string; status: string; error?: string }> = [];

    for (const guest of validGuests) {
      // Prevent duplicate sending unless customer explicitly selects forceResend
      if (!forceResend && guest.invitation_status === 'sent') {
        skippedCount++;
        results.push({
          guestId: guest.id,
          name: guest.name,
          email: guest.email,
          status: 'skipped',
          error: 'Already sent previously',
        });
        continue;
      }

      const templateData = {
        guestName: guest.name,
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

      try {
        // Send email via customer's connected Gmail API
        const { messageId } = await sendGmailMessage({
          userId: admin.id,
          toEmail: guest.email,
          toName: guest.name,
          fromName: hostName,
          subject,
          htmlBody,
          textBody,
        });

        successCount++;

        // Update guest table status
        await sql`
          UPDATE guests SET 
            invitation_status = 'sent',
            invited = TRUE,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${guest.id}
        `;

        // Log into invitation_history
        await sql`
          INSERT INTO invitation_history (
            website_id, guest_id, user_id, recipient_email, subject, status, gmail_message_id, attempt_count, last_attempt_at, sent_at
          ) VALUES (
            'default', ${guest.id}, ${admin.id}, ${guest.email}, ${subject}, 'sent', ${messageId}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
        `;

        results.push({
          guestId: guest.id,
          name: guest.name,
          email: guest.email,
          status: 'sent',
        });

        // Safe rate-limiting delay between sends (300ms) to respect Gmail quotas
        await delay(300);
      } catch (err: unknown) {
        failedCount++;
        const errorMsg = err instanceof Error ? err.message : 'Send error';

        await sql`
          UPDATE guests SET 
            invitation_status = 'failed',
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${guest.id}
        `;

        await sql`
          INSERT INTO invitation_history (
            website_id, guest_id, user_id, recipient_email, subject, status, attempt_count, last_attempt_at, error_message
          ) VALUES (
            'default', ${guest.id}, ${admin.id}, ${guest.email}, ${subject}, 'failed', 1, CURRENT_TIMESTAMP, ${errorMsg}
          )
        `;

        results.push({
          guestId: guest.id,
          name: guest.name,
          email: guest.email,
          status: 'failed',
          error: errorMsg,
        });
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalSelected: validGuests.length,
        sent: successCount,
        failed: failedCount,
        skipped: skippedCount,
      },
      results,
    });
  } catch (error: unknown) {
    console.error('Batch send error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send invitations';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
