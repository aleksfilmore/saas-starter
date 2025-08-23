// Signup API route - Direct database registration with actual schema
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema'; // Use main schema
import { eq } from 'drizzle-orm';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';
import { generateId } from '@/lib/utils';
import { generateUniqueUsername } from '@/lib/username-generator';
import { sendEmailVerificationEmail } from '@/lib/email/email-service';

export interface SignupResponse {
  error?: string | null;
  success: boolean;
  message?: string;
  token?: string;
  data?: {
    userId?: string;
    email?: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<SignupResponse>> {
  try {
    const { email, password, username, wantsNewsletter, subscriptionTier, scanAnswers } = await request.json();

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
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    console.log('🔧 Signup attempt for:', email);

    // Check if user already exists
    const existingUser = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = generateId();

    // Generate unique username using proper algorithm
    console.log('🔧 Generating unique username for direct signup...');
    const finalUsername = username || await generateUniqueUsername();
    console.log('🔧 Final username for user:', finalUsername);

    // Double-check username availability right before insertion to prevent race conditions
    if (username) {
      const usernameCheck = await db.select({ id: users.id })
        .from(users)
        .where(eq(users.username, finalUsername))
        .limit(1);
      
      if (usernameCheck.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Username is no longer available. Please try a different one.' },
          { status: 409 }
        );
      }
    }

    // Create user in database using actual schema
    const newUser = await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      username: finalUsername,
      hashedPassword: hashedPassword,
      subscription_tier: subscriptionTier || 'ghost_mode',
      created_at: new Date(),
      updated_at: new Date()
    }).returning({
      id: users.id,
      email: users.email,
      username: users.username
    });

    console.log('✅ User created successfully:', email);

    // Send email verification (optional, non-blocking)
    try {
      const verificationToken = generateId() + generateId(); // Double token for extra security
      
      // Update user with verification token
      await db.update(users)
        .set({
          email_verification_token: verificationToken,
          email_verification_sent_at: new Date()
        })
        .where(eq(users.id, userId));

      // Send verification email (don't block signup if this fails)
      await sendEmailVerificationEmail(email.toLowerCase(), verificationToken);
      console.log('📧 Verification email sent to:', email);
    } catch (emailError) {
      console.error('⚠️ Failed to send verification email (non-blocking):', emailError);
      // Don't return error - account creation should still succeed
    }

    // Create session using Lucia
    const session = await lucia.createSession(userId, {
      source: 'direct-signup'
    });
    
    const sessionCookie = lucia.createSessionCookie(session.id);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      token: session.id, // For compatibility with existing frontend
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
