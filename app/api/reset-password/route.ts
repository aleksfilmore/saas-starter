import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
// Use actual-schema for consistency with auth/signin and drizzle schema-central
import { users } from '@/lib/db/actual-schema'
import { eq, and, gt } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// Ensure Node runtime (bcryptjs + DB access reliability)
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

  console.log('🔧 Processing password reset with token:', typeof token === 'string' ? token.substring(0, 8) + '...' : '[invalid token type]')

    // Find user with valid reset token
    // Query only non-expired tokens directly at the DB layer
    const userResult = await db.select()
      .from(users)
      .where(
        and(
          eq(users.reset_token, token),
          // Enforce expiry in the SQL predicate for stronger protection
          gt(users.reset_token_expiry, new Date())
        )
      )
      .limit(1)

    const user = userResult[0]

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // (Defensive) Double-check expiry in application layer (should already be filtered)
  if (!user.reset_token_expiry || new Date() > user.reset_token_expiry) {
      return NextResponse.json({ error: 'Reset token has expired. Please request a new one.' }, { status: 400 })
    }

    // Hash the new password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update user password and clear reset token
    await db.update(users)
      .set({
        hashedPassword: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
        updated_at: new Date()
      })
      .where(eq(users.id, user.id))

  const dbUser = user as any
  console.log('✅ Password reset successfully for user:', dbUser.email)

    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully. You can now sign in with your new password.'
    })

  } catch (error) {
    console.error('❌ Reset password error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    // Surface internal error detail in logs only; keep response generic
    console.log('ResetPasswordInternalErrorDetail:', message)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
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
  })
}
