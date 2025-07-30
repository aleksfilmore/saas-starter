// Simple API route for login
import { NextRequest, NextResponse } from 'next/server';

export interface LoginResponse {
  error: string | null;
  success: boolean;
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email.', success: false });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.', success: false });
    }

    // Temporary: Just return success to test if the API route is working
    console.log('Login attempt for email:', email.toLowerCase());
    
    // TODO: Add actual authentication logic here
    // For now, simulate successful login
    return NextResponse.json({ error: null, success: true });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'An unknown error occurred.', success: false });
  }
}
