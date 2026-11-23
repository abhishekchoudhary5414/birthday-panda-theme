import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST: Guest registers/claims a gift
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, orderedBy, orderedEmail, orderedPhone = '', orderNote = '', action = 'order' } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing gift ID' }, { status: 400 });
    }

    if (action === 'cancel') {
      // Revert to available
      await sql`
        UPDATE gift_registry
        SET 
          is_ordered = false,
          ordered_by = null,
          ordered_email = null,
          ordered_phone = null,
          order_note = null,
          ordered_at = null
        WHERE id = ${parseInt(id, 10)}
      `;

      return NextResponse.json({
        success: true,
        message: 'Gift registration has been released and is now Available.',
      });
    }

    // Validation
    const cleanName = orderedBy ? orderedBy.trim() : '';
    const cleanEmail = orderedEmail ? orderedEmail.trim().toLowerCase() : '';
    const cleanPhone = orderedPhone ? orderedPhone.trim() : '';
    const cleanNote = orderNote ? orderNote.trim() : '';

    if (!cleanName) {
      return NextResponse.json(
        { error: 'Please enter your name so the family knows who blessed the child with this gift.' },
        { status: 400 }
      );
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address to register this gift.' },
        { status: 400 }
      );
    }

    // Check if duplicate email: Has this email already registered another gift?
    const duplicateEmailCheck = await sql`
      SELECT id, title, ordered_by 
      FROM gift_registry 
      WHERE LOWER(ordered_email) = ${cleanEmail} 
        AND is_ordered = true 
        AND id != ${parseInt(id, 10)}
      LIMIT 1
    `;

    if (duplicateEmailCheck.length > 0) {
      return NextResponse.json(
        {
          error: `A gift has already been registered with email "${cleanEmail}" ("${duplicateEmailCheck[0].title}"). To ensure all guests can participate, each email can only register one gift.`,
          isDuplicateEmail: true,
        },
        { status: 400 }
      );
    }

    // Check if already ordered/unavailable
    const existing = await sql`
      SELECT is_ordered, ordered_by, ordered_email, title 
      FROM gift_registry 
      WHERE id = ${parseInt(id, 10)}
    `;

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Gift not found in registry.' }, { status: 404 });
    }

    if (existing[0].is_ordered) {
      return NextResponse.json(
        {
          error: `This product is already registered and unavailable (claimed by ${
            existing[0].ordered_by || 'another guest'
          }).`,
          isUnavailable: true,
        },
        { status: 409 }
      );
    }

    // Optional Guest match verification from guest list
    let isMatchedGuest = false;
    let matchedGuestName = '';
    try {
      const guestRows = await sql`
        SELECT name, email FROM guests WHERE LOWER(email) = ${cleanEmail} LIMIT 1
      `;
      if (guestRows.length > 0) {
        isMatchedGuest = true;
        matchedGuestName = guestRows[0].name;
      }
    } catch (guestErr) {
      console.warn('Guest match check warning (non-fatal):', guestErr);
    }

    // Mark as Ordered / Unavailable
    await sql`
      UPDATE gift_registry
      SET 
        is_ordered = true,
        ordered_by = ${cleanName},
        ordered_email = ${cleanEmail},
        ordered_phone = ${cleanPhone},
        order_note = ${cleanNote || null},
        ordered_at = CURRENT_TIMESTAMP
      WHERE id = ${parseInt(id, 10)}
    `;

    return NextResponse.json({
      success: true,
      message: `Thank you, ${cleanName}! You have successfully registered this gift. It is now marked as unavailable so no duplicate gifts will be ordered.`,
      matchedGuest: isMatchedGuest,
      matchedGuestName: matchedGuestName || cleanName,
      giftTitle: existing[0].title,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to register gift';
    console.error('Gift registration error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
