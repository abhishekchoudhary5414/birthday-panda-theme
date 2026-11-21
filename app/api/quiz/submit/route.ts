import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET top submissions / recent leaderboard
export async function GET() {
  try {
    const rows = await sql`
      SELECT id, player_name, score, total_questions, submitted_at
      FROM quiz_submissions
      ORDER BY score DESC, submitted_at DESC
      LIMIT 20
    `;
    return NextResponse.json({ success: true, submissions: rows });
  } catch (error: unknown) {
    console.error('Fetch quiz submissions error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// POST: Save guest quiz score to database
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerName, score, totalQuestions, answers = [] } = body;

    if (!playerName?.trim()) {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO quiz_submissions (player_name, score, total_questions, answers)
      VALUES (
        ${playerName.trim()},
        ${Number(score) || 0},
        ${Number(totalQuestions) || 5},
        ${JSON.stringify(answers)}::jsonb
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, submission: inserted[0] });
  } catch (error: unknown) {
    console.error('Submit quiz score error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to save quiz score' },
      { status: 500 }
    );
  }
}
