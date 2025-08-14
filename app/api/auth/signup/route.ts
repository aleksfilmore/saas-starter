import { NextRequest, NextResponse } from 'next/server';
import { lucia } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema'; // FIXED: Use main schema consistently
import { generateId } from 'lucia';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { hashPassword, validatePasswordStrength } from '@/lib/crypto/password';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API called...');
    
    const body = await request.json();
    const { email, password } = body;

    console.log('Signup attempt for email:', email);

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: 'Password does not meet security requirements', details: passwordValidation.errors },
        { status: 400 }
      );
    }

    // Check if user already exists
    console.log('Checking if user exists...');
    const existingUser = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password securely
    console.log('Hashing password with crypto...');
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = generateId(15);
    console.log('Inserting user into database...');
    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      hashedPassword,
    });

    console.log('User created successfully:', userId);

    // Create session
    console.log('Creating session...');
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    console.log('Signup complete for user:', userId);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Account created successfully',
        user: {
          id: userId,
          email: email.toLowerCase(),
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
