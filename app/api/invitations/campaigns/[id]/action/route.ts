import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { processCampaignQueue, getCampaignStats } from '@/lib/invitationQueue';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaignId = Number(id);

    if (!campaignId || isNaN(campaignId)) {
      return NextResponse.json({ success: false, error: 'Invalid campaign ID' }, { status: 400 });
    }

    const body = await req.json();
    const { action } = body; // 'pause' | 'resume' | 'cancel'

    const rows = await sql`
      SELECT id, status FROM invitation_campaigns WHERE id = ${campaignId}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
    }

    const currentStatus = rows[0].status;

    if (action === 'pause') {
      if (currentStatus === 'completed' || currentStatus === 'cancelled') {
        return NextResponse.json({ success: false, error: `Cannot pause a ${currentStatus} campaign` }, { status: 400 });
      }

      await sql`
        UPDATE invitation_campaigns 
        SET status = 'paused', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${campaignId}
      `;

      return NextResponse.json({ success: true, status: 'paused', message: 'Campaign paused' });
    }

    if (action === 'resume') {
      if (currentStatus !== 'paused') {
        return NextResponse.json({ success: false, error: `Only paused campaigns can be resumed` }, { status: 400 });
      }

      await sql`
        UPDATE invitation_campaigns 
        SET status = 'running', consecutive_rate_limits = 0, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${campaignId}
      `;

      // Trigger background processing
      void processCampaignQueue(campaignId).catch((err) => {
        console.error(`Background campaign runner resume error for campaign ${campaignId}:`, err);
      });

      return NextResponse.json({ success: true, status: 'running', message: 'Campaign resumed' });
    }

    if (action === 'cancel') {
      if (currentStatus === 'completed') {
        return NextResponse.json({ success: false, error: 'Cannot cancel an already completed campaign' }, { status: 400 });
      }

      await sql`
        UPDATE invitation_campaigns 
        SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${campaignId}
      `;

      // Cancel remaining pending/retrying items in queue
      await sql`
        UPDATE invitation_queue
        SET status = 'cancelled', error_message = 'Campaign cancelled by host', processed_at = CURRENT_TIMESTAMP
        WHERE campaign_id = ${campaignId} AND status IN ('pending', 'retrying')
      `;

      return NextResponse.json({ success: true, status: 'cancelled', message: 'Campaign cancelled' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action. Expected pause, resume, or cancel.' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// GET: Single campaign details and full queue stats
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaignId = Number(id);

    const rows = await sql`
      SELECT * FROM invitation_campaigns WHERE id = ${campaignId}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
    }

    const stats = await getCampaignStats(campaignId);

    // Fetch sample queue items
    const queueItems = await sql`
      SELECT id, recipient_name, recipient_email, status, attempts, error_message, scheduled_for, processed_at
      FROM invitation_queue
      WHERE campaign_id = ${campaignId}
      ORDER BY id ASC
      LIMIT 100
    `;

    return NextResponse.json({
      success: true,
      campaign: rows[0],
      stats,
      items: queueItems,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
