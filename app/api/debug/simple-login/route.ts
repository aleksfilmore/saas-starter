import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { users } from '@/lib/db/actual-schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
// Debug login redirect now points to Auth0 hosted login; lucia shim not required here
import { cookies } from 'next/headers'

// TEMPORARY DEBUG ROUTE
// Allows GET login with query params for a non-technical admin while diagnosing prod auth.
// SECURITY: Requires DEBUG_KEY. Remove this file once login is confirmed working.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key') || ''
  if (!process.env.DEBUG_KEY || key !== process.env.DEBUG_KEY) {
    return NextResponse.json({ error: 'Unauthorized (debug key mismatch)' }, { status: 401 })
  }

  const emailRaw = url.searchParams.get('email') || ''
  const password = url.searchParams.get('password') || ''

  if (!emailRaw || !password) {
    return NextResponse.json({ error: 'Missing email or password query params' }, { status: 400 })
  }

  const email = emailRaw.toLowerCase()
  try {
    // Use more compatible query method for older Drizzle versions
    const allUsers = await db.select().from(users).where(eq(users.email, email))
    if (!allUsers.length) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }
    const user = allUsers[0]
    if (!(user as any).hashedPassword) {
      return NextResponse.json({ success: false, error: 'User missing password hash' }, { status: 500 })
    }
    const match = await bcrypt.compare(password, (user as any).hashedPassword)
    if (!match) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
    }
  // Redirect debug login attempts to Auth0 hosted login so that cookie/session handling is consistent.
  const redirectUrl = new URL('/api/auth/login', req.url);
  return NextResponse.redirect(redirectUrl, 303);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: 'Internal error', detail: msg }, { status: 500 })
  }
}
