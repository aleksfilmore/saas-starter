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

    // Import database and authentication
    const { db } = await import('@/lib/db/drizzle');
    const { users } = await import('@/lib/db/schema');
    const { eq } = await import('drizzle-orm');
    const bcrypt = await import('bcryptjs');
    const { lucia } = await import('@/lib/auth');
    
    // Find user by email with explicit column selection to avoid schema issues
    const userResult = await db.select({
      id: users.id,
      email: users.email,
      hashedPassword: users.hashedPassword
    }).from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    
    const user = userResult[0];
    
    if (!user || !user.hashedPassword) {
      return NextResponse.json({ 
        error: 'Invalid email or password.', 
        success: false 
      }, { status: 401 });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!validPassword) {
      return NextResponse.json({ 
        error: 'Invalid email or password.', 
        success: false 
      }, { status: 401 });
    }
    
    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    
    // Create response with session cookie
    const response = NextResponse.json({ 
      error: null, 
      success: true,
      data: {
        email: user.email
      }
    });
    
    response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    
    console.log('Login successful for:', user.email);
    return response;

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
  
  // Simple email validation
  if (!email.includes('@') || !email.includes('.')) {
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
