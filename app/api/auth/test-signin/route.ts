import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Force Node.js runtime
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('Simple signin test started...');
    
    const body = await request.json();
    const { email } = body;

    console.log('Looking for user with email:', email);

    // Just try to find a user without password verification
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    console.log('Database query completed. Found users:', user.length);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found', email: email },
        { status: 404 }
      );
    }

    const foundUser = user[0];
    console.log('Found user:', { id: foundUser.id, email: foundUser.email });

    return NextResponse.json(
      { 
        success: true, 
        message: 'User found successfully',
        user: {
          id: foundUser.id,
          email: foundUser.email,
          hasPassword: !!foundUser.hashedPassword
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Simple signin test error:', error);
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
