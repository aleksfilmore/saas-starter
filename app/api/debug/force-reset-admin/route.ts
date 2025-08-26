import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { users } from '@/lib/db/actual-schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// EMERGENCY ADMIN PASSWORD RESET
// Bypasses token system to directly reset admin password
// SECURITY: Requires DEBUG_KEY. Remove this file after successful login.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key') || ''
  
  if (!process.env.DEBUG_KEY || key !== process.env.DEBUG_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const email = (body.email || 'system_admin@ctrlaltblock.com').toLowerCase()
    const newPassword = body.newPassword || 'TempPass123!'
    
    // Find user
    const userRows = await db.select().from(users).where(eq(users.email, email))
    if (!userRows.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const user = userRows[0]
    const newHash = await bcrypt.hash(newPassword, 12)
    
    // Direct password update (bypass token system)
    await db.update(users)
      .set({ 
        hashedPassword: newHash,
        updated_at: new Date(),
        // Clear any existing reset tokens
        reset_token: null,
        reset_token_expiry: null
      })
      .where(eq(users.id, user.id))
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      email,
      newPasswordPreview: newPassword.slice(0, 4) + '***',
      userId: user.id,
      instructions: 'Use this new password to login via /api/login or the simple-login debug route'
    })
    
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[force-reset-admin]', e)
    return NextResponse.json({ error: 'Internal error', detail: msg }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    message: 'POST to this endpoint with JSON body: {"email":"admin@example.com","newPassword":"YourNewPass123"}'
  })
}
