// Signup API route - Direct database registration with actual schema
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

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
    const { email, password, username, quizResult } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    console.log('🔧 Signup attempt for:', email);

    // Direct database connection using Neon
    const sql = neon(process.env.POSTGRES_URL!);

    // Check if user already exists - using actual column names
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
    `;

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = uuidv4();

    // Determine archetype from quiz result or default
    const archetype = quizResult?.archetype || 'balanced';

    // Create user in database - using only existing columns
    await sql`
      INSERT INTO users (id, email, password_hash, archetype) 
      VALUES (${userId}, ${email.toLowerCase()}, ${hashedPassword}, ${archetype})
    `;

    console.log('✅ User created successfully:', email);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        userId: userId,
        email: email
      }
    });

  } catch (error) {
    console.error('❌ Signup API error:', error);
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
