import { nextAuthMiddleware } from './auth';
import { adminMiddleware } from './admin';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith('/api/admin') || 
      request.nextUrl.pathname.startsWith('/dashboard/admin')) {
    return adminMiddleware(request);
  }

  // Otherwise use the standard auth middleware
  return nextAuthMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};