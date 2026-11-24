import { NextRequest, NextResponse } from 'next/server';
import { sql, getDefaultOwnerUserId } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get('userId');

    let targetUserId = admin?.id || (queryUserId ? Number(queryUserId) : null);
    if (!targetUserId) {
      targetUserId = await getDefaultOwnerUserId();
    }

    const rows = await sql`
      SELECT id, name, relation, phone, message, avatar, likes, created_at
      FROM birthday_wishes
      WHERE user_id = ${targetUserId}
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
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    const body = await req.json();
    const { name, relation, phone, message, avatar, userId } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Birthday message is required' }, { status: 400 });
    }

    let targetUserId = admin?.id || (userId ? Number(userId) : null);
    if (!targetUserId) {
      targetUserId = await getDefaultOwnerUserId();
    }

    const inserted = await sql`
      INSERT INTO birthday_wishes (name, relation, phone, message, avatar, likes, user_id)
      VALUES (
        ${name.trim()},
        ${relation ? relation.trim() : null},
        ${phone ? phone.trim() : null},
        ${message.trim()},
        ${avatar || '🐼'},
        1,
        ${targetUserId}
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
