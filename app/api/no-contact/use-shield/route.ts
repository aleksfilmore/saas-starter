import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, noContactPeriods } from '@/lib/db/unified-schema'
import { eq, sql, desc } from 'drizzle-orm'

export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's current streak and shield usage
    const [user] = await db
      .select({
        streak: users.streak,
        noContactDays: users.noContactDays
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has enough streak to use shield (require 7+ days)
    if (user.streak < 7) {
      return NextResponse.json(
        { error: 'You need a 7-day streak to use streak shields' },
        { status: 400 }
      )
    }

    // Get current no-contact period
    const [currentPeriod] = await db
      .select()
      .from(noContactPeriods)
      .where(eq(noContactPeriods.userId, userId))
      .orderBy(desc(noContactPeriods.createdAt))
      .limit(1)

    if (!currentPeriod) {
      return NextResponse.json(
        { error: 'No active no-contact period found' },
        { status: 404 }
      )
    }

    // Check weekly shield limit (max 2 per week)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const [shieldCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(noContactPeriods)
      .where(
        sql`${noContactPeriods.userId} = ${userId} 
            AND ${noContactPeriods.streakShieldsUsed} > 0 
            AND ${noContactPeriods.createdAt} >= ${oneWeekAgo}`
      )

    if (currentPeriod.streakShieldsUsed >= currentPeriod.maxStreakShieldsPerWeek) {
      return NextResponse.json(
        { error: 'You have reached the weekly limit of streak shields (2 per week)' },
        { status: 429 }
      )
    }

    // Use the shield - increment shield usage and maintain streak
    await db
      .update(noContactPeriods)
      .set({
        streakShieldsUsed: currentPeriod.streakShieldsUsed + 1,
        updatedAt: new Date()
      })
      .where(eq(noContactPeriods.id, currentPeriod.id))

    console.log('✅ Streak shield used successfully')

    return NextResponse.json({
      success: true,
      message: 'Streak shield activated! Your streak is protected.',
      shieldsRemaining: currentPeriod.maxStreakShieldsPerWeek - (currentPeriod.streakShieldsUsed + 1),
      cooldownUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    })

  } catch (error) {
    console.error('❌ Shield usage error:', error)
    return NextResponse.json(
      { error: 'Failed to use streak shield' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
