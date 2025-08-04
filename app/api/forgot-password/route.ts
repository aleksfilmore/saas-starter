import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // For development: simulate password reset
    const resetToken = Math.random().toString(36).substring(2, 15)
    
    return NextResponse.json({
      success: true,
      message: 'If that email exists, a password reset link has been sent.',
      debug: `Reset token for ${email}: ${resetToken}`
    })

  } catch (error) {
    console.error('Forgot password API error:', error)
    return NextResponse.json(
      { success: false, message: 'Network error. Please try again.' },
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
