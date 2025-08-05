import { NextRequest, NextResponse } from 'next/server';
import { lucia, validateRequest } from '@/lib/auth';
import { cookies } from 'next/headers';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { session } = await validateRequest();
    
    if (session) {
      // Invalidate Lucia session
      await lucia.invalidateSession(session.id);
      
      // Clear session cookie
      const sessionCookie = lucia.createBlankSessionCookie();
      const cookieStore = await cookies();
      cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }

    // Return success regardless of session existence
    // Frontend will handle localStorage cleanup
    return NextResponse.json(
      { 
        success: true, 
        message: 'Logged out successfully' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Logout error:', error);
    // Still return success - logout should always succeed
    return NextResponse.json(
      { 
        success: true, 
        message: 'Logged out successfully' 
      },
      { status: 200 }
    );
  }
}
