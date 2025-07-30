// File: lib/auth/index.ts

import { Lucia, Session, User as LuciaUser } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
// Switched to aliased paths for consistency and to prevent resolution errors.
import { db } from '@/lib/db/drizzle';
import { sessions, users, User as DbUser } from '@/lib/db/schema';
import { cookies } from 'next/headers';
import { cache } from 'react';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      // Use secure cookies in production
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
    };
  },
});

// This is a cached function to validate the user's session from server components.
export const validateRequest = cache(
  async (): Promise<{ user: LuciaUser; session: Session } | { user: null; session: null }> => {
    // This is the fix: We must now 'await' the cookies() function.
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    
    // Debug: Log the result of session validation
    console.log('Session validation result:', {
      session: result.session ? {
        id: result.session.id,
        userId: result.session.userId,
        userIdType: typeof result.session.userId
      } : null,
      user: result.user ? {
        id: result.user.id,
        idType: typeof result.user.id,
        email: result.user.email
      } : null
    });
    // Next.js throws an error when you attempt to set a cookie when rendering a page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        // This is the fix: We must now 'await' the cookies() function before setting.
        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        // This is the fix: We must now 'await' the cookies() function before setting.
        (await cookies()).set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
    } catch {}
    return result;
  }
);

// This declaration merges our custom user attributes with the default Lucia user type.
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
}
