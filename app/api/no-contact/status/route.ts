import { NextRequest, NextResponse } from 'next/server'
import { validateRequest } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { user: sessionUser } = await validateRequest()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1)

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userData[0]
    const now = new Date()
    
    let status = 'need_check'
    let hoursUntilNext = 0
    let canCheckIn = true
    
    if (user.lastNoContactCheckin) {
      const lastCheckin = new Date(user.lastNoContactCheckin)
      const hoursSinceCheckin = (now.getTime() - lastCheckin.getTime()) / (1000 * 60 * 60)
      
      if (hoursSinceCheckin < 24) {
        status = 'checked_in_today'
        canCheckIn = false
        hoursUntilNext = 24 - hoursSinceCheckin
      } else {
        status = 'need_check'
        canCheckIn = true
        hoursUntilNext = 0
      }
    }

    return NextResponse.json({
      success: true,
      status,
      canCheckIn,
      hoursUntilNext: Math.max(0, hoursUntilNext),
      currentStreak: user.noContactDays || 0,
      lastCheckinAt: user.lastNoContactCheckin?.toISOString() || null,
      nextCheckinAvailable: user.lastNoContactCheckin 
        ? new Date(new Date(user.lastNoContactCheckin).getTime() + 24 * 60 * 60 * 1000).toISOString()
        : now.toISOString()
    })

  } catch (error) {
    console.error('No-contact status API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
