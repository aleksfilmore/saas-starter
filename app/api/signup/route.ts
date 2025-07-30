// Simple API route for signup
import { NextRequest, NextResponse } from 'next/server';

export interface SignupResponse {
  error: string | null;
  success: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse<SignupResponse>> {
  try {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const acceptTerms = formData.get('acceptTerms');
    const acceptPrivacy = formData.get('acceptPrivacy');

    // Email validation
    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.', success: false });
    }

    // Password validation
    if (typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required.', success: false });
    }
    
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.', success: false });
    }
    
    if (password.length > 50) {
      return NextResponse.json({ error: 'Password must be no more than 50 characters long.', success: false });
    }
    
    // Check for at least one uppercase letter and one number (recommended)
    const hasUppercase = password.match(/[A-Z]/) !== null;
    const hasNumber = password.match(/\d/) !== null;
    
    if (!hasUppercase || !hasNumber) {
      return NextResponse.json({ error: 'Password should contain at least 1 uppercase letter and 1 number for better security.', success: false });
    }

    // Terms and Privacy validation
    if (!acceptTerms) {
      return NextResponse.json({ error: 'You must agree to the Terms of Service to continue.', success: false });
    }
    
    if (!acceptPrivacy) {
      return NextResponse.json({ error: 'You must agree to the Privacy Policy to continue.', success: false });
    }

    // Temporary: Just return success to test if the API route is working
    console.log('Signup attempt for email:', email.toLowerCase());
    
    // TODO: Add actual user creation logic here
    // For now, simulate successful registration
    return NextResponse.json({ error: null, success: true });

  } catch (error) {
    console.error('Signup API error:', error);
    return NextResponse.json({ error: 'An unknown error occurred.', success: false });
  }
}
