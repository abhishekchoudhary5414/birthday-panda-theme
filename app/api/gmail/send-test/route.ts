import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getCustomerGmailConnection, sendGmailMessage } from '@/lib/customerGmail';
import { generateInvitationHtml, generateInvitationPlainText } from '@/lib/invitationTemplates';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/gmail/send-test
 * Sends a personalized test email to the customer's own connected Gmail address.
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
      return NextResponse.json({ error: 'Please connect your Gmail account before sending test emails.' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      subject = "You're Invited to My Birthday! 🎂",
      message = '',
      birthdayPersonName = 'Ditvi',
      birthdayDate = 'Saturday, December 12, 2026',
      birthdayTime = '3:30 PM - 7:30 PM CST',
      birthdayLocation = 'Austin, TX',
      birthdayWebsiteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://birthday-panda.gracetechnologies.uk',
      hostName = admin.name || 'Birthday Star Family',
    } = body;

    const templateData = {
      guestName: admin.name || 'Sample Guest',
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

    const testSubject = `[TEST] ${subject}`;

    const { messageId } = await sendGmailMessage({
      userId: admin.id,
      toEmail: conn.googleEmail,
      toName: admin.name || 'Host',
      fromName: hostName,
      subject: testSubject,
      htmlBody,
      textBody,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to your connected account (${conn.googleEmail})!`,
      gmailMessageId: messageId,
    });
  } catch (error: unknown) {
    console.error('Send test email error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send test email';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
