import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { cookies } from 'next/headers';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Clear our compatibility shim cookie (if present) so client-side checks see signed out state
    try {
      const cookieStore = await cookies();
      // name used by lucia shim: 'auth0-session'
      cookieStore.set('auth0-session', '', { httpOnly: true, path: '/', sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', expires: new Date(0) });
    } catch (err) {
      console.warn('Failed to clear shim session cookie:', err);
    }

    // Instruct the client to navigate to the Auth0 SDK logout endpoint which will clear Auth0 cookies
    const logoutUrl = '/api/auth/logout?returnTo=/';

    return NextResponse.json({ success: true, redirectUrl: logoutUrl }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Browser-level sign out: redirect to the Auth0 SDK logout endpoint so the SDK clears its cookies
  return NextResponse.redirect('/api/auth/logout?returnTo=/', 303);
}
