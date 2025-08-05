// Login API route - Direct database authentication
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface LoginResponse {
  error?: string | null;
  success: boolean;
  message?: string;
  token?: string;
  data?: {
    userId?: string;
    email?: string;
    role?: string;
    username?: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('🔧 Login attempt for:', email);

    // Find user in database
    const userResult = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    const user = userResult[0];

    if (!user) {
      console.log('❌ User not found:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordMatch) {
      console.log('❌ Invalid password for user:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last active timestamp
    await db.update(users)
      .set({ lastActiveAt: new Date() })
      .where(eq(users.id, user.id));

    console.log('✅ Login successful for:', email);

    // Generate session token (simplified for now)
    const token = uuidv4();

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.isAdmin ? 'admin' : 'user'
      }
    });

  } catch (error) {
    console.error('❌ Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
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
