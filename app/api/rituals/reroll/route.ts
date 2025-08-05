import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, rituals } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { getRandomRitual } from '@/lib/prescribed-rituals'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has already rerolled today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const existingReroll = await db
      .select()
      .from(rituals)
      .where(
        sql`${rituals.userId} = ${userId} 
            AND ${rituals.isReroll} = true 
            AND ${rituals.createdAt} >= ${today}`
      )
      .limit(1)

    if (existingReroll.length > 0) {
      return NextResponse.json(
        { error: 'You can only reroll once per day' },
        { status: 429 }
      )
    }

    // Get user data for ritual personalization
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate new ritual
    const newRitual = getRandomRitual()
    
    // Create new ritual record
    const [createdRitual] = await db
      .insert(rituals)
      .values({
        id: crypto.randomUUID(),
        userId,
        title: newRitual.title,
        description: newRitual.description,
        category: newRitual.category,
        intensity: newRitual.intensity,
        duration: newRitual.duration,
        isReroll: true,
        isCompleted: false,
        createdAt: new Date()
      })
      .returning()

    console.log('✅ New ritual generated via reroll:', createdRitual)

    return NextResponse.json({
      success: true,
      ritual: createdRitual,
      message: 'New ritual generated! You can reroll again tomorrow.'
    })

  } catch (error) {
    console.error('❌ Ritual reroll error:', error)
    return NextResponse.json(
      { error: 'Failed to generate new ritual' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
