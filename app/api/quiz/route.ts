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
      SELECT id, question, options, correct_index, explanation, order_num
      FROM quiz_questions
      WHERE user_id = ${targetUserId}
      ORDER BY order_num ASC, id ASC
    `;

    const questions = rows.map((r: any) => ({
      id: r.id,
      question: r.question,
      options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options,
      correctIndex: r.correct_index,
      explanation: r.explanation || '',
    }));

    return NextResponse.json({ success: true, questions });
  } catch (error: unknown) {
    console.error('Fetch quiz questions error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }
}
