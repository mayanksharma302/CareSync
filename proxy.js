import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

const protectedRoutes = ['/dashboard', '/patients', '/appointments', '/ai'];
const authRoutes = ['/login', '/register'];

// Next.js 16: proxy.js must use a default export function
export default async function proxy(request) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  const cookie = request.cookies.get('caresync_session')?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect root to login or dashboard
  if (path === '/') {
    return NextResponse.redirect(new URL(session ? '/dashboard' : '/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
