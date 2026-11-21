import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function checkAuth(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET all RSVPs
export async function GET(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        attending VARCHAR(20) NOT NULL,
        guests_count INTEGER DEFAULT 1,
        dietary VARCHAR(100),
        allergies TEXT,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const rsvps = await sql`
      SELECT * FROM rsvps ORDER BY id DESC
    `;

    return NextResponse.json({ success: true, rsvps });
  } catch (error: unknown) {
    console.error('Fetch RSVPs error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch RSVPs' },
      { status: 500 }
    );
  }
}

// DELETE an RSVP record
export async function DELETE(req: NextRequest) {
  const admin = checkAuth(req);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'RSVP ID is required' }, { status: 400 });
    }

    await sql`
      DELETE FROM rsvps WHERE id = ${parseInt(id, 10)}
    `;

    return NextResponse.json({ success: true, message: 'RSVP deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete RSVP error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to delete RSVP' },
      { status: 500 }
    );
  }
}
