import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { users } from '@/lib/db/actual-schema'
import { eq } from 'drizzle-orm'

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/*
  Secure debug endpoint to inspect a user's auth row in production.
  Usage: /api/debug/auth-user?email=user@example.com&key=YOUR_DEBUG_KEY
  Set DEBUG_KEY in environment. Responds with sanitized details (never full hash).
*/
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const email = url.searchParams.get('email')
  const key = url.searchParams.get('key')
  const verbose = url.searchParams.get('verbose') === '1'
  const expected = process.env.DEBUG_KEY

  try {
    if (!expected) {
      console.error('DEBUG_KEY not set in environment')
      return NextResponse.json({ error: 'Not configured' }, { status: 500 })
    }
    if (key !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const lower = email.toLowerCase()
    console.log('[debug/auth-user] lookup start', lower)
  const result = await db.select().from(users).where(eq(users.email, lower))
  console.log('[debug/auth-user] query complete count=', result.length)
  const user = result[0]
    if (!user) {
      return NextResponse.json({ found: false, email: lower })
    }
    const hash = (user as any).hashedPassword || ''
    const hashPreview = hash ? hash.substring(0, 7) + '...' + hash.slice(-4) : null

    const payload: Record<string, any> = {
      found: true,
      id: user.id,
      email: user.email,
      tier: (user as any).tier,
      bytes: (user as any).bytes,
      created_at: (user as any).created_at,
      updated_at: (user as any).updated_at,
      hasHash: !!hash,
      hashPreview,
      hashLength: hash?.length || 0,
    }
    if (verbose) {
      payload.schemaKeys = Object.keys(user as any)
    }
    return NextResponse.json(payload)
  } catch (err) {
    console.error('debug auth-user error', err)
    const message = err instanceof Error ? err.message : String(err)
    // Only reveal internal error if authorized (checked above) and verbose flag set
    if (key === expected && url.searchParams.get('verbose') === '1') {
      return NextResponse.json({ error: 'Internal error', detail: message }, { status: 500 })
    }
  return NextResponse.json({ error: 'Internal error', detail: message }, { status: 500 })
  }
}
