import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { users } from '@/lib/db/minimal-schema'
import { eq } from 'drizzle-orm'
import { resetTokenStore } from '@/lib/auth/reset-tokens'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    // Validation
    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Token and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Validate password complexity
    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasLowerCase = /[a-z]/.test(newPassword)
    const hasNumbers = /\d/.test(newPassword)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return NextResponse.json(
        { success: false, error: 'Password must contain at least one uppercase letter, lowercase letter, and number' },
        { status: 400 }
      )
    }

    // Check if token exists and is valid
    const tokenData = resetTokenStore.get(token)
    if (!tokenData) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Find user in database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, tokenData.email))
      .limit(1)

    if (existingUser.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user password in database
    await db
      .update(users)
      .set({ 
        hashedPassword: hashedPassword
      })
      .where(eq(users.email, tokenData.email))

    // Remove the used token
    resetTokenStore.delete(token)

    console.log(`Password reset successful for: ${tokenData.email}`)
    
    return NextResponse.json({
      success: true,
      message: 'Your password has been reset successfully'
    })

  } catch (error) {
    console.error('Reset password API error:', error)
    return NextResponse.json(
      { success: false, error: 'Network error. Please try again.' },
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
