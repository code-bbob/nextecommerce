import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Define your protected routes. Here "/" is included.
  const protectedRoutes = ['/repair'];

  // Check if any protected route is a prefix of the current pathname
  const isProtectedRoute = protectedRoutes.some((route) => {
    return pathname.startsWith(route);
  });

  // IMPORTANT: Do not read cookies unless needed.
  // Reading cookies on every request can disable caching for public pages.
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Use the built-in cookies API from the Edge runtime
  const token = req.cookies.get('accessToken')?.value;

  // If the current pathname is protected and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    // toast.error('Please login to continue');
    return NextResponse.redirect(new URL('/auth/login', req.url)); // Corrected path
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/repair/:path*'],
};