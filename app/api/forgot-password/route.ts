import { NextRequest, NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '@/lib/email/email-service'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'
import { users } from '@/lib/db/unified-schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    console.log('🔧 Processing password reset for:', email)

    // Check if user exists in database
    let user
    try {
      const userResult = await db.select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)
      user = userResult[0]
    } catch (dbError) {
      console.error('Database error checking user:', dbError)
      // Continue anyway for security (don't reveal if email exists)
    }

    // Generate a secure reset token
    const resetToken = uuidv4()
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    if (user) {
      // Store the reset token in the database
      try {
        await db.update(users)
          .set({
            resetToken: resetToken,
            resetTokenExpiry: resetTokenExpiry,
            updatedAt: new Date()
          })
          .where(eq(users.id, user.id))
        
        console.log('✅ User found and reset token stored:', resetToken.substring(0, 8) + '...')
      } catch (updateError) {
        console.error('❌ Failed to store reset token:', updateError)
        return NextResponse.json(
          { error: 'Failed to process password reset request' },
          { status: 500 }
        )
      }
    }

    // Send the reset email (always send for security, even if user doesn't exist)
    const emailResult = await sendPasswordResetEmail(email, resetToken, 'user')

    if (!emailResult.success) {
      console.error('❌ Email sending failed:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send reset email: ' + emailResult.error },
        { status: 500 }
      )
    }

    console.log('✅ Password reset email sent successfully')

    return NextResponse.json({
      success: true,
      message: 'If this email exists in our system, you will receive a password reset link shortly.'
    })

  } catch (error) {
    console.error('❌ Password reset error:', error)
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
