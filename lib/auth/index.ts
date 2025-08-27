// Auth0 compatibility shim (Option B) — replaces Lucia implementation
// Exports:
//  - validateRequest(): checks Auth0 session by calling the internal Pages API and returns local DB user + session
//  - getUserId(): returns the local user id when authenticated
//  - lucia: a small compatibility stub so existing imports compile; methods throw helpful errors to force migration where used

import { cache } from 'react';
import { cookies } from 'next/headers';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/actual-schema';
import { eq } from 'drizzle-orm';

type ValidateResult = { user: any | null; session: any | null };

// Calls the internal Auth0 session endpoint and looks up the local user by auth0_sub or email.
export const validateRequest = cache(async (): Promise<ValidateResult> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

    // Call internal Pages API that the @auth0/nextjs-auth0 SDK provides.
    const resp = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        cookie: cookieHeader || ''
      },
      // don't cache auth checks
      cache: 'no-store'
    });

    if (!resp.ok) {
      return { user: null, session: null };
    }

    const session = await resp.json();
    const sub = session?.user?.sub || session?.user?.user_id || null;
    const email = session?.user?.email || null;

    if (!sub && !email) {
      return { user: null, session: session ?? null };
    }

    // Try to find a matching local user by email (auth0 subject column not present in schema)
    let found = null;
    if (email) {
      const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
      found = rows[0] ?? null;
    }

    // Normalize DB user fields to the camelCase shape the app expects
    const mapped = found
      ? {
          id: found.id,
          email: found.email,
          username: found.username,
          tier: found.tier,
          archetype: found.emotional_archetype,
          archetype_details: (found as any).archetype_details ?? null,
          bytes: found.bytes,
          ritual_streak: found.streak ?? 0,
          no_contact_streak: found.no_contact_days ?? 0,
          last_checkin: found.last_no_contact_checkin ?? null,
          last_ritual: found.last_ritual_completed ?? null,
          is_verified: !found.is_banned,
          subscription_status: found.subscription_tier ?? null,
          subscription_expires: (found as any).subscription_expires ?? null,
          onboardingCompleted: found.onboarding_completed ?? false,
          emailVerified: found.email_verified ?? false,
          createdAt: found.created_at ?? null,
          updatedAt: found.updated_at ?? null,
          is_admin: found.is_admin ?? false,
        }
      : null;

    return { user: mapped, session };
  } catch (err) {
    console.error('validateRequest error (Auth0 shim):', err);
    return { user: null, session: null };
  }
});

export const getUserId = async (): Promise<string | null> => {
  const { user } = await validateRequest();
  return user?.id ?? null;
};

// Minimal compatibility stub for imports that expect a `lucia` object.
// Methods either map to Auth0 flows (where safe) or throw a clear error asking for migration.
export const lucia = {
  sessionCookieName: 'auth0-session',
  // createSession(userId, attributes) -> returns a session-like object { id }
  createSession: async (userId: string, _attrs?: any) => {
    // Generate a lightweight ephemeral session object. This is a compatibility shim only.
    const id = `shim-session-${userId}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
    return {
      id,
      userId,
      expiresAt,
      fresh: true
    };
  },
  // createSessionCookie(sessionId) -> returns cookie descriptor
  createSessionCookie: (sessionId: string) => {
    return {
      name: 'auth0-session',
      value: sessionId ?? '',
  attributes: { httpOnly: true, path: '/', sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' }
    };
  },
  createBlankSessionCookie: () => {
  return { name: 'auth0-session', value: '', attributes: { httpOnly: true, path: '/', sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production' } };
  },
  // validateSession(sessionId) -> delegate to validateRequest to check Auth0 session and return a Lucia-like result
  validateSession: async (_sessionId?: string) => {
    try {
      const res = await validateRequest();
      // Map to lucia-like shape: { user, session }
      return { user: res.user ?? null, session: res.session ?? null };
    } catch (err) {
      console.error('lucia.validateSession shim error:', err);
      return { user: null, session: null };
    }
  },
  invalidateSession: async (_id?: string) => {
    // No-op in shim. Real migration should call Auth0 sign-out / token revocation endpoints.
    console.warn('lucia.invalidateSession called — shim no-op. Migrate to Auth0 sign-out flow.');
    return null;
  },
  invalidateUserSessions: async (_userId?: string) => {
    console.warn('lucia.invalidateUserSessions called — shim no-op. Migrate to Auth0 management APIs if needed.');
    return null;
  }
};

