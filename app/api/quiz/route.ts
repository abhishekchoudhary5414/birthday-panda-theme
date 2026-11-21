import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, question, options, correct_index, explanation, order_num
      FROM quiz_questions
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
