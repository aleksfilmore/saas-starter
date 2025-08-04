import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { emailService } from '@/lib/email'
import crypto from 'crypto'

// Store reset tokens temporarily (in production, use Redis or database)
const resetTokens = new Map<string, { email: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists in database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    // For security, always return success even if user doesn't exist
    if (existingUser.length === 0) {
      console.log(`Password reset requested for non-existent email: ${email}`)
      return NextResponse.json({
        success: true,
        message: 'If that email exists, a password reset link has been sent.'
      })
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expires = Date.now() + (60 * 60 * 1000) // 1 hour from now

    // Store token temporarily
    resetTokens.set(resetToken, { 
      email: email.toLowerCase(), 
      expires 
    })

    // Clean up expired tokens
    for (const [token, data] of resetTokens.entries()) {
      if (data.expires < Date.now()) {
        resetTokens.delete(token)
      }
    }

    // Send password reset email
    const emailResult = await emailService.sendPasswordResetEmail(email, resetToken)

    if (!emailResult.success) {
      console.error('Failed to send reset email:', emailResult.error)
      return NextResponse.json(
        { success: false, error: 'Failed to send reset email. Please try again.' },
        { status: 500 }
      )
    }

    console.log(`Password reset email sent to: ${email}`)
    return NextResponse.json({
      success: true,
      message: 'Password reset link has been sent to your email.'
    })

  } catch (error) {
    console.error('Forgot password API error:', error)
    return NextResponse.json(
      { success: false, error: 'Network error. Please try again.' },
      { status: 500 }
    )
  }
}

// Export the resetTokens for use in reset-password API
export { resetTokens }

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
