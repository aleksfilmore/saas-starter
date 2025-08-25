import { NextRequest, NextResponse } from 'next/server';
import { lucia } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
// Use the same users table source as auth (actual-schema) to match field names
import { users } from '@/lib/db/actual-schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// Force Node.js runtime for database operations
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {

    try {
      console.log('Signin API called...');
      
      const body = await request.json();
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
      }

      console.log('Signin attempt for email:', email);

      // Find user
      console.log('Querying database...');
      const user = await db
        .select({
          id: users.id,
          email: users.email,
          hashedPassword: users.hashedPassword,
        })
        .from(users)
  .where(eq(users.email, email.toLowerCase()))
        .limit(1);

      console.log('Database query complete. Found users:', user.length);

      if (user.length === 0) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 400 }
        );
      }

      const existingUser = user[0];
      console.log('User found:', existingUser.id);

      // Verify password with bcrypt
      console.log('Verifying password...');
      const validPassword = await bcrypt.compare(password, existingUser.hashedPassword);
      
      if (!validPassword) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 400 }
        );
      }

      console.log('Password verified successfully');

      // Create session
      console.log('Creating session...');
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      const cookieStore = await cookies();
      
      // Enhanced cookie setting for production
      const cookieOptions = {
        ...sessionCookie.attributes,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      };
      
      cookieStore.set(sessionCookie.name, sessionCookie.value, cookieOptions);

      console.log('Login successful for user:', existingUser.id, 'Cookie set:', sessionCookie.name);

      return NextResponse.json(
        { 
          success: true, 
          message: 'Logged in successfully',
          user: {
            id: existingUser.id,
            email: existingUser.email,
          }
        },
        { status: 200 }
      );

    } catch (error) {
      console.error('Sign-in error:', error);
      return NextResponse.json(
        { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown' },
        { status: 500 }
      );
    }
}
