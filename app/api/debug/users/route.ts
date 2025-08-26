// Secure debug route to verify critical users exist in the database.
// Requires X-Debug-Key header matching process.env.DEBUG_KEY.
// Returns minimal metadata (no sensitive fields) for specified emails.
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/actual-schema';
import { eq, inArray } from 'drizzle-orm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TARGET_EMAILS = [
  'system_admin@ctrlaltblock.com',
  'ghost@test.com',
  'firewall@test.com'
];

export async function GET(req: NextRequest) {
  try {
    const providedKey = req.headers.get('x-debug-key');
    if (!process.env.DEBUG_KEY || providedKey !== process.env.DEBUG_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await db.select({
      id: users.id,
      email: users.email,
      email_verified: users.email_verified,
      is_admin: users.is_admin,
      last_login: users.last_login,
      created_at: users.created_at
    }).from(users).where(inArray(users.email, TARGET_EMAILS));

    const summary = TARGET_EMAILS.map(email => {
      const u = rows.find(r => r.email.toLowerCase() === email);
      return u ? {
        email: u.email,
        present: true,
        is_admin: u.is_admin,
        email_verified: u.email_verified,
        created_at: u.created_at,
        last_login: u.last_login
      } : { email, present: false };
    });

    return NextResponse.json({ ok: true, users: summary, countPresent: rows.length });
  } catch (e) {
    console.error('Debug users route error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
