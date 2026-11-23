import crypto from 'crypto';

/**
 * AES-256-GCM encryption & decryption helper for OAuth refresh tokens
 */

function getEncryptionKey(): Buffer {
  const hexKey = process.env.GOOGLE_DRIVE_TOKEN_ENCRYPTION_KEY || process.env.GOOGLE_GMAIL_TOKEN_ENCRYPTION_KEY;
  if (!hexKey) {
    throw new Error('OAuth token encryption key is missing (GOOGLE_DRIVE_TOKEN_ENCRYPTION_KEY or GOOGLE_GMAIL_TOKEN_ENCRYPTION_KEY).');
  }

  // Key can be 32 bytes hex or raw string
  if (hexKey.length === 64) {
    return Buffer.from(hexKey, 'hex');
  }

  // Fallback: SHA-256 hash string to get 32 bytes
  return crypto.createHash('sha256').update(hexKey).digest();
}

/**
 * Encrypt a plain token string
 * Format: iv:authTag:encryptedData (all hex encoded)
 */
export function encryptToken(plainText: string): string {
  if (!plainText) return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // 96 bits recommended for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt a token string
 */
export function decryptToken(cipherText: string): string {
  if (!cipherText) return '';
  const parts = cipherText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted token format');
  }

  const [ivHex, tagHex, encryptedHex] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
