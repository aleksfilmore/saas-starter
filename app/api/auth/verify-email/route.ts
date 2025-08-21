import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/actual-schema';
import { eq, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find user by verification token
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email_verification_token, token))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json(
        { success: true, message: 'Email already verified', alreadyVerified: true },
        { status: 200 }
      );
    }

    // Check if token is expired (24 hours)
    if (user.email_verification_sent_at) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (user.email_verification_sent_at < twentyFourHoursAgo) {
        return NextResponse.json(
          { success: false, error: 'Verification token has expired. Please request a new one.' },
          { status: 400 }
        );
      }
    }

    // Update user as verified and award bonus XP
    const bonusXP = 50;
    await db
      .update(users)
      .set({
        email_verified: true,
        email_verification_token: null,
        email_verification_sent_at: null,
        xp_points: (user.xp_points || 0) + bonusXP,
        updated_at: new Date()
      })
      .where(eq(users.id, user.id));

    console.log(`✅ Email verified for user ${user.id}, awarded ${bonusXP} XP`);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You earned 50 bonus XP.',
      bonusXP,
      user: {
        id: user.id,
        email: user.email,
        email_verified: true,
        xp_points: (user.xp_points || 0) + bonusXP
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/verify-email?error=missing_token', request.url));
    }

    // Find user by verification token
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email_verification_token, token))
      .limit(1);

    if (!user) {
      return NextResponse.redirect(new URL('/verify-email?error=invalid_token', request.url));
    }

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.redirect(new URL('/verify-email?success=already_verified', request.url));
    }

    // Check if token is expired (24 hours)
    if (user.email_verification_sent_at) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (user.email_verification_sent_at < twentyFourHoursAgo) {
        return NextResponse.redirect(new URL('/verify-email?error=expired_token', request.url));
      }
    }

    // Update user as verified and award bonus XP
    const bonusXP = 50;
    await db
      .update(users)
      .set({
        email_verified: true,
        email_verification_token: null,
        email_verification_sent_at: null,
        xp_points: (user.xp_points || 0) + bonusXP,
        updated_at: new Date()
      })
      .where(eq(users.id, user.id));

    console.log(`✅ Email verified for user ${user.id}, awarded ${bonusXP} XP`);

    return NextResponse.redirect(new URL('/verify-email?success=verified', request.url));

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.redirect(new URL('/verify-email?error=server_error', request.url));
  }
}
