import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCampaignStats, isValidEmail, isEmailOptedOut, processCampaignQueue } from '@/lib/invitationQueue';

export const dynamic = 'force-dynamic';

// GET: List recent campaigns with queue statistics
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId') || '1');

    const campaigns = await sql`
      SELECT 
        id, user_id, title, subject, status, total_recipients, sent_count, failed_count,
        min_delay_seconds, max_delay_seconds, consecutive_rate_limits, created_at, updated_at
      FROM invitation_campaigns
      WHERE user_id = ${userId}
      ORDER BY id DESC
      LIMIT 10
    `;

    // Augment with live stats
    const enriched = await Promise.all(
      campaigns.map(async (c) => {
        const stats = await getCampaignStats(c.id);
        return {
          ...c,
          stats,
        };
      })
    );

    return NextResponse.json({ success: true, campaigns: enriched });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST: Create a new sending campaign & queue invitations
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId = 1,
      title = 'Birthday Invitation Campaign',
      subject = "You're Invited to Ditvi's 1st Birthday! 🎂",
      customMessage = '',
      birthdayPersonName = 'Ditvi',
      birthdayDate = 'Saturday, December 12, 2026',
      birthdayTime = '3:30 PM - 7:30 PM CST',
      birthdayLocation = 'Austin, TX',
      birthdayWebsiteUrl = 'https://birthday-panda.gracetechnologies.uk',
      hostName = 'Birthday Star Family',
      minDelaySeconds = 10,
      maxDelaySeconds = 30,
      recipients = [], // Array of { id?: number, name?: string, email: string }
    } = body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one recipient is required' }, { status: 400 });
    }

    // 1. Verify user has a connected Gmail account
    const connRows = await sql`
      SELECT id, google_email, connected FROM gmail_connections 
      WHERE user_id = ${userId} AND connected = TRUE
      LIMIT 1
    `;

    if (connRows.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No active Gmail connection found for this account. Please connect Gmail first.',
      }, { status: 400 });
    }

    // 2. Validate and deduplicate recipients
    const uniqueMap = new Map<string, { guestId: number | null; name: string; email: string }>();
    const invalidEmails: string[] = [];
    const optedOutEmails: string[] = [];

    for (const r of recipients) {
      const email = (r.email || '').trim().toLowerCase();
      if (!isValidEmail(email)) {
        invalidEmails.push(email);
        continue;
      }

      const optedOut = await isEmailOptedOut(userId, email);
      if (optedOut) {
        optedOutEmails.push(email);
        continue;
      }

      if (!uniqueMap.has(email)) {
        uniqueMap.set(email, {
          guestId: r.id ? Number(r.id) : null,
          name: (r.name || '').trim(),
          email,
        });
      }
    }

    const validRecipients = Array.from(uniqueMap.values());
    if (validRecipients.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No eligible recipients found to send invitations to (all were duplicates, invalid, or opted-out).',
        invalidEmails,
        optedOutEmails,
      }, { status: 400 });
    }

    // 3. Create campaign record
    const campaignRows = await sql`
      INSERT INTO invitation_campaigns (
        user_id, title, subject, custom_message, birthday_person_name,
        birthday_date, birthday_time, birthday_location, birthday_website_url,
        host_name, status, total_recipients, sent_count, failed_count,
        min_delay_seconds, max_delay_seconds
      ) VALUES (
        ${userId}, ${title}, ${subject}, ${customMessage}, ${birthdayPersonName},
        ${birthdayDate}, ${birthdayTime}, ${birthdayLocation}, ${birthdayWebsiteUrl},
        ${hostName}, 'running', ${validRecipients.length}, 0, 0,
        ${Number(minDelaySeconds) || 10}, ${Number(maxDelaySeconds) || 30}
      )
      RETURNING id, title, status, total_recipients, created_at
    `;

    const campaign = campaignRows[0];

    // 4. Batch insert into invitation_queue with ON CONFLICT DO NOTHING (prevents duplicates in same campaign)
    for (const rec of validRecipients) {
      await sql`
        INSERT INTO invitation_queue (
          campaign_id, guest_id, recipient_email, recipient_name, status, attempts, max_attempts, scheduled_for
        ) VALUES (
          ${campaign.id}, ${rec.guestId}, ${rec.email}, ${rec.name}, 'pending', 0, 3, CURRENT_TIMESTAMP
        )
        ON CONFLICT (campaign_id, recipient_email) DO NOTHING
      `;
    }

    // 5. Kick off queue worker asynchronously in background (do not block the response)
    void processCampaignQueue(campaign.id).catch((err) => {
      console.error(`Background campaign runner error for campaign ${campaign.id}:`, err);
    });

    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      totalEnqueued: validRecipients.length,
      skippedInvalid: invalidEmails.length,
      skippedOptedOut: optedOutEmails.length,
      message: `Queue created with ${validRecipients.length} invitations. Sending has started in the background.`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
