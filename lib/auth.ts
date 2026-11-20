import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'panda-birthday-secret-key-2026';

export interface AdminPayload {
  id: number;
  email: string;
  name: string;
  role: string;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}
