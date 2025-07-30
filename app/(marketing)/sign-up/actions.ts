// File: app/sign-up/actions.ts

'use server';

import { lucia } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { eq, sql } from 'drizzle-orm';
import crypto from 'crypto';

// This interface defines the shape of the state object.
export interface ActionResult {
  error: string | null;
  success: boolean;
}

// This is the fix: The function's 'prevState' is now correctly typed to match
// the 'initialState' object from the page component.
export async function signup(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = formData.get('email');
  const password = formData.get('password');
  const acceptTerms = formData.get('acceptTerms');
  const acceptPrivacy = formData.get('acceptPrivacy');

  // Email validation
  if (typeof email !== 'string' || !email.includes('@')) {
    return { error: 'Please enter a valid email address.', success: false };
  }

  // Password validation
  if (typeof password !== 'string') {
    return { error: 'Password is required.', success: false };
  }
  
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.', success: false };
  }
  
  if (password.length > 50) {
    return { error: 'Password must be no more than 50 characters long.', success: false };
  }
  
  // Check for at least one uppercase letter and one number (recommended)
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasUppercase || !hasNumber) {
    return { error: 'Password should contain at least 1 uppercase letter and 1 number for better security.', success: false };
  }

  // Terms and Privacy validation
  if (!acceptTerms) {
    return { error: 'You must agree to the Terms of Service to continue.', success: false };
  }
  
  if (!acceptPrivacy) {
    return { error: 'You must agree to the Privacy Policy to continue.', success: false };
  }

  try {
    console.log('Signup attempt for email:', email.toLowerCase());
    console.log('Attempting to connect to database...');
    
    // Test basic database connection first
    const testConnection = await db.execute(sql`SELECT 1 as test`);
    console.log('Database connection test:', testConnection);
    
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });
    console.log('Existing user check complete:', existingUser ? 'User exists' : 'No existing user');

    if (existingUser) {
      return { error: 'An account with this email already exists. Try signing in instead.', success: false };
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    console.log('Inserting new user...');
    const userId = crypto.randomUUID(); // Generate UUID for user ID
    const [newUser] = await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      hashedPassword: hashedPassword,
      // Only use basic columns that exist in original schema
    }).returning({ id: users.id });
    console.log('New user created with ID:', newUser.id);

    console.log('Creating session...');
    console.log('New user ID:', newUser.id);
    console.log('New user ID type:', typeof newUser.id);
    const session = await lucia.createSession(newUser.id, {}); // No need to convert to string anymore
    console.log('Session created:', session.id);
    console.log('Session userId:', session.userId);
    console.log('Session userId type:', typeof session.userId);
    
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    console.log('Session cookie set');

    // Return success result instead of redirecting from server
    return { error: null, success: true };

  } catch (e) {
    console.error('Signup error:', e);
    return { error: 'An unknown error occurred.', success: false };
  }
}
