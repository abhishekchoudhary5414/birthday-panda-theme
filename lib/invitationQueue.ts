import { sql } from '@/lib/db';
import { sendGmailMessage } from '@/lib/customerGmail';
import { generateInvitationHtml, generateInvitationPlainText } from '@/lib/invitationTemplates';

export interface CampaignQueueStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  cancelled: number;
  retrying: number;
  progressPercent: number;
}

// Memory lock to prevent simultaneous sender loops running on the same campaign
const activeCampaignLocks = new Set<number>();

/**
 * Returns random integer between min and max seconds inclusive
 */
export function getRandomDelayMs(minSec: number = 10, maxSec: number = 30): number {
  const min = Math.max(1, minSec);
  const max = Math.max(min, maxSec);
  const sec = Math.floor(Math.random() * (max - min + 1)) + min;
  return sec * 1000;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Validates email format strictly
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim());
}

/**
 * Checks if email has opted out of invitations for this host
 */
export async function isEmailOptedOut(userId: number, email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const rows = await sql`
    SELECT id FROM email_opt_outs 
    WHERE user_id = ${userId} AND LOWER(email) = ${cleanEmail}
    LIMIT 1
  `;
  return rows.length > 0;
}

/**
 * Adds an email to the opt-out list
 */
export async function addEmailOptOut(userId: number, email: string, reason: string = 'User opted out'): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  await sql`
    INSERT INTO email_opt_outs (user_id, email, reason)
    VALUES (${userId}, ${cleanEmail}, ${reason})
    ON CONFLICT (user_id, email) DO NOTHING
  `;
}

/**
 * Removes an email from opt-out list
 */
export async function removeEmailOptOut(userId: number, email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  await sql`
    DELETE FROM email_opt_outs 
    WHERE user_id = ${userId} AND LOWER(email) = ${cleanEmail}
  `;
}

/**
 * Retrieves campaign progress statistics
 */
export async function getCampaignStats(campaignId: number): Promise<CampaignQueueStats> {
  const rows = await sql`
    SELECT 
      COUNT(*)::int as total,
      COUNT(CASE WHEN status = 'sent' THEN 1 END)::int as sent,
      COUNT(CASE WHEN status = 'failed' THEN 1 END)::int as failed,
      COUNT(CASE WHEN status = 'pending' THEN 1 END)::int as pending,
      COUNT(CASE WHEN status = 'cancelled' THEN 1 END)::int as cancelled,
      COUNT(CASE WHEN status = 'retrying' THEN 1 END)::int as retrying
    FROM invitation_queue
    WHERE campaign_id = ${campaignId}
  `;

  const s = rows[0] || { total: 0, sent: 0, failed: 0, pending: 0, cancelled: 0, retrying: 0 };
  const finished = s.sent + s.failed + s.cancelled;
  const progressPercent = s.total > 0 ? Math.round((finished / s.total) * 100) : 0;

  return {
    total: s.total,
    sent: s.sent,
    failed: s.failed,
    pending: s.pending,
    cancelled: s.cancelled,
    retrying: s.retrying,
    progressPercent,
  };
}

/**
 * Worker: Process Next Item in Campaign Queue
 * Handles:
 * - Exponential backoff on rate limits
 * - Permanent vs retryable failure detection
 * - Opt-out checks
 * - Randomized delays between emails
 * - Pauses & cancellation support
 */
export async function processCampaignQueue(campaignId: number): Promise<void> {
  if (activeCampaignLocks.has(campaignId)) {
    console.log(`Campaign ${campaignId} already has an active worker processing. Skipping redundant run.`);
    return;
  }

  activeCampaignLocks.add(campaignId);

  try {
    while (true) {
      // 1. Check campaign current status
      const campRows = await sql`
        SELECT id, user_id, status, subject, custom_message, birthday_person_name,
               birthday_date, birthday_time, birthday_location, birthday_website_url,
               host_name, min_delay_seconds, max_delay_seconds, consecutive_rate_limits
        FROM invitation_campaigns
        WHERE id = ${campaignId}
      `;

      if (campRows.length === 0) break;
      const campaign = campRows[0];

      if (campaign.status === 'paused' || campaign.status === 'cancelled' || campaign.status === 'completed') {
        break;
      }

      // 2. Fetch the next pending or retrying item ready for processing
      const itemRows = await sql`
        SELECT id, guest_id, recipient_name, recipient_email, attempts, max_attempts
        FROM invitation_queue
        WHERE campaign_id = ${campaignId} 
          AND status IN ('pending', 'retrying')
          AND scheduled_for <= CURRENT_TIMESTAMP
        ORDER BY id ASC
        LIMIT 1
      `;

      if (itemRows.length === 0) {
        // Check if there are any future retrying items
        const futureItems = await sql`
          SELECT COUNT(*)::int as count FROM invitation_queue
          WHERE campaign_id = ${campaignId} AND status IN ('pending', 'retrying')
        `;

        if (futureItems[0]?.count === 0) {
          // Mark campaign completed
          await sql`
            UPDATE invitation_campaigns 
            SET status = 'completed', updated_at = CURRENT_TIMESTAMP
            WHERE id = ${campaignId}
          `;
        }
        break;
      }

      const item = itemRows[0];

      // Mark status as 'sending'
      await sql`
        UPDATE invitation_queue 
        SET status = 'sending', attempts = attempts + 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${item.id}
      `;

      // Check opt-out list
      const isOptedOut = await isEmailOptedOut(campaign.user_id, item.recipient_email);
      if (isOptedOut) {
        await sql`
          UPDATE invitation_queue
          SET status = 'cancelled', error_message = 'Recipient is in opt-out list', processed_at = CURRENT_TIMESTAMP
          WHERE id = ${item.id}
        `;
        continue;
      }

      // Prepare email payload
      const templateData = {
        guestName: item.recipient_name || 'Valued Guest',
        birthdayPersonName: campaign.birthday_person_name || 'Ditvi',
        birthdayDate: campaign.birthday_date || 'Saturday, December 12, 2026',
        birthdayTime: campaign.birthday_time || '3:30 PM - 7:30 PM CST',
        birthdayLocation: campaign.birthday_location || 'Austin, TX',
        birthdayWebsiteUrl: campaign.birthday_website_url || process.env.NEXT_PUBLIC_APP_URL || 'https://birthday-panda.gracetechnologies.uk',
        hostName: campaign.host_name || 'Birthday Star Family',
        customMessage: campaign.custom_message || undefined,
      };

      const htmlBody = generateInvitationHtml(templateData);
      const textBody = generateInvitationPlainText(templateData);

      try {
        const { messageId } = await sendGmailMessage({
          userId: campaign.user_id,
          toEmail: item.recipient_email,
          toName: item.recipient_name,
          subject: campaign.subject,
          htmlBody,
          textBody,
        });

        // Mark as sent
        await sql`
          UPDATE invitation_queue 
          SET status = 'sent', gmail_message_id = ${messageId}, processed_at = CURRENT_TIMESTAMP, error_message = NULL
          WHERE id = ${item.id}
        `;

        // Update campaign counts & reset consecutive rate limits
        await sql`
          UPDATE invitation_campaigns 
          SET sent_count = sent_count + 1, consecutive_rate_limits = 0, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${campaignId}
        `;

        // Update guest table if linked
        if (item.guest_id) {
          await sql`
            UPDATE guests 
            SET invitation_status = 'sent', invited = TRUE, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${item.guest_id}
          `;
        }

        // Log into invitation_history
        await sql`
          INSERT INTO invitation_history (
            campaign_id, website_id, guest_id, user_id, recipient_email, subject, status, gmail_message_id, attempt_count, last_attempt_at, sent_at
          ) VALUES (
            ${campaignId}, 'default', ${item.guest_id}, ${campaign.user_id}, ${item.recipient_email}, ${campaign.subject}, 'sent', ${messageId}, ${item.attempts + 1}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )
        `;

        // Apply randomized delay between emails (e.g., 10–30 seconds)
        const delayMs = getRandomDelayMs(campaign.min_delay_seconds || 10, campaign.max_delay_seconds || 30);
        await sleep(delayMs);

      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Send error';
        const isRateLimit = errorMsg.includes('429') || errorMsg.toLowerCase().includes('rate limit') || errorMsg.toLowerCase().includes('quota');
        const isAuthError = errorMsg.toLowerCase().includes('invalid_grant') || errorMsg.toLowerCase().includes('unauthorized') || errorMsg.toLowerCase().includes('token');

        if (isAuthError) {
          // Pause campaign immediately upon token failure
          await sql`
            UPDATE invitation_campaigns
            SET status = 'paused', updated_at = CURRENT_TIMESTAMP
            WHERE id = ${campaignId}
          `;
          await sql`
            UPDATE invitation_queue
            SET status = 'failed', error_message = 'Gmail token expired or revoked. Please reconnect Gmail.', processed_at = CURRENT_TIMESTAMP
            WHERE id = ${item.id}
          `;
          break;
        }

        if (isRateLimit) {
          const consecutive = (campaign.consecutive_rate_limits || 0) + 1;
          if (consecutive >= 3) {
            // Auto pause campaign after 3 consecutive rate limit errors
            await sql`
              UPDATE invitation_campaigns
              SET status = 'paused', consecutive_rate_limits = ${consecutive}, updated_at = CURRENT_TIMESTAMP
              WHERE id = ${campaignId}
            `;
            await sql`
              UPDATE invitation_queue
              SET status = 'retrying', error_message = 'Paused due to Gmail rate limit. Will retry when resumed.', updated_at = CURRENT_TIMESTAMP
              WHERE id = ${item.id}
            `;
            break;
          }

          // Exponential backoff: 60s, 120s, 240s
          const backoffSec = Math.min(300, 60 * Math.pow(2, item.attempts));
          await sql`
            UPDATE invitation_queue
            SET status = 'retrying', error_message = ${errorMsg},
                scheduled_for = CURRENT_TIMESTAMP + (${backoffSec} * INTERVAL '1 second'),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${item.id}
          `;

          await sql`
            UPDATE invitation_campaigns
            SET consecutive_rate_limits = ${consecutive}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${campaignId}
          `;

          // Sleep before attempting next
          await sleep(backoffSec * 1000);
        } else {
          // General failure: retry up to max_attempts, then mark permanent fail
          const nextAttempts = item.attempts + 1;
          if (nextAttempts < (item.max_attempts || 3)) {
            const backoffSec = 30 * nextAttempts;
            await sql`
              UPDATE invitation_queue
              SET status = 'retrying', error_message = ${errorMsg},
                  scheduled_for = CURRENT_TIMESTAMP + (${backoffSec} * INTERVAL '1 second'),
                  updated_at = CURRENT_TIMESTAMP
              WHERE id = ${item.id}
            `;
          } else {
            // Permanent failure
            await sql`
              UPDATE invitation_queue
              SET status = 'failed', error_message = ${errorMsg}, processed_at = CURRENT_TIMESTAMP
              WHERE id = ${item.id}
            `;
            await sql`
              UPDATE invitation_campaigns
              SET failed_count = failed_count + 1, updated_at = CURRENT_TIMESTAMP
              WHERE id = ${campaignId}
            `;
            if (item.guest_id) {
              await sql`
                UPDATE guests 
                SET invitation_status = 'failed', updated_at = CURRENT_TIMESTAMP
                WHERE id = ${item.guest_id}
              `;
            }
          }
        }
      }
    }
  } finally {
    activeCampaignLocks.delete(campaignId);
  }
}
