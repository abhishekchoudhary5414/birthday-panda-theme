import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

/**
 * POST /api/invitations/import
 * Bulk import guests via CSV array with deduplication and validation
 */
export async function POST(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { guests: rawGuests, deduplicate = true } = body;

    if (!Array.isArray(rawGuests) || rawGuests.length === 0) {
      return NextResponse.json({ error: 'No guests data provided for import' }, { status: 400 });
    }

    // Get existing emails for deduplication
    const existingRows = await sql`
      SELECT LOWER(email) as email FROM guests WHERE email IS NOT NULL AND (user_id = ${admin.id} OR user_id IS NULL)
    `;
    const existingEmails = new Set(existingRows.map((r: any) => r.email));

    let importedCount = 0;
    let duplicateCount = 0;
    const seenInBatch = new Set<string>();

    for (const g of rawGuests) {
      const name = (g.name || g.Name || '').trim();
      const rawEmail = (g.email || g.Email || '').trim().toLowerCase();
      const mobile = (g.mobile || g.Mobile || g.phone || g.Phone || '').trim();
      const notes = (g.notes || g.Notes || '').trim();
      const title = (g.title || g.Title || 'Mr.').trim();

      if (!name) continue;

      if (rawEmail) {
        if (deduplicate && (existingEmails.has(rawEmail) || seenInBatch.has(rawEmail))) {
          duplicateCount++;
          continue;
        }
        seenInBatch.add(rawEmail);
      }

      const inviteCode = 'PANDA-' + Math.random().toString(36).substring(2, 6).toUpperCase();

      await sql`
        INSERT INTO guests (name, email, mobile, title, notes, invite_code, rsvp_status, invitation_status, user_id)
        VALUES (${name}, ${rawEmail || null}, ${mobile}, ${title}, ${notes}, ${inviteCode}, 'pending', 'pending', ${admin.id})
      `;
      importedCount++;
    }

    return NextResponse.json({
      success: true,
      importedCount,
      duplicateCount,
      message: `Successfully imported ${importedCount} guest${importedCount === 1 ? '' : 's'}${duplicateCount > 0 ? ` (${duplicateCount} duplicate email(s) skipped)` : ''}.`,
    });
  } catch (error: unknown) {
    console.error('Import guests error:', error);
    const message = error instanceof Error ? error.message : 'Failed to import guests';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
