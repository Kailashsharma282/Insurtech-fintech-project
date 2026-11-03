import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For dummy demo mode: Redirect login and register attempts straight to the farmer dashboard
  if (pathname === '/login' || pathname === '/register') {
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
