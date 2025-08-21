import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/actual-schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/utils';
import { sendEmailVerificationEmail } from '@/lib/email/email-service';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.email_verified) {
      return NextResponse.json(
        { success: true, message: 'Email already verified' },
        { status: 200 }
      );
    }

    // Check rate limiting - don't send if sent within last 5 minutes
    if (user.email_verification_sent_at) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      if (user.email_verification_sent_at > fiveMinutesAgo) {
        return NextResponse.json(
          { success: false, error: 'Verification email was sent recently. Please wait 5 minutes before requesting another.' },
          { status: 429 }
        );
      }
    }

    // Generate verification token
    const verificationToken = generateId() + generateId(); // Double length for security

    // Update user with verification token and timestamp
    await db
      .update(users)
      .set({
        email_verification_token: verificationToken,
        email_verification_sent_at: new Date(),
        updated_at: new Date()
      })
      .where(eq(users.id, user.id));

    // Send verification email
    const emailResult = await sendEmailVerificationEmail(
      email, 
      verificationToken,
      user.username || user.email.split('@')[0]
    );

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully. Check your inbox!'
    });

  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
