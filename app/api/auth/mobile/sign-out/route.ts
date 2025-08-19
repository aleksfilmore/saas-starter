import { NextRequest, NextResponse } from 'next/server';
import { lucia } from '@/lib/auth';

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
    
    // Invalidate the session
    await lucia.invalidateSession(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Signed out successfully',
    });

  } catch (error: any) {
    console.error('Mobile sign-out error:', error);
    return NextResponse.json(
      { success: false, message: 'Sign out failed' },
      { status: 500 }
    );
  }
}
