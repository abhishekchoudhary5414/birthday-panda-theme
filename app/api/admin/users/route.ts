import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function getAuthAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  return token ? verifyToken(token) : null;
}

// GET all admin/customer users along with their individual Google Drive & Gmail connection status
export async function GET(req: NextRequest) {
  const currentAdmin = getAuthAdmin(req);
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await sql`
      SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.role, 
        u.created_at,
        d.connected as drive_connected,
        d.google_email as drive_google_email,
        d.root_folder_name as drive_folder_name,
        d.sharing_status as drive_sharing_status,
        g.connected as gmail_connected,
        g.google_email as gmail_google_email
      FROM admin_users u
      LEFT JOIN google_drive_connections d ON u.id = d.user_id
      LEFT JOIN gmail_connections g ON u.id = g.user_id
      ORDER BY u.id ASC
    `;

    return NextResponse.json({
      success: true,
      currentUserId: currentAdmin.id,
      users: users.map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: u.created_at,
        isCurrentUser: u.id === currentAdmin.id,
        drive: {
          connected: Boolean(u.drive_connected),
          accountEmail: u.drive_connected ? u.drive_google_email : null,
          folderName: u.drive_folder_name || 'Birthday Website Media',
          sharingStatus: u.drive_sharing_status || 'disconnected',
        },
        gmail: {
          connected: Boolean(u.gmail_connected),
          accountEmail: u.gmail_connected ? u.gmail_google_email : null,
        },
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch admin users';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST create a new user/customer account
export async function POST(req: NextRequest) {
  const currentAdmin = getAuthAdmin(req);
  if (!currentAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, password, role = 'admin' } = body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM admin_users WHERE LOWER(email) = ${trimmedEmail} LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password.trim(), salt);

    const result = await sql`
      INSERT INTO admin_users (name, email, password_hash, role)
      VALUES (${name.trim()}, ${trimmedEmail}, ${passwordHash}, ${role})
      RETURNING id, name, email, role, created_at
    `;

    return NextResponse.json({
      success: true,
      message: `User ${name} created successfully! They can log in and connect their own Google Drive & Gmail accounts.`,
      user: result[0],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create user';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
