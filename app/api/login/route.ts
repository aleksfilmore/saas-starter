// Future-proof login API route - Compatible with Next.js 15 and React 19
import { NextRequest, NextResponse } from 'next/server';

export interface LoginResponse {
  error: string | null;
  success: boolean;
  data?: {
    userId?: string;
    email?: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Comprehensive validation
    const validation = validateLoginData(email, password);
    if (!validation.valid) {
      return NextResponse.json({ 
        error: validation.error, 
        success: false 
      }, { status: 400 });
    }

    // TODO: Implement actual authentication logic
    // This is where you would:
    // 1. Look up user by email
    // 2. Verify password hash
    // 3. Create session
    // 4. Set authentication cookies
    
    console.log('Login attempt for email:', email.toLowerCase());
    
    // Simulate successful login for now
    return NextResponse.json({ 
      error: null, 
      success: true,
      data: {
        email: email.toLowerCase()
      }
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again.', 
      success: false 
    }, { status: 500 });
  }
}

// Helper function for validation
function validateLoginData(email: unknown, password: unknown) {
  // Email validation
  if (typeof email !== 'string' || !email) {
    return { valid: false, error: 'Email is required.' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  // Password validation
  if (typeof password !== 'string' || !password) {
    return { valid: false, error: 'Password is required.' };
  }
  
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' };
  }

  return { valid: true, error: null };
}
