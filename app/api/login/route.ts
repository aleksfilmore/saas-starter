// Production Login API route - Direct database connection with Lucia auth
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/minimal-schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';

export interface LoginResponse {
  error?: string | null;
  success: boolean;
  message?: string;
  token?: string;
  data?: {
    userId?: string;
    email?: string;
    role?: string;
    quizResult?: any;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user[0].hashedPassword);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Determine role based on email
    const adminEmails = [
      'system_admin@ctrlaltblock.com',
    ];
    const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';

    // Create Lucia session
    const session = await lucia.createSession(user[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    // Create fallback token for localStorage compatibility
    const token = `auth-token-${user[0].id}-${Date.now()}`;

    console.log('User logged in:', email);
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        userId: user[0].id,
        email: user[0].email,
        role,
        // Add admin-specific quiz result if admin
        ...(role === 'admin' && {
          quizResult: {
            attachmentStyle: 'secure',
            traits: ['System administrator access', 'Full platform visibility', 'Advanced debugging capabilities'],
            healingPath: ['Platform management', 'User support', 'System optimization'],
            completedAt: new Date().toISOString()
          }
        })
      }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Network error. Please try again.' },
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
