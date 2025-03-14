import { NextResponse } from 'next/server';
import toast from 'react-hot-toast';

export function middleware(req) {
  // Use the built-in cookies API from the Edge runtime
  const token = req.cookies.get('accessToken')?.value;
  const { pathname } = req.nextUrl;

  // Define your protected routes. Here "/" is included.
  const protectedRoutes = ['/checkout', '/repair'];

  // Check if any protected route is a prefix of the current pathname
  const isProtectedRoute = protectedRoutes.some((route) => {
    return pathname.startsWith(route);
  });

  // If the current pathname is protected and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    // toast.error('Please login to continue');
    return NextResponse.redirect(new URL('/auth/login', req.url)); // Corrected path
  }

  return NextResponse.next();
}