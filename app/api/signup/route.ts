// Production Signup API route - Direct database connection
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/minimal-schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export interface SignupResponse {
  error?: string | null;
  success: boolean;
  message?: string;
  data?: {
    userId?: string;
    email?: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<SignupResponse>> {
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

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password with same method as login
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Generate user ID
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Insert user
    const result = await db
      .insert(users)
      .values({
        id: userId,
        email: email.toLowerCase(),
        hashedPassword: hashedPassword,
      })
      .returning();

    console.log('User signed up:', email);
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        userId: result[0].id,
        email: result[0].email,
      }
    });

  } catch (error) {
    console.error('Signup API error:', error);
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
