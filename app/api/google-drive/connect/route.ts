import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { buildGoogleAuthUrl } from '@/lib/customerDrive';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * GET /api/google-drive/connect
 * Initiates Google OAuth consent flow for the authenticated customer.
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin_token')?.value;
    const admin = token ? verifyToken(token) : null;

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to your dashboard first.' }, { status: 401 });
    }

    // Generate CSRF token and store in secure cookie
    const csrfToken = crypto.randomBytes(24).toString('hex');
    const authUrl = buildGoogleAuthUrl(admin.id, csrfToken, req.nextUrl.origin);

    const response = NextResponse.redirect(authUrl);
    response.cookies.set('gdrive_oauth_csrf', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });

    return response;
  } catch (error: unknown) {
    console.error('Google Drive connect error:', error);
    const message = error instanceof Error ? error.message : 'Failed to initiate Google OAuth';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
