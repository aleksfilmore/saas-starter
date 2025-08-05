// File: lib/auth/index.ts

import { Lucia, Session, User as LuciaUser } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '@/lib/db/drizzle';
import { sessions, users, User as DbUser } from '@/lib/db/minimal-schema';
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

// Production-ready session validation
export const validateRequest = cache(
  async (): Promise<{ user: LuciaUser; session: Session } | { user: null; session: null }> => {
    try {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null;
      
      if (!sessionId) {
        return {
          user: null,
          session: null,
        };
      }

      const result = await lucia.validateSession(sessionId);
      
      // Next.js throws an error when you attempt to set a cookie when rendering a page
      try {
        if (result.session && result.session.fresh) {
          const sessionCookie = lucia.createSessionCookie(result.session.id);
          cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
        if (!result.session) {
          const sessionCookie = lucia.createBlankSessionCookie();
          cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
      } catch (error) {
        // Ignore cookie setting errors in read-only contexts
        console.log('Cookie setting ignored in read-only context');
      }
      
      return result;
    } catch (error) {
      console.error('Session validation error:', error);
      return {
        user: null,
        session: null,
      };
    }
  }
);

// Helper function to get user ID from session
export const getUserId = async (): Promise<string | null> => {
  const { user } = await validateRequest();
  return user?.id || null;
};

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
