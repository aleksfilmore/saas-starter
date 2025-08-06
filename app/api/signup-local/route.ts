import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/minimal-schema';
import { eq } from 'drizzle-orm';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';
import { generateId } from '@/lib/utils';

// Quiz-based signup endpoint
export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Quiz signup attempt');
    
    const { email, password, quizResult, source } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    console.log('📧 Quiz signup for:', email);

    // Check if user already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate user ID
    const userId = generateId();

    // Extract archetype from quiz result
    const archetype = quizResult?.attachmentStyle || 'unknown';

    // Create user account
    const newUser = await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      hashedPassword,
      tier: 'ghost', // Free tier
      archetype,
      xp: 0,
      bytes: 100, // Starting bytes
      level: 1,
      ritual_streak: 0,
      no_contact_streak: 0,
      is_verified: false,
      subscription_status: 'none',
      created_at: new Date(),
      updated_at: new Date()
    }).returning({
      id: users.id,
      email: users.email,
      tier: users.tier,
      archetype: users.archetype
    });

    console.log('✅ User created successfully:', userId);

    // Create session using Lucia
    const session = await lucia.createSession(userId, {
      source: source || 'quiz-signup'
    });
    
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    console.log('🔐 Session created for quiz user:', userId);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: userId,
        email: email.toLowerCase(),
        tier: 'ghost',
        archetype,
        level: 1,
        xp: 0,
        bytes: 100
      }
    });

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
