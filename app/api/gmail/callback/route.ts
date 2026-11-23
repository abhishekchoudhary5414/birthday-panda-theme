import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeGmailCodeForTokens,
  fetchGmailUserInfo,
  saveCustomerGmailConnection,
} from '@/lib/customerGmail';

export const dynamic = 'force-dynamic';

/**
 * GET /api/gmail/callback
 * Handles Gmail OAuth redirect, verifies CSRF token, exchanges code for refresh token,
 * retrieves sender email, and saves credentials in Neon database.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  const redirectBase = `${url.origin}/admin?tab=8`;

  if (error) {
    console.error('Gmail OAuth error callback:', error);
    return NextResponse.redirect(`${redirectBase}&gmail_error=${encodeURIComponent(`Google authorization error: ${error}`)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${redirectBase}&gmail_error=${encodeURIComponent('Missing authorization code or state')}`);
  }

  try {
    const decodedState = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    const { userId, csrf, redirectUri } = decodedState;

    const cookieCsrf = req.cookies.get('gmail_oauth_csrf')?.value;
    if (!csrf || !cookieCsrf || csrf !== cookieCsrf) {
      return NextResponse.redirect(`${redirectBase}&gmail_error=${encodeURIComponent('Invalid OAuth security state token (CSRF mismatch)')}`);
    }

    if (!userId) {
      return NextResponse.redirect(`${redirectBase}&gmail_error=${encodeURIComponent('Invalid customer identity in OAuth state')}`);
    }

    // Exchange authorization code for tokens
    const tokens = await exchangeGmailCodeForTokens(code, redirectUri);

    // Fetch user profile / Gmail address
    const userInfo = await fetchGmailUserInfo(tokens.accessToken);

    // Save connection to database
    await saveCustomerGmailConnection({
      userId,
      googleEmail: userInfo.email,
      refreshToken: tokens.refreshToken,
    });

    const response = NextResponse.redirect(
      `${redirectBase}&gmail_success=${encodeURIComponent(`Gmail account (${userInfo.email}) connected successfully! You can now send birthday invitations.`)}`
    );

    response.cookies.set('gmail_oauth_csrf', '', { maxAge: 0, path: '/' });
    return response;
  } catch (err: unknown) {
    console.error('Gmail callback execution error:', err);
    const message = err instanceof Error ? err.message : 'Failed to finalize Gmail connection';
    return NextResponse.redirect(`${redirectBase}&gmail_error=${encodeURIComponent(message)}`);
  }
}
