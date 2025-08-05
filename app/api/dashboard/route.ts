import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, dailyCheckIns, rituals, anonymousPosts } from '@/lib/db/schema'
import { eq, sql, desc, count } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data with aggregated stats
    const [userResult] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        streak: users.streak,
        longestStreak: users.longestStreak,
        level: users.level,
        xp: users.xp,
        bytes: users.bytes,
        avatar: users.avatar,
        noContactDays: users.noContactDays,
        uxStage: users.uxStage,
        joinDate: users.createdAt,
        lastActive: users.lastActiveAt
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!userResult) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate next level XP (basic progression: level * 1000)
    const nextLevelXP = (userResult.level + 1) * 1000
    const progressToNext = (userResult.xp / nextLevelXP) * 100

    // Get today's ritual progress
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayRituals = await db
      .select({
        id: rituals.id,
        title: rituals.title,
        category: rituals.category,
        isCompleted: rituals.isCompleted,
        completedAt: rituals.completedAt
      })
      .from(rituals)
      .where(
        sql`${rituals.userId} = ${userId} AND ${rituals.createdAt} >= ${today}`
      )
      .orderBy(desc(rituals.createdAt))

    // Get feature gates based on user progress
    const featureGates = getFeatureGates(userResult.uxStage, userResult.level, userResult.noContactDays)

    // Get AI therapy quota (mock for now - would integrate with actual quota system)
    const aiQuota = {
      msgsLeft: Math.max(0, 20 - (userResult.level * 2)), // More messages as user progresses
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    // Get Wall post count for user
    const [wallCount] = await db
      .select({ count: count() })
      .from(anonymousPosts)
      .where(eq(anonymousPosts.userId, userId))

    return NextResponse.json({
      user: {
        ...userResult,
        progressToNext: Math.round(progressToNext),
        nextLevelXP,
        wallPosts: wallCount?.count || 0
      },
      todayRituals,
      featureGates,
      aiQuota,
      stats: {
        ritualsCompleted: todayRituals.filter(r => r.isCompleted).length,
        totalRituals: todayRituals.length,
        streakActive: userResult.streak > 0,
        canReroll: !todayRituals.some(r => r.completedAt && 
          new Date(r.completedAt).toDateString() === new Date().toDateString())
      }
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getFeatureGates(uxStage: string | null, level: number, noContactDays: number) {
  const gates = {
    noContactTracker: true, // Always available
    dailyLogs: level >= 1, // After first ritual
    aiTherapy: level >= 3 || noContactDays >= 3, // Day 3 or level 3
    wallRead: level >= 5 || noContactDays >= 5, // Day 5 or level 5
    wallPost: level >= 7 || noContactDays >= 7, // Day 7 or level 7
    progressAnalytics: level >= 14 || noContactDays >= 14 // Day 14 or level 14
  }

  // Override based on ux_stage if set
  if (uxStage === 'system_admin') {
    Object.keys(gates).forEach(key => {
      gates[key as keyof typeof gates] = true
    })
  }

  return gates
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
