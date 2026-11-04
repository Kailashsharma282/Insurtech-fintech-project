import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /register so farmers can access the new land registration and Banglarbhumi verification desk
  if (pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/farmer/dashboard';
    return NextResponse.redirect(url);
  }

  // All demo routes are open and directly accessible with dummy data
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/farmer/:path*',
    '/insurer/:path*',
    '/admin/:path*',
  ],
};
