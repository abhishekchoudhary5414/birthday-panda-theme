import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET all submissions for admin
export async function GET(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rows = await sql`
      SELECT id, player_name, score, total_questions, answers, submitted_at
      FROM quiz_submissions
      WHERE user_id = ${admin.id}
      ORDER BY submitted_at DESC
    `;

    const submissions = rows.map((r: any) => ({
      id: r.id,
      player_name: r.player_name,
      score: r.score,
      total_questions: r.total_questions,
      answers: typeof r.answers === 'string' ? JSON.parse(r.answers) : (r.answers || []),
      submitted_at: r.submitted_at,
    }));

    return NextResponse.json({ success: true, submissions });
  } catch (error: unknown) {
    console.error('Admin fetch quiz submissions error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch quiz submissions' },
      { status: 500 }
    );
  }
}

// DELETE a submission
export async function DELETE(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    await sql`
      DELETE FROM quiz_submissions
      WHERE id = ${Number(id)} AND user_id = ${admin.id}
    `;

    return NextResponse.json({ success: true, message: 'Submission deleted' });
  } catch (error: unknown) {
    console.error('Admin delete quiz submission error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to delete submission' },
      { status: 500 }
    );
  }
}
