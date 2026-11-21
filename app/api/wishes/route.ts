import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, name, relation, phone, message, avatar, likes, created_at
      FROM birthday_wishes
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return NextResponse.json({ success: true, wishes: rows });
  } catch (error: unknown) {
    console.error('Fetch wishes error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch wishes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, relation, phone, message, avatar } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Birthday message is required' }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO birthday_wishes (name, relation, phone, message, avatar, likes)
      VALUES (
        ${name.trim()},
        ${relation ? relation.trim() : null},
        ${phone ? phone.trim() : null},
        ${message.trim()},
        ${avatar || '🐼'},
        1
      )
      RETURNING id, name, relation, phone, message, avatar, likes, created_at
    `;

    return NextResponse.json({ success: true, wish: inserted[0] });
  } catch (error: unknown) {
    console.error('Create wish error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to submit wish' },
      { status: 500 }
    );
  }
}
