import { NextRequest, NextResponse } from 'next/server';
import { lucia } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/minimal-schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifyPassword } from '@/lib/crypto/password';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('Signin API called...');
    
    const body = await request.json();
    const { email, password } = body;

    console.log('Signin attempt for email:', email);

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    console.log('Querying database...');
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        hashedPassword: users.hashedPassword,
        onboardingCompleted: users.onboardingCompleted,
        isBanned: users.isBanned,
      })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    console.log('Database query complete. Found users:', user.length);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    const existingUser = user[0];
    console.log('User found:', existingUser.id);

    // Verify password with secure crypto
    console.log('Verifying password...');
    const validPassword = await verifyPassword(password, existingUser.hashedPassword);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      );
    }

    console.log('Password verified successfully');

    // Check if user is banned
    if (existingUser.isBanned) {
      return NextResponse.json(
        { error: 'Account has been suspended' },
        { status: 403 }
      );
    }

    // Create session
    console.log('Creating session...');
    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // Update last active
    await db
      .update(users)
      .set({ lastActiveAt: new Date() })
      .where(eq(users.id, existingUser.id));

    console.log('Login successful for user:', existingUser.id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Logged in successfully',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          onboardingCompleted: existingUser.onboardingCompleted,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
