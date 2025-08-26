import { NextRequest, NextResponse } from 'next/server'
import { db, client } from '@/lib/db/drizzle'
import { users } from '@/lib/db/actual-schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// EMERGENCY: Direct SQL admin reset (bypasses ORM issues)
// SECURITY: Requires DEBUG_KEY. Remove after successful login.

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
    const newPassword = body.newPassword || 'DirectReset123!'
    
    // First, check what users exist with raw SQL
    const allUsers = await (client as any)`SELECT id, email, password_hash FROM users LIMIT 10`
    console.log('All users found:', allUsers.length)
    
    // Find user with raw SQL (more reliable than ORM)
    const userRows = await (client as any)`SELECT id, email, password_hash FROM users WHERE email = ${email}`
    
    if (!userRows.length) {
      // If still not found, try case-insensitive search
      const caseInsensitive = await (client as any)`SELECT id, email, password_hash FROM users WHERE LOWER(email) = ${email.toLowerCase()}`
      
      return NextResponse.json({ 
        error: 'User not found',
        debug: {
          searchEmail: email,
          totalUsers: allUsers.length,
          exactMatch: userRows.length,
          caseInsensitiveMatch: caseInsensitive.length,
          sampleEmails: allUsers.slice(0, 3).map((u: any) => u.email)
        }
      }, { status: 404 })
    }
    
    const user = userRows[0]
    const newHash = await bcrypt.hash(newPassword, 12)
    
    // Direct SQL update (most reliable)
    const updateResult = await (client as any)`
      UPDATE users 
      SET password_hash = ${newHash}, 
          updated_at = NOW(),
          reset_token = NULL,
          reset_token_expiry = NULL
      WHERE id = ${user.id}
      RETURNING id, email
    `
    
    return NextResponse.json({
      success: true,
      message: 'Password reset via direct SQL',
      email: user.email,
      userId: user.id,
      newPasswordPreview: newPassword.slice(0, 4) + '***',
      rowsUpdated: updateResult.length,
      instructions: 'Now try the simple-login debug route with this new password'
    })
    
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[direct-sql-reset]', e)
    return NextResponse.json({ error: 'Internal error', detail: msg }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key') || ''
  
  if (!process.env.DEBUG_KEY || key !== process.env.DEBUG_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Show what users exist
    const allUsers = await (client as any)`SELECT id, email, created_at FROM users ORDER BY created_at DESC LIMIT 10`
    
    return NextResponse.json({
      message: 'POST to reset password. Current users:',
      users: allUsers.map((u: any) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at
      }))
    })
  } catch (e) {
    return NextResponse.json({ error: 'Query failed', detail: e instanceof Error ? e.message : String(e) })
  }
}
