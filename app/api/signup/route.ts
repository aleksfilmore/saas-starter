// Signup API route - Database-backed authentication
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateId } from 'lucia';

export interface SignupResponse {
  error?: string | null;
  success: boolean;
  message?: string;
  data?: {
    userId?: string;
    email?: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<SignupResponse>> {
  try {
    const body = await request.json();
    const { email, password, acceptTerms, acceptPrivacy } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!acceptTerms || !acceptPrivacy) {
      return NextResponse.json(
        { success: false, message: 'You must agree to the Terms of Service and Privacy Policy' },
        { status: 400 }
      );
    }

    // Simple email validation
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // For development: simulate user creation
    const userId = generateId(15);
    const hashedPassword = await bcrypt.hash(password, 12);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        userId,
        email: email.toLowerCase()
      }
    });

  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { success: false, message: 'Network error. Please try again.' },
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
