import { NextRequest, NextResponse } from 'next/server';
import { lucia } from '@/lib/auth';
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

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        tier: user.tier,
        archetype: user.emotional_archetype,
        archetype_details: null, // Not stored in current schema
        bytes: user.bytes,
        ritual_streak: user.streak,
        no_contact_streak: user.no_contact_days,
        last_checkin: user.last_no_contact_checkin,
        last_ritual: user.last_ritual_completed,
        is_verified: !user.is_banned,
        subscription_status: user.subscription_tier,
        subscription_expires: null, // Not stored in current schema
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      session: {
        id: session.id,
        userId: session.userId,
        expiresAt: session.expiresAt,
        fresh: session.fresh,
      },
      sessionToken: session.id, // Use session ID as token for mobile
    });

    // Set session cookie for web compatibility
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return response;

  } catch (error: any) {
    console.error('Mobile sign-in error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
