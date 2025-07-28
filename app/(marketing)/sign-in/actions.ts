// File: app/sign-in/actions.ts

'use server';

import { lucia } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { Argon2id } from 'oslo/password';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

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
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!existingUser || !existingUser.hashedPassword) {
      return { error: 'Incorrect email or password.', success: false };
    }

    const validPassword = await new Argon2id().verify(existingUser.hashedPassword, password);
    if (!validPassword) {
      return { error: 'Incorrect email or password.', success: false };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  } catch (e) {
    console.error(e);
    return { error: 'An unknown error occurred.', success: false };
  }
  
  // On success, we redirect from the server.
  redirect('/dashboard');
}
