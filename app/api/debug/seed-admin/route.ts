import { NextRequest, NextResponse } from 'next/server'
import { db, client } from '@/lib/db/drizzle'
import { users } from '@/lib/db/actual-schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')
  const expected = process.env.DEBUG_KEY
  try {
    if (!expected || key !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json().catch(() => ({}))
    const email: string = (body.email || 'system_admin@ctrlaltblock.com').toLowerCase()
    const password: string = body.password || 'ChangeMeNow!123'
    const id = body.id || randomUUID()

    const existing = await db.select().from(users).where(eq(users.email, email))
    if (existing.length) {
      return NextResponse.json({ created: false, reason: 'exists', id: existing[0].id, email })
    }

    const hash = await bcrypt.hash(password, 12)
    // Try ORM insert first, fallback to raw SQL if it fails
    try {
      await db.insert(users).values({
        id,
        email,
        hashedPassword: hash,
        is_admin: true,
        subscription_tier: 'ghost_mode',
        bytes: 100,
        onboarding_completed: true
      } as any)
    } catch (ormErr) {
      console.warn('[seed-admin] ORM insert failed, attempting raw SQL', ormErr)
      try {
        await (client as any)`insert into users (id,email,password_hash,created_at,updated_at,is_admin,subscription_tier,bytes,onboarding_completed) values (${id}, ${email}, ${hash}, now(), now(), true, 'ghost_mode', 100, true)`
      } catch (rawErr) {
        throw rawErr
      }
    }

    return NextResponse.json({ created: true, id, email, passwordPreview: password.slice(0,3)+'***', hashPreview: hash.substring(0,7)+'...'+hash.slice(-4) })
  } catch (e) {
  const msg = e instanceof Error ? e.message : String(e)
  console.error('[debug/seed-admin] error', e)
  return NextResponse.json({ error: 'Internal error', detail: msg }, { status: 500 })
  }
}
