import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { buildGmailAuthUrl } from '@/lib/customerGmail';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * GET /api/gmail/connect
 * Initiates Google OAuth consent flow specifically for Gmail Sending.
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to your dashboard first.' }, { status: 401 });
    }

    const csrfToken = crypto.randomBytes(24).toString('hex');
    const authUrl = buildGmailAuthUrl(admin.id, csrfToken, req.nextUrl.origin);

    const response = NextResponse.redirect(authUrl);
    response.cookies.set('gmail_oauth_csrf', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });

    return response;
  } catch (error: unknown) {
    console.error('Gmail connect error:', error);
    const message = error instanceof Error ? error.message : 'Failed to initiate Gmail OAuth';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
