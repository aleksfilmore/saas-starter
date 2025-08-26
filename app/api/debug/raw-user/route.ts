import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/db/drizzle'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')
  const email = url.searchParams.get('email')
  const expected = process.env.DEBUG_KEY
  if (!expected || key !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
  try {
    const rows = await (client as any)`select id, email, left(password_hash, 10) as hash_prefix, length(password_hash) as hash_length from users where lower(email) = lower(${email})`
    return NextResponse.json({ email, rows })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Internal error', detail: msg }, { status: 500 })
  }
}
