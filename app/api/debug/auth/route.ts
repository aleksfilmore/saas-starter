import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { lucia, validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';

// PRODUCTION DEBUG ENDPOINT - Remove after fixing login
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(lucia.sessionCookieName);
    const { user, session } = await validateRequest();

    // Get database connection status
    let dbConnected = false;
    try {
      await db.execute('SELECT 1 as test');
      dbConnected = true;
    } catch (e) {
      dbConnected = false;
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      debug: {
        cookieSet: !!sessionCookie,
        cookieName: lucia.sessionCookieName,
        cookieValue: sessionCookie?.value ? 'present' : 'missing',
        sessionValid: !!session,
        userValid: !!user,
        userId: user?.id || null,
        userEmail: user?.email || null,
        dbConnected,
        authSecret: process.env.AUTH_SECRET ? 'present' : 'missing',
        postgresUrl: process.env.POSTGRES_URL ? 'present' : 'missing',
        nextAuthUrl: process.env.NEXTAUTH_URL || 'not set',
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
