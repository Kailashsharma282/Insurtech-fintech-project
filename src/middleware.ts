import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'agrisure_session';

// Decode JWT payload without external dependencies (works in Edge runtime)
function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = atob(base64);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected paths
  const isFarmerRoute = pathname.startsWith('/farmer');
  const isInsurerRoute = pathname.startsWith('/insurer');
  const isAdminRoute = pathname.startsWith('/admin');

  if (!isFarmerRoute && !isInsurerRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // If no session cookie found
  if (!sessionCookie) {
    // For local evaluation and demo links, if a demo query parameter or default header is present, allow or redirect
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Verify decoded payload
  const session = decodeJwtPayload(sessionCookie);
  if (!session || (session.exp && session.exp < Math.floor(Date.now() / 1000))) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(url);
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }

  const userRole = session.role;

  // Role-based boundary enforcement
  if (isInsurerRoute && userRole === 'FARMER') {
    // Farmer trying to access underwriter desk without authorization
    const url = request.nextUrl.clone();
    url.pathname = '/farmer/dashboard';
    url.searchParams.set('unauthorized', 'insurer_access_denied');
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && userRole === 'FARMER') {
    const url = request.nextUrl.clone();
    url.pathname = '/farmer/dashboard';
    url.searchParams.set('unauthorized', 'admin_access_denied');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/farmer/:path*',
    '/insurer/:path*',
    '/admin/:path*',
  ],
};
