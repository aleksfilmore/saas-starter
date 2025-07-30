// Future-proof signup API route - Compatible with Next.js 15 and React 19
import { NextRequest, NextResponse } from 'next/server';

export interface SignupResponse {
  error: string | null;
  success: boolean;
  data?: {
    userId?: string;
    email?: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<SignupResponse>> {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const acceptTerms = formData.get('acceptTerms');
    const acceptPrivacy = formData.get('acceptPrivacy');

    // Comprehensive validation
    const validation = validateSignupData(email, password, acceptTerms, acceptPrivacy);
    if (!validation.valid) {
      return NextResponse.json({ 
        error: validation.error, 
        success: false 
      }, { status: 400 });
    }

    // TODO: Implement actual user creation logic
    // This is where you would:
    // 1. Hash the password
    // 2. Create user in database
    // 3. Create session
    // 4. Set authentication cookies
    
    console.log('Signup attempt for email:', email.toLowerCase());
    
    // Simulate successful registration for now
    return NextResponse.json({ 
      error: null, 
      success: true,
      data: {
        email: email.toLowerCase()
      }
    });

  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again.', 
      success: false 
    }, { status: 500 });
  }
}

// Helper function for validation
function validateSignupData(
  email: unknown, 
  password: unknown, 
  acceptTerms: unknown, 
  acceptPrivacy: unknown
) {
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
  
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  
  if (password.length > 50) {
    return { valid: false, error: 'Password must be no more than 50 characters long.' };
  }
  
  // Recommend strong password
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasUppercase || !hasNumber) {
    return { valid: false, error: 'Password should contain at least 1 uppercase letter and 1 number for better security.' };
  }

  // Terms validation
  if (!acceptTerms) {
    return { valid: false, error: 'You must agree to the Terms of Service to continue.' };
  }
  
  if (!acceptPrivacy) {
    return { valid: false, error: 'You must agree to the Privacy Policy to continue.' };
  }

  return { valid: true, error: null };
}
