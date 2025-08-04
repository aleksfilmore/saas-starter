Users\iamal\OneDrive\Documents\GitHub\saas-starter\middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Security headers
  const response = NextResponse.next()
  
  // HTTPS redirect in production
  if (process.env.NODE_ENV === 'production' && !request.url.startsWith('https://')) {
    return NextResponse.redirect(request.url.replace('http://', 'https://'))
  }

  // Rate limiting for auth endpoints
  if (request.nextUrl.pathname.startsWith('/api/auth') || 
      request.nextUrl.pathname.startsWith('/api/login') ||
      request.nextUrl.pathname.startsWith('/api/signup')) {
    
    // Add security headers for auth routes
    response.headers.set('X-RateLimit-Limit', '10')
    response.headers.set('X-RateLimit-Window', '60')
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}