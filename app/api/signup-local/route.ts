import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/actual-schema';
import { eq } from 'drizzle-orm';
// Signup-local now creates user then redirects to Auth0 hosted signup for session establishment
import { cookies } from 'next/headers';
import { generateId } from '@/lib/utils';

// Quiz-based signup endpoint
export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Quiz signup attempt');
    
    const { email, password, username, quizResult, source } = await request.json();
    console.log('📧 Signup data received:', { email, username, source, hasQuizResult: !!quizResult });

    // Validation
    if (!email || !password || !username) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Email, password, and username are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      console.log('❌ Password too short');
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    console.log('📧 Quiz signup for:', email);

    // Check if user already exists (only select essential columns)
    const existingUser = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('❌ User already exists');
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('🔐 Password hashed successfully');

    // Generate user ID
    const userId = generateId();
    console.log('🆔 Generated user ID:', userId);

    // Extract archetype from quiz result
    const archetype = quizResult?.attachmentStyle || 'unknown';
    console.log('🎭 User archetype:', archetype);

    console.log('💾 Attempting to create user with data:', {
      id: userId,
      email: email.toLowerCase(),
      username: username,
      hasPasswordHash: !!hashedPassword
    });

    // Create user account using only columns that definitely exist
    const newUser = await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      username: username,
      hashedPassword,
      created_at: new Date(),
      updated_at: new Date()
    }).returning({
      id: users.id,
      email: users.email,
      username: users.username
    });

    console.log('✅ User created successfully:', newUser);

  console.log('User created; redirecting to Auth0 hosted signup for session establishment');
  const redirectUrl = new URL('/api/auth/signup', request.url);
  return NextResponse.redirect(redirectUrl, 303);

  } catch (error) {
    console.error('❌ Quiz signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
