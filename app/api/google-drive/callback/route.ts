import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeCodeForTokens,
  fetchGoogleUserInfo,
  ensureCustomerMediaFolder,
  saveCustomerDriveConnection,
} from '@/lib/customerDrive';

export const dynamic = 'force-dynamic';

/**
 * GET /api/google-drive/callback
 * Handles Google OAuth redirect, validates CSRF state, exchanges code for tokens,
 * creates the "Birthday Website Media" folder, sets public reader permissions,
 * and saves connection to Neon.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  const redirectBase = `${url.origin}/admin?tab=11`;

  if (error) {
    console.error('Google OAuth error callback:', error);
    return NextResponse.redirect(`${redirectBase}&gdrive_error=${encodeURIComponent(`Google authorization error: ${error}`)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${redirectBase}&gdrive_error=${encodeURIComponent('Missing authorization code or state')}`);
  }

  try {
    // 1. Decode state & verify CSRF token
    const decodedState = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    const { userId, csrf, redirectUri } = decodedState;

    const cookieCsrf = req.cookies.get('gdrive_oauth_csrf')?.value;
    if (!csrf || !cookieCsrf || csrf !== cookieCsrf) {
      return NextResponse.redirect(`${redirectBase}&gdrive_error=${encodeURIComponent('Invalid OAuth security state token (CSRF mismatch)')}`);
    }

    if (!userId) {
      return NextResponse.redirect(`${redirectBase}&gdrive_error=${encodeURIComponent('Invalid customer identity in OAuth state')}`);
    }

    // 2. Exchange authorization code for tokens matching the exact redirect URI used in auth
    const tokens = await exchangeCodeForTokens(code, redirectUri);

    // 3. Fetch customer Google profile / email
    const userInfo = await fetchGoogleUserInfo(tokens.accessToken);

    // 4. Automatically create "Birthday Website Media" folder & set public reader permissions
    const folderResult = await ensureCustomerMediaFolder(tokens.accessToken, 'Birthday Website Media');

    // 5. Store connection securely in database
    await saveCustomerDriveConnection({
      userId,
      googleEmail: userInfo.email,
      refreshToken: tokens.refreshToken,
      folderId: folderResult.folderId,
      folderName: 'Birthday Website Media',
      sharingStatus: folderResult.sharingStatus,
    });

    // 6. Redirect customer back to their dashboard with success indicator
    const response = NextResponse.redirect(
      `${redirectBase}&gdrive_success=${encodeURIComponent('Google Drive connected successfully! Birthday Website Media folder is ready.')}`
    );

    // Clear CSRF cookie
    response.cookies.set('gdrive_oauth_csrf', '', { maxAge: 0, path: '/' });
    return response;
  } catch (err: unknown) {
    console.error('OAuth callback execution error:', err);
    const message = err instanceof Error ? err.message : 'Failed to finalize Google Drive connection';
    return NextResponse.redirect(`${redirectBase}&gdrive_error=${encodeURIComponent(message)}`);
  }
}
