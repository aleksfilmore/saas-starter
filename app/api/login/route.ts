// Login API route - Direct database authentication with actual schema
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
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
    archetype?: string;
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

    // Direct database connection using Neon
    const sql = neon(process.env.POSTGRES_URL!);

    // Find user in database - using actual column names
    const users = await sql`
      SELECT id, email, password_hash, archetype 
      FROM users 
      WHERE email = ${email.toLowerCase()} 
      LIMIT 1
    `;

    const user = users[0];

    if (!user) {
      console.log('❌ User not found:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password using actual column name
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      console.log('❌ Invalid password for user:', email);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last_reroll_at since it's the only timestamp field we have
    await sql`
      UPDATE users 
      SET last_reroll_at = NOW() 
      WHERE id = ${user.id}
    `;

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
        archetype: user.archetype,
        role: email.includes('admin') ? 'admin' : 'user' // Simple admin detection
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
