import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

export const dynamic = 'force-dynamic';

// GET all wishes for admin with optional search
export async function GET(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';

    let rows;
    if (search) {
      const pattern = `%${search}%`;
      rows = await sql`
        SELECT id, name, relation, phone, message, avatar, likes, created_at
        FROM birthday_wishes
        WHERE user_id = ${admin.id}
          AND (name ILIKE ${pattern}
           OR relation ILIKE ${pattern}
           OR phone ILIKE ${pattern}
           OR message ILIKE ${pattern})
        ORDER BY created_at DESC
      `;
    } else {
      rows = await sql`
        SELECT id, name, relation, phone, message, avatar, likes, created_at
        FROM birthday_wishes
        WHERE user_id = ${admin.id}
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json({ success: true, wishes: rows });
  } catch (error: unknown) {
    console.error('Admin fetch wishes error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch wishes' },
      { status: 500 }
    );
  }
}

// DELETE a wish from database
export async function DELETE(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Wish ID is required' }, { status: 400 });
    }

    await sql`
      DELETE FROM birthday_wishes
      WHERE id = ${Number(id)} AND user_id = ${admin.id}
    `;

    return NextResponse.json({ success: true, message: 'Wish removed successfully' });
  } catch (error: unknown) {
    console.error('Admin delete wish error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to delete wish' },
      { status: 500 }
    );
  }
}
