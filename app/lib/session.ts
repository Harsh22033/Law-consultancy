import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { SessionPayload } from './definitions';

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error('SESSION_SECRET environment variable is not set');
}

const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
  try {
    const verified = await jwtVerify(session, encodedKey);
    return verified.payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(
  userId: string,
  email: string,
  role: string,
  apiToken: string,
): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session: SessionPayload = {
    userId,
    email,
    role: role as 'lawyer' | 'client' | 'employee',
    apiToken,
    expiresAt: expiresAt.getTime(),
  };

  const encryptedSession = await encrypt(session);
  const cookieStore = await cookies();

  cookieStore.set('session', encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/',
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  return decrypt(session);
}
