import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { users } from '@/lib/db/actual-schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')
  const expected = process.env.DEBUG_KEY
  try {
    if (!expected || key !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const rows = await db.select().from(users)
    const sample = rows.slice(0, 5).map(r => ({ id: r.id, email: r.email, hasHash: !!(r as any).hashedPassword }))
    return NextResponse.json({ count: rows.length, sample })
  } catch (e) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
