// File: app/sign-in/actions.ts

'use server';

import { lucia } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';

// This is the fix: We now export this interface so other files can use it.
export interface ActionResult {
  error: string | null;
  success: boolean;
}

export async function login(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || !email.includes('@')) {
    return { error: 'Please enter a valid email.', success: false };
  }
  if (typeof password !== 'string' || password.length < 6) {
    return { error: 'Password must be at least 6 characters long.', success: false };
  }

  try {
    console.log('Login attempt for email:', email.toLowerCase());
    
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });
    console.log('User lookup complete:', existingUser ? 'User found' : 'No user found');

    if (!existingUser || !existingUser.hashedPassword) {
      return { error: 'Incorrect email or password.', success: false };
    }

    console.log('Verifying password...');
    const validPassword = await bcrypt.compare(password, existingUser.hashedPassword);
    console.log('Password verification:', validPassword ? 'Valid' : 'Invalid');
    
    if (!validPassword) {
      return { error: 'Incorrect email or password.', success: false };
    }

    console.log('Creating session for user ID:', existingUser.id);
    console.log('User ID type:', typeof existingUser.id);
    const session = await lucia.createSession(existingUser.id, {}); // No need to convert to string anymore
    console.log('Session created:', session.id);
    console.log('Session userId:', session.userId);
    console.log('Session userId type:', typeof session.userId);
    
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    console.log('Session cookie set');

    // Return success result instead of redirecting from server
    return { error: null, success: true };

  } catch (e) {
    console.error('Login error:', e);
    return { error: 'An unknown error occurred.', success: false };
  }
}
