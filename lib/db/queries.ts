// File: lib/db/queries.ts

import { eq } from 'drizzle-orm';
import { db } from './drizzle';
import { users } from './schema';
import { validateRequest } from '@/lib/auth';

export async function getUser() {
  const { user } = await validateRequest();
  if (!user) {
    return null;
  }

  const userFromDb = await db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  if (!userFromDb) {
    return null;
  }

  // This is the new, more explicit fix.
  // We are manually constructing a new plain object, property by property.
  // This is the most reliable way to strip all complex prototypes and ensure
  // the object is "plain" enough to be passed from Server to Client Components,
  // which will resolve the error.
  const plainUser = {
    id: userFromDb.id,
    email: userFromDb.email,
    // We explicitly exclude the hashedPassword here.
  };

  return plainUser;
}
