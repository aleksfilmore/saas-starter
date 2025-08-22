import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data
    const [user] = await db
      .select({
        bytes: users.bytes,
        aiQuotaUsed: users.aiQuotaUsed,
        aiQuotaResetAt: users.aiQuotaResetAt
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate daily quota - base quota for all users
    const totalQuota = 5

    // Check if quota needs reset (daily reset at midnight)
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0) // Next midnight

    let quotaUsed = user.aiQuotaUsed || 0
    const resetAt = user.aiQuotaResetAt ? new Date(user.aiQuotaResetAt) : null

    // Reset quota if it's a new day
    if (!resetAt || now >= resetAt) {
      quotaUsed = 0
      
      // Update user record with reset
      await db
        .update(users)
        .set({
          aiQuotaUsed: 0,
          aiQuotaResetAt: midnight
        })
        .where(eq(users.id, userId))
    }

    const msgsLeft = Math.max(0, totalQuota - quotaUsed)

    return NextResponse.json({
      msgsLeft,
      totalQuota,
      quotaUsed,
      resetAt: midnight.toISOString(),
      canPurchaseMore: user.bytes >= 25, // 25 bytes for +20 messages
      purchaseCost: 25
    })

  } catch (error) {
    console.error('AI quota API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()

    if (action === 'purchase') {
      // Purchase additional messages with bytes
      const [user] = await db
        .select({
          bytes: users.bytes,
          aiQuotaUsed: users.aiQuotaUsed
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      if (user.bytes < 25) {
        return NextResponse.json(
          { error: 'Insufficient bytes. Need 25 bytes for +20 messages.' },
          { status: 400 }
        )
      }

      // Deduct bytes and add messages
      await db
        .update(users)
        .set({
          bytes: user.bytes - 25,
          aiQuotaUsed: Math.max(0, (user.aiQuotaUsed || 0) - 20) // Effectively adds 20 messages
        })
        .where(eq(users.id, userId))

      return NextResponse.json({
        success: true,
        message: '+20 AI therapy messages added!',
        bytesRemaining: user.bytes - 25
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('AI quota purchase error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
