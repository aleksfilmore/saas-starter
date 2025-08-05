import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    // For now, let's get user data from localStorage/session 
    // In a real implementation, you'd get userId from session/JWT
    
    // Since we don't have a proper session system yet, we'll create mock data
    // based on the minimal database schema we actually have
    
    const sql = neon(process.env.POSTGRES_URL!)
    
    // Try to get user email from headers (sent by frontend)
    const userEmail = request.headers.get('x-user-email') || 'admin@ctrlaltblock.com'
    
    // Get basic user data from our minimal schema
    const users = await sql`
      SELECT id, email, archetype, last_reroll_at
      FROM users 
      WHERE email = ${userEmail} 
      LIMIT 1
    `
    
    const user = users[0]
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create mock data that matches what the dashboard expects
    // This is temporary until proper database migration is done
    const mockUserData = {
      id: user.id,
      username: user.email.split('@')[0], // Use email prefix as username
      email: user.email,
      level: 1, // Starting level
      xp: 100, // Starting XP
      nextLevelXP: 1000,
      progressToNext: 10, // 100/1000 * 100
      bytes: 50, // Starting currency
      streak: 1, // Starting streak
      longestStreak: 1,
      noContactDays: 1, // Starting no-contact days
      avatar: '🔥', // Default avatar
      uxStage: user.archetype || 'newcomer',
      wallPosts: 0,
      joinDate: new Date().toISOString(),
      lastActive: user.last_reroll_at || new Date().toISOString()
    }

    // Mock today's ritual
    const todayRituals = [
      {
        id: 'daily-ritual-1',
        title: 'Morning Mindfulness Check-in',
        description: 'Take 5 minutes to center yourself and set intentions for the day.',
        category: 'mindfulness',
        intensity: 2,
        duration: 5,
        isCompleted: false,
        completedAt: null
      }
    ]

    // Feature gates based on minimal progression
    const featureGates = {
      noContactTracker: true, // Always available
      dailyLogs: true, // Available for everyone
      aiTherapy: true, // Available for everyone for now
      wallRead: true, // Available for everyone
      wallPost: true, // Available for everyone
      progressAnalytics: true // Available for everyone
    }

    // Mock AI quota
    const aiQuota = {
      msgsLeft: 20,
      totalQuota: 20,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      canPurchaseMore: true,
      purchaseCost: 10
    }

    return NextResponse.json({
      user: mockUserData,
      todayRituals,
      featureGates,
      aiQuota,
      stats: {
        ritualsCompleted: 0,
        totalRituals: 1,
        streakActive: true,
        canReroll: true
      }
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
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
