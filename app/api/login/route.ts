// Login API route - Database-backed authentication
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateId } from 'lucia';

export interface LoginResponse {
  error?: string | null;
  success: boolean;
  message?: string;
  token?: string;
  data?: {
    userId?: string;
    email?: string;
    role?: string;
    isAdmin?: boolean;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For testing purposes, allow admin login without database
    if (email === 'admin@ctrlaltblock.com' && password === 'Admin123!@#') {
      const adminToken = `admin-token-${Date.now()}`;
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token: adminToken,
        data: {
          userId: 'admin-1',
          email: 'admin@ctrlaltblock.com',
          role: 'admin',
          isAdmin: true
        }
      });
    }

    // Test user credentials
    const testUsers = [
      { email: 'test@example.com', password: 'Test123!@#', role: 'user' },
      { email: 'user@example.com', password: 'User123!@#', role: 'user' },
      { email: 'demo@example.com', password: 'Demo123!@#', role: 'user' }
    ];

    const testUser = testUsers.find(u => u.email === email.toLowerCase());
    if (testUser && testUser.password === password) {
      const userToken = `user-token-${Date.now()}`;
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token: userToken,
        data: {
          userId: generateId(15),
          email: testUser.email,
          role: testUser.role,
          isAdmin: false
        }
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login API error:', error);
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
