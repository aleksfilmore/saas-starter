import { NextRequest, NextResponse } from 'next/server';
import { revokeUserSessionsByAuth0Sub } from '@/lib/auth/auth0-management';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No session found' },
        { status: 401 }
      );
    }

    const sessionId = authHeader.substring(7);

    // If the provided token looks like an Auth0 user id (auth0|...), attempt to revoke sessions
    if (sessionId.startsWith('auth0|')) {
      try {
        await revokeUserSessionsByAuth0Sub(sessionId);
      } catch (err) {
        console.warn('Failed to revoke sessions for mobile sign-out:', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Signed out successfully' });

  } catch (error: any) {
    console.error('Mobile sign-out error:', error);
    return NextResponse.json(
      { success: false, message: 'Sign out failed' },
      { status: 500 }
    );
  }
}
