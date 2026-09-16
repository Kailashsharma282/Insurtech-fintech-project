import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('agrisure_user_role')?.value || 'FARMER';

  // 1. Protect Insurer routes
  if (pathname.startsWith('/insurer')) {
    if (role === 'FARMER') {
      return NextResponse.redirect(new URL('/farmer/dashboard', request.url));
    }
  }

  // 2. Protect Farmer routes
  if (pathname.startsWith('/farmer')) {
    if (role === 'INSURER') {
      return NextResponse.redirect(new URL('/insurer/dashboard', request.url));
    }
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/overview', request.url));
    }
  }

  // 3. Protect Admin & Operations routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/operations')) {
    if (role === 'FARMER') {
      return NextResponse.redirect(new URL('/farmer/dashboard', request.url));
    }
    if (role === 'INSURER') {
      return NextResponse.redirect(new URL('/insurer/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/farmer/:path*',
    '/insurer/:path*',
    '/admin/:path*',
    '/operations/:path*',
  ],
};
