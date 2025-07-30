// File: app/sign-up/actions.ts

'use server';

import { lucia } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { Argon2id } from 'oslo/password';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

// This interface defines the shape of the state object.
interface ActionResult {
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
    
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });
    console.log('Existing user check complete:', existingUser ? 'User exists' : 'No existing user');

    if (existingUser) {
      return { error: 'An account with this email already exists. Try signing in instead.', success: false };
    }

    console.log('Hashing password...');
    const hashedPassword = await new Argon2id().hash(password);
    console.log('Password hashed successfully');

    console.log('Inserting new user...');
    const [newUser] = await db.insert(users).values({
      email: email.toLowerCase(),
      hashedPassword: hashedPassword,
    }).returning({ id: users.id });
    console.log('New user created with ID:', newUser.id);

    console.log('Creating session...');
    const session = await lucia.createSession(newUser.id.toString(), {});
    console.log('Session created:', session.id);
    
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    console.log('Session cookie set');

  } catch (e) {
    console.error('Signup error:', e);
    return { error: 'An unknown error occurred.', success: false };
  }
  
  // On success, we redirect from the server.
  redirect('/dashboard');
}
