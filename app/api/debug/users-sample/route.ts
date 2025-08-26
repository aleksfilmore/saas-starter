import { NextRequest, NextResponse } from 'next/server'
import { db, client } from '@/lib/db/drizzle'
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
    // Avoid .slice() method issues in production
    const allUsers = rows || []
    const sample = allUsers.length > 5 ? allUsers.slice(0, 5) : allUsers
    const sampleData = sample.map(r => ({ id: r.id, email: r.email, hasHash: !!(r as any).hashedPassword }))
    return NextResponse.json({ count: allUsers.length, sample: sampleData })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[debug/users-sample] error', e)
    return NextResponse.json({ error: 'Internal error', detail: msg }, { status: 500 })
  }
}
