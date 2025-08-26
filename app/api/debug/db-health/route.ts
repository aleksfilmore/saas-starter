import { NextRequest, NextResponse } from 'next/server'
import { db, client } from '@/lib/db/drizzle'
import { users } from '@/lib/db/actual-schema'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key')
  const expected = process.env.DEBUG_KEY
  if (!expected || key !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const diagnostics: Record<string, any> = {}
  try {
    diagnostics.nodeEnv = process.env.NODE_ENV
    diagnostics.hasPostgresUrl = !!process.env.POSTGRES_URL
    diagnostics.hasDatabaseUrl = !!process.env.DATABASE_URL
    diagnostics.hasNetlifyDatabaseUrl = !!process.env.NETLIFY_DATABASE_URL
    diagnostics.usingBuildMock = !process.env.POSTGRES_URL && !process.env.DATABASE_URL && !process.env.NETLIFY_DATABASE_URL
    // Attempt ORM query
    let ormOk = false
    try {
      const rows = await db.select().from(users)
      diagnostics.ormSelectSucceeded = true
      diagnostics.ormRowCount = rows.length
      ormOk = true
    } catch (e) {
      diagnostics.ormError = e instanceof Error ? e.message : String(e)
    }
    // Attempt raw SQL (limit 3)
    try {
      const rawRows = await (client as any)`select id, email from users limit 3`
      diagnostics.rawSelectSucceeded = true
      diagnostics.rawSample = rawRows
    } catch (e) {
      diagnostics.rawError = e instanceof Error ? e.message : String(e)
    }
    // Summarize
    diagnostics.summary = ormOk ? 'ORM OK' : (diagnostics.rawSelectSucceeded ? 'ORM fail, raw OK' : 'Both fail')
    return NextResponse.json(diagnostics)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Internal error', detail: msg }, { status: 500 })
  }
}
