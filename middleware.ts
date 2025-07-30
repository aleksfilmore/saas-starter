// File: middleware.ts - Compatible with Next.js 15

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Future-proof middleware for authentication and CSRF protection
export async function middleware(request: NextRequest): Promise<NextResponse> {
  // CSRF protection for non-GET requests
  if (request.method !== 'GET') {
    const originHeader = request.headers.get('Origin');
    const hostHeader = request.headers.get('Host');
    
    // Simple origin verification for security
    if (!originHeader || !hostHeader) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    const origin = new URL(originHeader);
    if (origin.host !== hostHeader) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match all routes except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};
