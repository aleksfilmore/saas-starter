import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { users } from '@/lib/db/actual-schema'
import { eq, sql } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

// EMERGENCY: Simple ORM-based admin reset with extensive debugging
// SECURITY: Requires DEBUG_KEY. Remove after successful login.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key') || ''
  
  if (!process.env.DEBUG_KEY || key !== process.env.DEBUG_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // List all users to see what's actually in the database
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      tier: users.tier,
      created_at: users.created_at
    }).from(users).limit(10)
    
    return NextResponse.json({
      message: 'Current users in database:',
      totalFound: allUsers.length,
      users: allUsers,
      note: 'POST to this endpoint with {"email":"...","newPassword":"..."} to reset'
    })
  } catch (e) {
    return NextResponse.json({ 
      error: 'Database query failed', 
      detail: e instanceof Error ? e.message : String(e) 
    }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url)
  const key = url.searchParams.get('key') || ''
  
  if (!process.env.DEBUG_KEY || key !== process.env.DEBUG_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const email = (body.email || 'system_admin@ctrlaltblock.com').toLowerCase().trim()
    const newPassword = body.newPassword || 'OrmReset123!'
    
    console.log('🔍 Looking for user with email:', email)
    
    // First, let's see ALL users to debug
    const allUsers = await db.select({
      id: users.id,
      email: users.email
    }).from(users)
    
    console.log('📊 Total users in DB:', allUsers.length)
    console.log('📧 All emails:', allUsers.map(u => u.email))
    
    // Try to find the specific user
    const userRows = await db.select()
      .from(users)
      .where(eq(users.email, email))
    
    console.log('🎯 Users found for', email, ':', userRows.length)
    
    if (!userRows.length) {
      // Try case-insensitive search
      const caseInsensitiveRows = await db.select()
        .from(users)
        .where(sql`LOWER(${users.email}) = LOWER(${email})`)
      
      return NextResponse.json({ 
        error: 'User not found',
        debug: {
          searchEmail: email,
          totalUsers: allUsers.length,
          exactMatches: userRows.length,
          caseInsensitiveMatches: caseInsensitiveRows.length,
          allEmails: allUsers.map(u => u.email),
          suggestion: allUsers.length > 0 ? `Try email: ${allUsers[0].email}` : 'No users exist'
        }
      }, { status: 404 })
    }
    
    const user = userRows[0]
    console.log('✅ Found user:', user.id, user.email)
    
    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 12)
    console.log('🔐 Password hashed, length:', newHash.length)
    
    // Update password
    const updateResult = await db.update(users)
      .set({ 
        hashedPassword: newHash,
        updated_at: new Date(),
        reset_token: null,
        reset_token_expiry: null
      })
      .where(eq(users.id, user.id))
      .returning({ id: users.id, email: users.email })
    
    console.log('💾 Update result:', updateResult.length, 'rows affected')
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
      user: {
        id: user.id,
        email: user.email
      },
      newPasswordPreview: newPassword.slice(0, 4) + '***',
      updateCount: updateResult.length,
      nextStep: 'Use simple-login debug route with new password'
    })
    
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[simple-reset] Error:', e)
    return NextResponse.json({ 
      error: 'Reset failed', 
      detail: msg,
      stack: e instanceof Error ? e.stack?.split('\n').slice(0, 3) : undefined
    }, { status: 500 })
  }
}
