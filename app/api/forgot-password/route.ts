import { NextRequest, NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '@/lib/email/email-service'
import { v4 as uuidv4 } from 'uuid'
import { neon } from '@neondatabase/serverless'

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

    // Direct database connection using Neon
    const sql = neon(process.env.POSTGRES_URL!)

    // Check if user exists in database - using actual column names
    let user
    try {
      const users = await sql`
        SELECT id, email, archetype FROM users WHERE email = ${email} LIMIT 1
      `
      user = users[0]
    } catch (dbError) {
      console.error('Database error checking user:', dbError)
      // Continue anyway for security (don't reveal if email exists)
    }

    // Generate a secure reset token
    const resetToken = uuidv4()

    // Note: Since database doesn't have reset token columns, we'll store the token temporarily
    // In a production system, you'd want to add these columns or use a separate tokens table
    // For now, we'll just log it and send the email

    if (user) {
      console.log('✅ User found, token generated:', resetToken)
      console.log('📝 Note: Reset token storage requires database migration for production use')
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
