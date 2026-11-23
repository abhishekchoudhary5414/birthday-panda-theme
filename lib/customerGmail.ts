import { sql } from '@/lib/db';
import { encryptToken, decryptToken } from '@/lib/encryption';

/**
 * Customer-Specific Gmail OAuth 2.0 & Sending Service
 * Completely independent of Google Drive OAuth integration.
 */

export const GMAIL_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

export interface CustomerGmailConnection {
  id: number;
  userId: number;
  googleEmail: string | null;
  encryptedRefreshToken: string | null;
  connected: boolean;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

// In-memory token cache keyed by userId
interface GmailTokenCache {
  accessToken: string;
  expiresAt: number;
}
const gmailTokenCache = new Map<number, GmailTokenCache>();

/**
 * Build Google OAuth 2.0 URL for Gmail Sending
 */
export function buildGmailAuthUrl(userId: number, stateToken: string, dynamicOrigin?: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_GMAIL_REDIRECT_URI || (dynamicOrigin ? `${dynamicOrigin}/api/gmail/callback` : 'http://localhost:3000/api/gmail/callback');

  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured in environment variables');
  }

  const statePayload = Buffer.from(JSON.stringify({ userId, csrf: stateToken, redirectUri })).toString('base64url');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GMAIL_OAUTH_SCOPES.join(' '),
    access_type: 'offline', // Obtain refresh token
    prompt: 'consent', // Force consent so a refresh token is returned
    include_granted_scopes: 'true',
    state: statePayload,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange Authorization Code for Gmail Tokens
 */
export async function exchangeGmailCodeForTokens(code: string, customRedirectUri?: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = customRedirectUri || process.env.GOOGLE_GMAIL_REDIRECT_URI || 'http://localhost:3000/api/gmail/callback';

  if (!clientId || !clientSecret) {
    throw new Error('Google credentials missing: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    const errorMsg = data.error_description || data.error || 'Failed to exchange authorization code for Gmail';
    throw new Error(`Gmail OAuth error: ${errorMsg}`);
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in || 3600,
  };
}

/**
 * Fetch Google User Info using Access Token
 */
export async function fetchGmailUserInfo(accessToken: string): Promise<{ email: string; name?: string }> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve user profile from Google');
  }

  const data = await response.json();
  return {
    email: data.email,
    name: data.name,
  };
}

/**
 * Get or refresh Gmail Access Token for customer userId
 */
export async function getCustomerGmailAccessToken(userId: number): Promise<string> {
  const cached = gmailTokenCache.get(userId);
  if (cached && cached.expiresAt > Date.now() + 60000) {
    return cached.accessToken;
  }

  const rows = await sql`
    SELECT encrypted_refresh_token, connected 
    FROM gmail_connections 
    WHERE user_id = ${userId}
  `;

  if (rows.length === 0 || !rows[0].encrypted_refresh_token || !rows[0].connected) {
    throw new Error('Gmail account is not connected. Please connect your Gmail account.');
  }

  const refreshToken = decryptToken(rows[0].encrypted_refresh_token);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Google credentials missing: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    await sql`
      UPDATE gmail_connections 
      SET connected = FALSE, error_message = ${data.error_description || 'Refresh token expired or revoked'}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `;
    throw new Error(`Gmail token refresh failed: ${data.error_description || data.error}`);
  }

  const expiresInMs = (data.expires_in || 3600) * 1000;
  gmailTokenCache.set(userId, {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresInMs,
  });

  return data.access_token;
}

/**
 * Retrieve active Gmail connection record
 */
export async function getCustomerGmailConnection(userId: number): Promise<CustomerGmailConnection | null> {
  const rows = await sql`
    SELECT id, user_id, google_email, encrypted_refresh_token, connected, error_message, created_at, updated_at
    FROM gmail_connections
    WHERE user_id = ${userId}
  `;

  if (rows.length === 0) return null;

  const r = rows[0];
  return {
    id: r.id,
    userId: r.user_id,
    googleEmail: r.google_email,
    encryptedRefreshToken: r.encrypted_refresh_token,
    connected: Boolean(r.connected),
    errorMessage: r.error_message,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/**
 * Save or update Gmail connection
 */
export async function saveCustomerGmailConnection(params: {
  userId: number;
  googleEmail: string;
  refreshToken?: string;
}): Promise<void> {
  const { userId, googleEmail, refreshToken } = params;

  if (refreshToken) {
    const encrypted = encryptToken(refreshToken);
    await sql`
      INSERT INTO gmail_connections 
        (user_id, google_email, encrypted_refresh_token, connected, error_message, updated_at)
      VALUES 
        (${userId}, ${googleEmail}, ${encrypted}, TRUE, NULL, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
        google_email = EXCLUDED.google_email,
        encrypted_refresh_token = EXCLUDED.encrypted_refresh_token,
        connected = TRUE,
        error_message = NULL,
        updated_at = CURRENT_TIMESTAMP
    `;
  } else {
    // Preserve existing refresh token if not returned
    await sql`
      UPDATE gmail_connections SET
        google_email = ${googleEmail},
        connected = TRUE,
        error_message = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `;
  }
}

/**
 * Disconnect customer Gmail account
 */
export async function disconnectCustomerGmail(userId: number): Promise<boolean> {
  const rows = await sql`
    SELECT encrypted_refresh_token FROM gmail_connections WHERE user_id = ${userId}
  `;

  if (rows.length > 0 && rows[0].encrypted_refresh_token) {
    try {
      const refreshToken = decryptToken(rows[0].encrypted_refresh_token);
      await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(refreshToken)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    } catch (e) {
      console.warn('Gmail token revocation warning:', e);
    }
  }

  gmailTokenCache.delete(userId);

  await sql`
    UPDATE gmail_connections SET
      connected = FALSE,
      encrypted_refresh_token = NULL,
      error_message = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
  `;

  return true;
}

/**
 * Build RFC 2822 MIME message with HTML and plain-text fallback, supporting UTF-8 & emojis
 */
/**
 * Create an RFC 2822 compliant MIME message string for Gmail API
 * Includes proper Message-ID, Date, RFC 2047 Q-encoding, and clean multipart boundaries.
 */
export function createMimeMessage(params: {
  fromName: string;
  fromEmail: string;
  toName?: string;
  toEmail: string;
  subject: string;
  htmlBody: string;
  textBody: string;
  replyTo?: string;
}): string {
  const { fromName, fromEmail, toName, toEmail, subject, htmlBody, textBody, replyTo } = params;
  const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  // Safe header encoder: only use RFC 2047 encoding if non-ASCII characters are present
  const encodeHeader = (str: string): string => {
    if (!str) return '';
    // If string has only standard printable ASCII, keep it clean and unencoded
    if (/^[\x20-\x7E]+$/.test(str) && !/[<>";]/.test(str)) {
      return str;
    }
    return `=?UTF-8?B?${Buffer.from(str, 'utf8').toString('base64')}?=`;
  };

  const safeFromName = fromName ? encodeHeader(fromName) : '';
  const fromHeader = safeFromName ? `${safeFromName} <${fromEmail}>` : fromEmail;

  let toHeader = toEmail;
  if (toName) {
    const safeToName = encodeHeader(toName);
    toHeader = safeToName ? `${safeToName} <${toEmail}>` : toEmail;
  }

  const subjectHeader = encodeHeader(subject);

  // Generate unique RFC 2822 Message-ID
  const domain = fromEmail.split('@')[1] || 'gmail.com';
  const randomPart = Math.random().toString(36).substring(2, 10);
  const messageId = `<invitation.${Date.now()}.${randomPart}@${domain}>`;
  const dateHeader = new Date().toUTCString();

  const lines = [
    `From: ${fromHeader}`,
    `To: ${toHeader}`,
    `Subject: ${subjectHeader}`,
    `Date: ${dateHeader}`,
    `Message-ID: ${messageId}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
  ];

  if (replyTo) {
    lines.push(`Reply-To: ${replyTo}`);
  }

  lines.push(
    '',
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 8bit`,
    '',
    textBody,
    '',
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: 8bit`,
    '',
    htmlBody,
    '',
    `--${boundary}--`,
    ''
  );

  const rawMime = lines.join('\r\n');
  return Buffer.from(rawMime, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Send an email through the Gmail API messages.send endpoint
 */
export async function sendGmailMessage(params: {
  userId: number;
  toEmail: string;
  toName?: string;
  fromName?: string;
  subject: string;
  htmlBody: string;
  textBody: string;
}): Promise<{ messageId: string }> {
  const { userId, toEmail, toName, fromName, subject, htmlBody, textBody } = params;

  const conn = await getCustomerGmailConnection(userId);
  if (!conn || !conn.connected || !conn.googleEmail) {
    throw new Error('Gmail account not connected. Please connect your Gmail account.');
  }

  const accessToken = await getCustomerGmailAccessToken(userId);

  // Use genuine host name or email prefix instead of generic "Host"
  const senderDisplayName = (fromName && fromName.trim()) 
    ? fromName.trim() 
    : conn.googleEmail.split('@')[0];

  const rawMessage = createMimeMessage({
    fromName: senderDisplayName,
    fromEmail: conn.googleEmail,
    toName,
    toEmail,
    subject,
    htmlBody,
    textBody,
    replyTo: conn.googleEmail,
  });

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawMessage }),
  });

  const data = await response.json();
  if (!response.ok || !data.id) {
    const errorMsg = data.error?.message || response.statusText;
    throw new Error(`Gmail API error: ${errorMsg}`);
  }

  return { messageId: data.id };
}
