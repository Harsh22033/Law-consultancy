import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

type SessionPayload = {
  role: 'lawyer' | 'client' | 'employee';
};

async function decryptSession(session: string): Promise<SessionPayload | null> {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const encodedKey = new TextEncoder().encode(secret);
    const verified = await jwtVerify(session, encodedKey);
    return verified.payload as SessionPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = request.cookies.get('session')?.value;
  const sessionPayload = session ? await decryptSession(session) : null;

  // Public routes that don't require authentication
  // Dashboard routes that require authentication
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // Auth routes (login, signup)
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  // If accessing dashboard without session, redirect to login
  if (isDashboardRoute && !sessionPayload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If accessing auth routes with session, redirect to dashboard
  if (isAuthRoute && sessionPayload) {
    const dashboardUrl = `/dashboard/${sessionPayload.role}`;
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  // If accessing dashboard with wrong role, redirect to correct dashboard
  if (isDashboardRoute && sessionPayload) {
    const pathParts = pathname.split('/');
    const requestedRole = pathParts[2]; // /dashboard/{role}

    if (requestedRole && requestedRole !== sessionPayload.role) {
      const correctDashboardUrl = `/dashboard/${sessionPayload.role}`;
      return NextResponse.redirect(new URL(correctDashboardUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
