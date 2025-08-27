import { NextRequest, NextResponse } from 'next/server';
// Mobile sign-in no longer uses lucia; instructs clients to use Auth0 OAuth flows
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/actual-schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!validPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Mobile clients should use OAuth / Auth0 flows. For now, return an informational error indicating
    // the API no longer issues local sessions and instruct the client to use Auth0 hosted flows.
    return NextResponse.json({
      success: false,
      message: 'Mobile sign-in is handled by Auth0. Use the OAuth flow or exchange tokens via the /api/auth Pages API.',
    }, { status: 400 });

  } catch (error: any) {
    console.error('Mobile sign-in error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
