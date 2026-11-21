import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { id, action } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Wish ID is required' }, { status: 400 });
    }

    const numId = Number(id);

    let updated;
    if (action === 'unlike') {
      updated = await sql`
        UPDATE birthday_wishes
        SET likes = GREATEST(likes - 1, 0)
        WHERE id = ${numId}
        RETURNING id, likes
      `;
    } else {
      updated = await sql`
        UPDATE birthday_wishes
        SET likes = likes + 1
        WHERE id = ${numId}
        RETURNING id, likes
      `;
    }

    if (!updated.length) {
      return NextResponse.json({ error: 'Wish not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, likes: updated[0].likes });
  } catch (error: unknown) {
    console.error('Like/Unlike wish error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to update wish like' },
      { status: 500 }
    );
  }
}
