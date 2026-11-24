import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

export interface GiftRegistryItem {
  id: number;
  user_id?: number;
  asin?: string;
  title: string;
  category: string;
  price: string;
  list_price?: string;
  rating?: number;
  review_count?: string;
  image_url: string;
  purchase_url: string;
  description?: string;
  priority?: string;
  is_ordered: boolean;
  ordered_by?: string;
  ordered_email?: string;
  ordered_phone?: string;
  order_note?: string;
  ordered_at?: string;
  created_at: string;
}

// GET: Fetch all gifts from database
export async function GET(req: NextRequest) {
  try {
    const admin = checkAuth(req);
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get('userId');
    const targetUserId = admin?.id || (queryUserId ? Number(queryUserId) : null);

    const gifts = targetUserId
      ? await sql`
          SELECT 
            id, user_id, asin, title, category, price, list_price, 
            rating::float as rating, review_count, image_url, 
            purchase_url, description, priority, is_ordered, 
            ordered_by, ordered_email, ordered_phone, order_note, 
            ordered_at, created_at
          FROM gift_registry
          WHERE user_id = ${targetUserId}
          ORDER BY 
            CASE WHEN priority = 'high' THEN 1 WHEN priority = 'medium' THEN 2 ELSE 3 END,
            created_at DESC
        `
      : await sql`
          SELECT 
            id, user_id, asin, title, category, price, list_price, 
            rating::float as rating, review_count, image_url, 
            purchase_url, description, priority, is_ordered, 
            ordered_by, ordered_email, ordered_phone, order_note, 
            ordered_at, created_at
          FROM gift_registry
          ORDER BY 
            CASE WHEN priority = 'high' THEN 1 WHEN priority = 'medium' THEN 2 ELSE 3 END,
            created_at DESC
        `;

    return NextResponse.json({
      success: true,
      gifts: gifts as unknown as GiftRegistryItem[],
      count: gifts.length,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch gift registry';
    console.error('Fetch gift registry error:', error);
    return NextResponse.json({ success: false, error: message, gifts: [] }, { status: 500 });
  }
}

// POST: Add new gift to database (Admin)
export async function POST(req: NextRequest) {
  try {
    const admin = checkAuth(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      asin = '',
      title,
      category = 'toys',
      price = '$0.00',
      listPrice = '',
      rating = 4.5,
      reviewCount = '',
      imageUrl,
      purchaseUrl,
      description = '',
      priority = 'medium',
    } = body;

    if (!title || !imageUrl || !purchaseUrl) {
      return NextResponse.json(
        { error: 'Please provide at least a title, image URL, and purchase link.' },
        { status: 400 }
      );
    }

    const inserted = await sql`
      INSERT INTO gift_registry (
        user_id, asin, title, category, price, list_price, rating, review_count, 
        image_url, purchase_url, description, priority, is_ordered
      ) VALUES (
        ${admin.id},
        ${asin},
        ${title},
        ${category},
        ${price},
        ${listPrice},
        ${rating},
        ${reviewCount},
        ${imageUrl},
        ${purchaseUrl},
        ${description},
        ${priority},
        false
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      message: 'Gift successfully added to registry!',
      gift: inserted[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to add gift';
    console.error('Add gift error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Delete a gift from registry
export async function DELETE(req: NextRequest) {
  try {
    const admin = checkAuth(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing gift id' }, { status: 400 });
    }

    await sql`DELETE FROM gift_registry WHERE id = ${parseInt(id, 10)} AND user_id = ${admin.id}`;

    return NextResponse.json({
      success: true,
      message: 'Gift successfully removed from registry.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete gift';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT: Update gift details or toggle status
export async function PUT(req: NextRequest) {
  try {
    const admin = checkAuth(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, is_ordered, ordered_by } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing gift id' }, { status: 400 });
    }

    if (!is_ordered) {
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
        WHERE id = ${parseInt(id, 10)} AND user_id = ${admin.id}
      `;
    } else {
      await sql`
        UPDATE gift_registry 
        SET 
          is_ordered = true,
          ordered_by = ${ordered_by || 'Admin Marked'},
          ordered_at = CURRENT_TIMESTAMP
        WHERE id = ${parseInt(id, 10)} AND user_id = ${admin.id}
      `;
    }

    return NextResponse.json({
      success: true,
      message: 'Gift status updated successfully.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update gift';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
