import { sql } from '@/lib/db';
import { encryptToken, decryptToken } from '@/lib/encryption';

/**
 * Customer-Specific Google Drive Service
 * Handles OAuth 2.0, token refresh, folder creation, public permissions, uploads, and media streaming.
 */

// Use minimum necessary scope: drive.file allows full access to files/folders created by this app
export const GOOGLE_DRIVE_OAUTH_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

export interface DrivePhoto {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  createdTime: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  proxyUrl: string;
  directUrl: string;
  caption?: string;
  uploaderName?: string;
  width?: number;
  height?: number;
}

export interface CustomerDriveConnection {
  id: number;
  userId: number;
  googleEmail: string | null;
  encryptedRefreshToken: string | null;
  rootFolderId: string | null;
  rootFolderName: string | null;
  connected: boolean;
  sharingStatus: string;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

// In-memory access token cache keyed by userId
interface TokenCache {
  accessToken: string;
  expiresAt: number;
}
const tokenCache = new Map<number, TokenCache>();

/**
 * Build Google OAuth 2.0 Authorization URL for a specific customer
 */
export function buildGoogleAuthUrl(userId: number, stateToken: string, dynamicOrigin?: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = (dynamicOrigin && !process.env.GOOGLE_REDIRECT_URI?.includes('://'))
    ? `${dynamicOrigin}/api/google-drive/callback`
    : (process.env.GOOGLE_REDIRECT_URI || (dynamicOrigin ? `${dynamicOrigin}/api/google-drive/callback` : 'http://localhost:3000/api/google-drive/callback'));

  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured in environment variables');
  }

  const statePayload = Buffer.from(JSON.stringify({ userId, csrf: stateToken, redirectUri })).toString('base64url');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_DRIVE_OAUTH_SCOPES.join(' '),
    access_type: 'offline', // Crucial for obtaining a refresh token
    prompt: 'consent', // Force consent so a refresh token is returned on re-authorization
    include_granted_scopes: 'true',
    state: statePayload,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange Authorization Code for Tokens
 */
export async function exchangeCodeForTokens(code: string, customRedirectUri?: string): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  idToken?: string;
}> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = customRedirectUri || process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/google-drive/callback';

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials missing: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
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
    const errorMsg = data.error_description || data.error || 'Failed to exchange authorization code';
    throw new Error(`Google OAuth code exchange error: ${errorMsg}`);
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in || 3600,
    idToken: data.id_token,
  };
}

/**
 * Fetch Google User Info using Access Token
 */
export async function fetchGoogleUserInfo(accessToken: string): Promise<{ email: string; name?: string }> {
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
 * Get or refresh Google Access Token for a specific customer userId
 */
export async function getCustomerAccessToken(userId: number): Promise<string> {
  // Check memory cache
  const cached = tokenCache.get(userId);
  if (cached && cached.expiresAt > Date.now() + 60000) {
    return cached.accessToken;
  }

  // Load encrypted refresh token from database
  const rows = await sql`
    SELECT encrypted_refresh_token, connected 
    FROM google_drive_connections 
    WHERE user_id = ${userId}
  `;

  if (rows.length === 0 || !rows[0].encrypted_refresh_token || !rows[0].connected) {
    // Fallback: check if legacy environment refresh token exists for backward compatibility
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      return getLegacyAccessToken();
    }
    throw new Error('Google Drive account is not connected for this user. Please connect your Google Drive.');
  }

  const refreshToken = decryptToken(rows[0].encrypted_refresh_token);
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials missing: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
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
    // Mark connection as error if refresh token was revoked
    await sql`
      UPDATE google_drive_connections 
      SET connected = FALSE, error_message = ${data.error_description || 'Refresh token expired or revoked'}, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `;
    throw new Error(`Google Drive token refresh failed: ${data.error_description || data.error}`);
  }

  const expiresInMs = (data.expires_in || 3600) * 1000;
  tokenCache.set(userId, {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresInMs,
  });

  return data.access_token;
}

/**
 * Fallback legacy access token retriever for single-tenant / env configurations
 */
async function getLegacyAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google Drive credentials in environment.');
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
    throw new Error(`Google Drive Auth Error: ${data.error_description || data.error}`);
  }
  return data.access_token;
}

/**
 * Automatically find or create the "Birthday Website Media" folder and configure public viewer permissions
 */
export async function ensureCustomerMediaFolder(
  accessToken: string,
  folderName: string = 'Birthday Website Media'
): Promise<{ folderId: string; sharingStatus: string; isNew: boolean }> {
  // 1. Search for existing folder with exact name created by this app that is not trashed
  const query = `name = '${folderName.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,permissions)&spaces=drive`;

  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let folderId = '';
  let isNew = false;

  if (searchRes.ok) {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      folderId = searchData.files[0].id;
    }
  }

  // 2. If folder doesn't exist, create it
  if (!folderId) {
    const createUrl = 'https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink';
    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        description: 'Auto-created media folder for birthday website photos and videos.',
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(`Failed to create Google Drive folder: ${err.error?.message || createRes.statusText}`);
    }

    const createdData = await createRes.json();
    folderId = createdData.id;
    isNew = true;
  }

  // 3. Configure public viewer permissions { type: 'anyone', role: 'reader' }
  let sharingStatus = 'restricted';
  try {
    const permUrl = `https://www.googleapis.com/drive/v3/files/${folderId}/permissions?fields=id,type,role`;
    const permRes = await fetch(permUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'anyone',
        role: 'reader',
      }),
    });

    if (permRes.ok) {
      sharingStatus = 'public_reader';
    } else {
      const permErr = await permRes.json();
      console.warn('Google Drive public permission warning:', permErr);
      sharingStatus = 'restricted_policy';
    }
  } catch (permErr: any) {
    console.warn('Google Drive permission error:', permErr.message);
    sharingStatus = 'restricted_policy';
  }

  return { folderId, sharingStatus, isNew };
}

/**
 * Get active connection details for a user
 */
export async function getCustomerDriveConnection(userId: number): Promise<CustomerDriveConnection | null> {
  const rows = await sql`
    SELECT id, user_id, google_email, encrypted_refresh_token, root_folder_id, root_folder_name,
           connected, sharing_status, error_message, created_at, updated_at
    FROM google_drive_connections
    WHERE user_id = ${userId}
  `;

  if (rows.length === 0) return null;

  const r = rows[0];
  return {
    id: r.id,
    userId: r.user_id,
    googleEmail: r.google_email,
    encryptedRefreshToken: r.encrypted_refresh_token,
    rootFolderId: r.root_folder_id,
    rootFolderName: r.root_folder_name,
    connected: Boolean(r.connected),
    sharingStatus: r.sharing_status || 'unverified',
    errorMessage: r.error_message,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/**
 * Save or update OAuth connection for customer
 */
export async function saveCustomerDriveConnection(params: {
  userId: number;
  googleEmail: string;
  refreshToken?: string;
  folderId: string;
  folderName: string;
  sharingStatus: string;
}): Promise<void> {
  const { userId, googleEmail, refreshToken, folderId, folderName, sharingStatus } = params;

  if (refreshToken) {
    const encrypted = encryptToken(refreshToken);
    await sql`
      INSERT INTO google_drive_connections 
        (user_id, google_email, encrypted_refresh_token, root_folder_id, root_folder_name, connected, sharing_status, error_message, updated_at)
      VALUES 
        (${userId}, ${googleEmail}, ${encrypted}, ${folderId}, ${folderName}, TRUE, ${sharingStatus}, NULL, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id) DO UPDATE SET
        google_email = EXCLUDED.google_email,
        encrypted_refresh_token = EXCLUDED.encrypted_refresh_token,
        root_folder_id = EXCLUDED.root_folder_id,
        root_folder_name = EXCLUDED.root_folder_name,
        connected = TRUE,
        sharing_status = EXCLUDED.sharing_status,
        error_message = NULL,
        updated_at = CURRENT_TIMESTAMP
    `;
  } else {
    // If no refresh token provided (e.g. repeated auth), preserve existing encrypted refresh token
    await sql`
      UPDATE google_drive_connections SET
        google_email = ${googleEmail},
        root_folder_id = ${folderId},
        root_folder_name = ${folderName},
        connected = TRUE,
        sharing_status = ${sharingStatus},
        error_message = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `;
  }
}

/**
 * Disconnect customer's Google Drive account
 */
export async function disconnectCustomerDrive(userId: number): Promise<boolean> {
  const rows = await sql`
    SELECT encrypted_refresh_token FROM google_drive_connections WHERE user_id = ${userId}
  `;

  if (rows.length > 0 && rows[0].encrypted_refresh_token) {
    try {
      const refreshToken = decryptToken(rows[0].encrypted_refresh_token);
      // Attempt to revoke Google OAuth token
      await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(refreshToken)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    } catch (e) {
      console.warn('Token revocation warning:', e);
    }
  }

  tokenCache.delete(userId);

  await sql`
    UPDATE google_drive_connections SET
      connected = FALSE,
      encrypted_refresh_token = NULL,
      sharing_status = 'disconnected',
      error_message = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ${userId}
  `;

  return true;
}

/**
 * List photos from customer's connected Google Drive folder
 */
export async function listCustomerDrivePhotos(userId: number, pageSize: number = 100): Promise<DrivePhoto[]> {
  const conn = await getCustomerDriveConnection(userId);
  let folderId = conn?.rootFolderId;
  let accessToken: string;

  if (conn?.connected && folderId) {
    accessToken = await getCustomerAccessToken(userId);
  } else if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
    // Fallback to legacy single-tenant env
    folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    accessToken = await getLegacyAccessToken();
  } else {
    return [];
  }

  const query = `'${folderId}' in parents and trashed = false and (mimeType contains 'image/' or mimeType contains 'video/')`;
  const fields = 'files(id, name, mimeType, size, createdTime, webViewLink, webContentLink, thumbnailLink, imageMediaMetadata, videoMediaMetadata)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&pageSize=${pageSize}&orderBy=createdTime desc&fields=${encodeURIComponent(fields)}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Drive list error: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const files: any[] = data.files || [];

  return files.map((file) => {
    let thumbnail = file.thumbnailLink;
    if (thumbnail) {
      thumbnail = thumbnail.replace(/=s\d+/, '=s800');
    } else {
      thumbnail = `https://lh3.googleusercontent.com/d/${file.id}=w800`;
    }

    return {
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      size: file.size ? parseInt(file.size, 10) : undefined,
      createdTime: file.createdTime,
      webViewLink: file.webViewLink,
      webContentLink: file.webContentLink,
      thumbnailLink: thumbnail,
      proxyUrl: `/api/photos/${file.id}`,
      directUrl: `https://lh3.googleusercontent.com/d/${file.id}=w1200`,
      width: file.imageMediaMetadata?.width || file.videoMediaMetadata?.width,
      height: file.imageMediaMetadata?.height || file.videoMediaMetadata?.height,
    };
  });
}

/**
 * Upload a photo or video to customer's Google Drive folder
 */
export async function uploadPhotoToCustomerDrive(params: {
  userId: number;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  caption?: string;
  description?: string;
}): Promise<DrivePhoto> {
  const { userId, fileName, mimeType, buffer, caption, description } = params;

  const conn = await getCustomerDriveConnection(userId);
  let folderId = conn?.rootFolderId;
  let accessToken: string;

  if (conn?.connected && folderId) {
    accessToken = await getCustomerAccessToken(userId);
  } else if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
    folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    accessToken = await getLegacyAccessToken();
  } else {
    throw new Error('No Google Drive folder is configured for this account. Please connect your Google Drive.');
  }

  const metadata = {
    name: fileName,
    parents: [folderId],
    description: description || caption || 'Birthday media upload',
  };

  const boundary = `-------314159265358979323846_${Date.now()}`;
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metaPart = `Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`;
  const mediaHeader = `Content-Type: ${mimeType}\r\nContent-Transfer-Encoding: base64\r\n\r\n`;

  const payload = Buffer.concat([
    Buffer.from(delimiter + metaPart + delimiter + mediaHeader),
    Buffer.from(buffer.toString('base64')),
    Buffer.from(closeDelimiter),
  ]);

  const uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,createdTime,webViewLink,webContentLink,thumbnailLink';

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': payload.length.toString(),
    },
    body: payload,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Google Drive upload error: ${err.error?.message || res.statusText}`);
  }

  const uploadedFile = await res.json();

  // Try setting public reader permission on the individual file for robust public streaming
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${uploadedFile.id}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'anyone', role: 'reader' }),
    });
  } catch (pErr) {
    console.warn('File permission notice:', pErr);
  }

  let thumbnail = uploadedFile.thumbnailLink;
  if (thumbnail) {
    thumbnail = thumbnail.replace(/=s\d+/, '=s800');
  } else {
    thumbnail = `https://lh3.googleusercontent.com/d/${uploadedFile.id}=w800`;
  }

  return {
    id: uploadedFile.id,
    name: uploadedFile.name,
    mimeType: uploadedFile.mimeType,
    size: uploadedFile.size ? parseInt(uploadedFile.size, 10) : buffer.length,
    createdTime: uploadedFile.createdTime || new Date().toISOString(),
    webViewLink: uploadedFile.webViewLink,
    webContentLink: uploadedFile.webContentLink,
    thumbnailLink: thumbnail,
    proxyUrl: `/api/photos/${uploadedFile.id}`,
    directUrl: `https://lh3.googleusercontent.com/d/${uploadedFile.id}=w1200`,
    caption,
  };
}

/**
 * Stream file binary directly from Google Drive for guests and visitors
 */
export async function getDriveFileStream(
  fileId: string,
  userId?: number
): Promise<{
  stream: ReadableStream<Uint8Array> | null;
  mimeType: string;
  size?: number;
}> {
  let accessToken: string;
  // If specific userId is given, try that first; otherwise try the active connected customer (userId 1 or from DB)
  try {
    const targetId = userId || 1;
    accessToken = await getCustomerAccessToken(targetId);
  } catch {
    accessToken = await getLegacyAccessToken();
  }

  // Retrieve file metadata
  const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,size`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!metaRes.ok) {
    throw new Error('File not found in Google Drive');
  }

  const meta = await metaRes.json();
  const mimeType = meta.mimeType || 'application/octet-stream';
  const size = meta.size ? parseInt(meta.size, 10) : undefined;

  // Fetch file content
  const contentRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!contentRes.ok) {
    throw new Error(`Failed to stream file: ${contentRes.statusText}`);
  }

  return {
    stream: contentRes.body,
    mimeType,
    size,
  };
}

/**
 * Delete a photo from Google Drive
 */
export async function deleteCustomerPhoto(fileId: string, userId: number): Promise<boolean> {
  const accessToken = await getCustomerAccessToken(userId);
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return res.ok || res.status === 404;
}
