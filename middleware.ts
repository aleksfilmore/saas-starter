// File: middleware.ts

import { verifyRequestOrigin } from 'lucia';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware function will run for every request that matches the config below.
export async function middleware(request: NextRequest): Promise<NextResponse> {
  // This is a security measure to prevent CSRF attacks.
  // It ensures that POST, PATCH, etc., requests come from your own website.
  if (request.method === 'GET') {
    return NextResponse.next();
  }
  const originHeader = request.headers.get('Origin');
  const hostHeader = request.headers.get('Host');
  if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}

// This config specifies which routes the middleware should run on.
// We are keeping it simple for now to focus on the core functionality.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
