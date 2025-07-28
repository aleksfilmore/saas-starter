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

    if (existingUser) {
      return { error: 'A user with that email already exists.', success: false };
    }

    const hashedPassword = await new Argon2id().hash(password);
    const userId = crypto.randomUUID();

    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      hashedPassword: hashedPassword,
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  } catch (e) {
    console.error(e);
    return { error: 'An unknown error occurred.', success: false };
  }
  
  // On success, we now return a success flag.
  return { error: null, success: true };
}
