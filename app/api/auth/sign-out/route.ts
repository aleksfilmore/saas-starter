import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { session } = await validateRequest();
    
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    // Clear shim cookie
    try {
      const cookieStore = await cookies();
      cookieStore.set('auth0-session', '', { httpOnly: true, path: '/', sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', expires: new Date(0) });
    } catch (err) {
      console.warn('Failed to clear shim session cookie:', err);
    }

    // Return Auth0 SDK logout path to client so SDK clears its cookies on the web
    const logoutUrl = '/api/auth/logout?returnTo=/';
    return NextResponse.json({ success: true, redirectUrl: logoutUrl });
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect('/api/auth/logout?returnTo=/', 303);
}
