// File: app/(dashboard)/security/actions.ts

'use server';

import { lucia, validateRequest } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { Argon2id } from 'oslo/password';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

// This is the fix: We export this interface so the page component can use it.
export interface ActionResult {
  error: string | null;
  success: string | null;
}

// This is the fix: The function signature is updated to match the hook.
export async function updatePassword(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const { user } = await validateRequest();
  if (!user) {
    return { error: 'Unauthorized', success: null };
  }

  const currentPassword = formData.get('currentPassword');
  const newPassword = formData.get('newPassword');
  const confirmPassword = formData.get('confirmPassword');

  if (
    typeof currentPassword !== 'string' ||
    typeof newPassword !== 'string' ||
    newPassword.length < 6
  ) {
    return { error: 'Invalid password provided.', success: null };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match.', success: null };
  }

  try {
    const dbUser = await db.query.users.findFirst({ where: eq(users.id, user.id) });
    if (!dbUser || !dbUser.hashedPassword) {
      return { error: 'User not found.', success: null };
    }

    const validPassword = await new Argon2id().verify(dbUser.hashedPassword, currentPassword);
    if (!validPassword) {
      return { error: 'Incorrect current password.', success: null };
    }

    const newHashedPassword = await new Argon2id().hash(newPassword);
    await db.update(users).set({ hashedPassword: newHashedPassword }).where(eq(users.id, user.id));

  } catch (e) {
    console.error(e);
    return { error: 'An unknown error occurred.', success: null };
  }

  return { error: null, success: 'Password updated successfully!' };
}

export async function deleteAccount(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
    const { user, session } = await validateRequest();
    if (!user || !session) {
        return { error: 'Unauthorized', success: null };
    }

    const password = formData.get('password');
    if (typeof password !== 'string') {
        return { error: 'Invalid password.', success: null };
    }

    try {
        const dbUser = await db.query.users.findFirst({ where: eq(users.id, user.id) });
        if (!dbUser || !dbUser.hashedPassword) {
            return { error: 'User not found.', success: null };
        }

        const validPassword = await new Argon2id().verify(dbUser.hashedPassword, password);
        if (!validPassword) {
            return { error: 'Incorrect password.', success: null };
        }

        await lucia.invalidateSession(session.id);
        await db.delete(users).where(eq(users.id, user.id));

        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    } catch (e) {
        console.error(e);
        return { error: 'An unknown error occurred.', success: null };
    }

    redirect('/');
}
