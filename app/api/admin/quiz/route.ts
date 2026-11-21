import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET all quiz questions for admin
export async function GET(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await sql`
      SELECT id, question, options, correct_index, explanation, order_num, created_at
      FROM quiz_questions
      ORDER BY order_num ASC, id ASC
    `;

    const questions = rows.map((r: any) => ({
      id: r.id,
      question: r.question,
      options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options,
      correctIndex: r.correct_index,
      explanation: r.explanation || '',
      orderNum: r.order_num || 0,
    }));

    return NextResponse.json({ success: true, questions });
  } catch (error: unknown) {
    console.error('Admin fetch quiz error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }
}

// POST: Add new quiz question
export async function POST(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { question, options, correctIndex = 0, explanation = '' } = body;

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Question text is required' }, { status: 400 });
    }

    if (!Array.isArray(options) || options.filter(o => typeof o === 'string' && o.trim()).length < 2) {
      return NextResponse.json({ error: 'At least 2 options are required' }, { status: 400 });
    }

    const cleanOptions = options.map(o => String(o || '').trim()).filter(Boolean);
    const validCorrectIdx = Math.max(0, Math.min(Number(correctIndex) || 0, cleanOptions.length - 1));

    // Get max order
    const maxOrderRes = await sql`SELECT COALESCE(MAX(order_num), 0) as max_order FROM quiz_questions`;
    const nextOrder = (maxOrderRes[0]?.max_order || 0) + 1;

    const inserted = await sql`
      INSERT INTO quiz_questions (question, options, correct_index, explanation, order_num)
      VALUES (
        ${question.trim()},
        ${JSON.stringify(cleanOptions)}::jsonb,
        ${validCorrectIdx},
        ${explanation?.trim() || ''},
        ${nextOrder}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, question: inserted[0] });
  } catch (error: unknown) {
    console.error('Admin add quiz error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to add quiz question' },
      { status: 500 }
    );
  }
}

// PUT: Edit existing quiz question
export async function PUT(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, question, options, correctIndex = 0, explanation = '' } = body;

    if (!id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Question text is required' }, { status: 400 });
    }

    if (!Array.isArray(options) || options.filter(o => typeof o === 'string' && o.trim()).length < 2) {
      return NextResponse.json({ error: 'At least 2 options are required' }, { status: 400 });
    }

    const cleanOptions = options.map(o => String(o || '').trim()).filter(Boolean);
    const validCorrectIdx = Math.max(0, Math.min(Number(correctIndex) || 0, cleanOptions.length - 1));

    const updated = await sql`
      UPDATE quiz_questions
      SET
        question = ${question.trim()},
        options = ${JSON.stringify(cleanOptions)}::jsonb,
        correct_index = ${validCorrectIdx},
        explanation = ${explanation?.trim() || ''}
      WHERE id = ${id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, question: updated[0] });
  } catch (error: unknown) {
    console.error('Admin edit quiz error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to edit quiz question' },
      { status: 500 }
    );
  }
}

// DELETE: Remove quiz question
export async function DELETE(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    await sql`
      DELETE FROM quiz_questions
      WHERE id = ${Number(id)}
    `;

    return NextResponse.json({ success: true, message: 'Question deleted' });
  } catch (error: unknown) {
    console.error('Admin delete quiz error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to delete quiz question' },
      { status: 500 }
    );
  }
}
