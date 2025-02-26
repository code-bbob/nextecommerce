import { NextResponse } from 'next/server';

export function middleware(req) {
  // Use the built-in cookies API from the Edge runtime
  const token = req.cookies.get('accessToken')?.value;
  const { pathname } = req.nextUrl;

  // Define your protected routes. Here "/" is included.
  const protectedRoutes = ['/checkout', '/repair', '/search'];

  // If the current pathname is protected and there's no token, redirect to login
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('auth/login/', req.url));
  }

  return NextResponse.next();
}
