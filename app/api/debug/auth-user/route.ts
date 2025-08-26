import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/actual-schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/*
  Secure debug endpoint to inspect a user's auth row in production.
  Usage: /api/debug/auth-user?email=user@example.com&key=YOUR_DEBUG_KEY
  Set DEBUG_KEY in environment. Responds with sanitized details (never full hash).
*/
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const key = url.searchParams.get('key');
    const expected = process.env.DEBUG_KEY;

    if (!expected || key !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const lower = email.toLowerCase();
    const result = await db.select().from(users).where(eq(users.email, lower)).limit(1);
    const user = result[0];
    if (!user) {
      return NextResponse.json({ found: false });
    }

    const hash = user.hashedPassword || '';
    const hashPreview = hash ? hash.substring(0, 7) + '...' + hash.slice(-4) : null;

    return NextResponse.json({
      found: true,
      id: user.id,
      email: user.email,
      tier: (user as any).tier,
      bytes: (user as any).bytes,
      created_at: (user as any).created_at,
      hasHash: !!hash,
      hashPreview,
      hashLength: hash?.length || 0,
      updated_at: (user as any).updated_at,
    });
  } catch (err) {
    console.error('debug auth-user error', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
