import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is missing.');
}

export const sql = neon(process.env.DATABASE_URL);

/**
 * Returns default active owner user ID for public routes when no specific admin is logged in.
 * Resolves to the user ID having an active Google Drive / Gmail connection, or the primary admin user ID.
 */
export async function getDefaultOwnerUserId(): Promise<number> {
  try {
    const driveConn = await sql`
      SELECT user_id FROM google_drive_connections WHERE connected = TRUE ORDER BY id ASC LIMIT 1
    `;
    if (driveConn.length > 0 && driveConn[0].user_id) {
      return Number(driveConn[0].user_id);
    }
    const adminUser = await sql`
      SELECT id FROM admin_users ORDER BY id ASC LIMIT 1
    `;
    if (adminUser.length > 0 && adminUser[0].id) {
      return Number(adminUser[0].id);
    }
  } catch {
    // fallback
  }
  return 1;
}
