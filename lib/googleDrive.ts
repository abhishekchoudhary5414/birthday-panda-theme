/**
 * Google Drive API Integration Helper
 * 
 * Uses OAuth 2.0 Refresh Token flow to interact with Google Drive v3 REST API.
 * Configured with:
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 * - GOOGLE_REFRESH_TOKEN
 * - GOOGLE_DRIVE_FOLDER_ID
 */

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

interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix timestamp in ms
}

let cachedToken: TokenCache | null = null;

/**
 * Retrieve a valid Google OAuth access token using the refresh token.
 */
export async function getGoogleAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing Google Drive credentials in environment: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REFRESH_TOKEN'
    );
  }

  // Return cached token if still valid (with 60-second buffer)
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.accessToken;
  }

  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    const errorMsg = data.error_description || data.error || 'Failed to exchange refresh token for access token';
    console.error('Google OAuth token error:', data);
    throw new Error(`Google Drive Auth Error: ${errorMsg}`);
  }

  const expiresInMs = (data.expires_in || 3600) * 1000;
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresInMs,
  };

  return data.access_token;
}

/**
 * Get folder ID from env or throw error
 */
export function getDriveFolderId(): string {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID environment variable is missing.');
  }
  return folderId;
}

/**
 * Test the Google Drive connection status
 */
export async function testGoogleDriveConnection(): Promise<{
  connected: boolean;
  message: string;
  folderId?: string;
  folderName?: string;
  filesCount?: number;
}> {
  try {
    const accessToken = await getGoogleAccessToken();
    const folderId = getDriveFolderId();

    // Verify access to the folder
    const folderRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${folderId}?fields=id,name,mimeType`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!folderRes.ok) {
      const errData = await folderRes.json();
      return {
        connected: false,
        message: `Failed to access folder (${folderId}): ${errData.error?.message || 'Access denied'}`,
        folderId,
      };
    }

    const folderData = await folderRes.json();

    // Check count of files in folder
    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+trashed=false&fields=files(id)&pageSize=10`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const listData = await listRes.json();

    return {
      connected: true,
      message: 'Successfully connected to Google Drive!',
      folderId,
      folderName: folderData.name || 'Ditvi Birthday Photos',
      filesCount: listData.files?.length ?? 0,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown connection error';
    return {
      connected: false,
      message: errorMessage,
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
    };
  }
}

/**
 * Upload a photo buffer directly to the Google Drive folder.
 * Automatically marks the uploaded photo as readable to anyone with the link.
 */
export async function uploadPhotoToDrive({
  buffer,
  fileName,
  mimeType,
  description = '',
}: {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  description?: string;
}): Promise<DrivePhoto> {
  const accessToken = await getGoogleAccessToken();
  const folderId = getDriveFolderId();

  // Create multipart boundary
  const boundary = `-------DitviPandaParty${Date.now()}`;
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    parents: [folderId],
    description: description,
    properties: {
      source: 'Ditvi Birthday Website',
      app: 'panda-birthday-celebration',
    },
  };

  const metadataPart =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n` +
    'Content-Transfer-Encoding: base64\r\n\r\n';

  const base64Data = buffer.toString('base64');
  const multipartBody = metadataPart + base64Data + closeDelimiter;

  const uploadUrl =
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,thumbnailLink,webContentLink,webViewLink,size,createdTime,imageMediaMetadata';

  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': Buffer.byteLength(multipartBody).toString(),
    },
    body: multipartBody,
  });

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json();
    throw new Error(`Google Drive Upload Failed: ${errorData.error?.message || uploadRes.statusText}`);
  }

  const fileData = await uploadRes.json();

  // Make the file publicly viewable so it can render on web /upload page
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
        allowFileDiscovery: false,
      }),
    });
  } catch (permErr) {
    console.warn('Failed to set public permission on drive file:', permErr);
  }

  return mapDriveFileToPhoto(fileData);
}

/**
 * List all photos in the Google Drive folder.
 */
export async function listPhotosFromDrive({
  pageSize = 100,
}: {
  pageSize?: number;
} = {}): Promise<DrivePhoto[]> {
  const accessToken = await getGoogleAccessToken();
  const folderId = getDriveFolderId();

  const query = `'${folderId}' in parents and trashed = false and (mimeType contains 'image/' or mimeType contains 'video/')`;
  const fields =
    'files(id,name,mimeType,thumbnailLink,webContentLink,webViewLink,createdTime,size,description,imageMediaMetadata)';
  const listUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=${encodeURIComponent(fields)}&orderBy=createdTime+desc&pageSize=${pageSize}`;

  const response = await fetch(listUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to list Google Drive photos: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const files: any[] = data.files || [];

  return files.map((file) => mapDriveFileToPhoto(file));
}

/**
 * Delete a photo from Google Drive by File ID.
 */
export async function deletePhotoFromDrive(fileId: string): Promise<boolean> {
  const accessToken = await getGoogleAccessToken();

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const errorData = await response.json();
    throw new Error(`Failed to delete Google Drive photo: ${errorData.error?.message || response.statusText}`);
  }

  return true;
}

/**
 * Stream/fetch photo binary from Google Drive for proxying.
 */
export async function getDrivePhotoStream(fileId: string): Promise<{
  stream: ReadableStream<Uint8Array> | null;
  mimeType: string;
  size?: number;
}> {
  const accessToken = await getGoogleAccessToken();

  // Get metadata for mimeType
  const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,size`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  let mimeType = 'image/jpeg';
  let size: number | undefined;
  if (metaRes.ok) {
    const meta = await metaRes.json();
    if (meta.mimeType) mimeType = meta.mimeType;
    if (meta.size) size = parseInt(meta.size, 10);
  }

  // Get binary content
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok || !response.body) {
    throw new Error(`Failed to fetch photo stream: ${response.statusText}`);
  }

  return {
    stream: response.body,
    mimeType,
    size,
  };
}

/**
 * Helper to normalize Google Drive file object to our standard DrivePhoto interface
 */
function mapDriveFileToPhoto(file: any): DrivePhoto {
  const fileId = file.id;

  // High-resolution direct preview via googleusercontent
  // Format: https://lh3.googleusercontent.com/d/{fileId}=w1600 or webViewLink
  const directUrl = file.thumbnailLink
    ? file.thumbnailLink.replace(/=s\d+/, '=s1600')
    : `https://lh3.googleusercontent.com/d/${fileId}=w1600`;

  return {
    id: fileId,
    name: file.name,
    mimeType: file.mimeType,
    size: file.size ? parseInt(file.size, 10) : undefined,
    createdTime: file.createdTime || new Date().toISOString(),
    webViewLink: file.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
    webContentLink: file.webContentLink,
    thumbnailLink: file.thumbnailLink || directUrl,
    proxyUrl: `/api/photos/${fileId}`,
    directUrl,
    caption: file.description || '',
    width: file.imageMediaMetadata?.width,
    height: file.imageMediaMetadata?.height,
  };
}
