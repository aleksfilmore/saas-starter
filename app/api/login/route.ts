// Login API route - Production Lucia authentication
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db/drizzle';
// Use actual-schema for consistency across auth endpoints
import { users } from '@/lib/db/actual-schema';
import { eq } from 'drizzle-orm';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';

export interface LoginResponse {
  error?: string | null;
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    tier: string;
    bytes: number;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
  const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

  console.log('🔧 Login attempt for:', email);

    // Find user in database
    const userResult = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    const user = userResult[0];

    if (!user) {
      console.log('❌ User not found:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    if (!user.hashedPassword) {
      console.error('❌ User record missing hashedPassword column – schema mismatch? User id:', user.id);
      return NextResponse.json(
        { success: false, error: 'Authentication temporarily unavailable' },
        { status: 500 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      console.log('❌ Invalid password for user:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create Lucia session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    console.log('✅ Login successful for:', email);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        tier: user.tier,
        bytes: user.bytes,
      }
    });

  } catch (error) {
  console.error('❌ Login API error:', error);
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.log('LoginInternalErrorDetail:', message);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
