/**
 * Daily Check-in API
 * 
 * Allows users to perform daily check-ins and earn Bytes for consistency.
 * This is a key part of the Byte Economy earning system.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { ByteService } from '@/lib/shop/ByteService';
import { db } from '@/lib/db';
import { eq, and, gte, sql } from 'drizzle-orm';
import { users, userByteHistory } from '@/lib/db/schema';

interface CheckInData {
  mood?: number; // 1-10 scale
  notes?: string;
  gratitude?: string[];
  intention?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CheckInData = await request.json();
    const { mood, notes, gratitude, intention } = body;

    // Validate mood if provided
    if (mood && (mood < 1 || mood > 10)) {
      return NextResponse.json(
        { error: 'Mood must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Check if user has already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await db
      .select()
      .from(userByteHistory)
      .where(
        and(
          eq(userByteHistory.userId, user.id),
          eq(userByteHistory.activityType, 'daily_checkin'),
          gte(userByteHistory.createdAt, today)
        )
      )
      .limit(1);

    if (existingCheckIn.length > 0) {
      return NextResponse.json(
        { 
          error: 'Already checked in today',
          message: 'You have already completed your daily check-in. Come back tomorrow!'
        },
        { status: 400 }
      );
    }

    // Award bytes for daily check-in
    const byteService = new ByteService(user.id);
    let bytesAwarded = 0;
    
    try {
      const byteTransaction = await byteService.awardBytes(
        10, // Daily check-in reward (from BYTE_EARNING_ACTIVITIES)
        'daily_checkin',
        'Daily check-in completed',
        { 
          mood, 
          notes: notes?.substring(0, 100), // Truncate for metadata
          gratitudeCount: gratitude?.length || 0,
          hasIntention: !!intention
        }
      );
      
      if (byteTransaction) {
        bytesAwarded = byteTransaction.byteChange;
        console.log(`💰 Awarded ${bytesAwarded} Bytes for daily check-in`);
      }
    } catch (byteError) {
      console.error('Failed to award bytes for check-in:', byteError);
      return NextResponse.json(
        { error: 'Failed to process check-in rewards' },
        { status: 500 }
      );
    }

    // Update user's last check-in date
    await db
      .update(users)
      .set({ 
        lastActiveAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    // Check for consecutive check-in streaks
    let streakDays = 0;
    let streakBonus = 0;
    
    try {
      // Get check-in history to calculate streak
      const checkInHistory = await db
        .select()
        .from(userByteHistory)
        .where(
          and(
            eq(userByteHistory.userId, user.id),
            eq(userByteHistory.activityType, 'daily_checkin')
          )
        )
        .orderBy(sql`${userByteHistory.createdAt} DESC`)
        .limit(30); // Look at last 30 days

      // Calculate consecutive days (simplified version)
      const dates = checkInHistory.map(h => h.createdAt.toDateString());
      const uniqueDates = [...new Set(dates)];
      
      // Count consecutive days from today backwards
      let currentDate = new Date();
      let consecutiveDays = 1; // Include today
      
      for (let i = 1; i < 30; i++) {
        currentDate.setDate(currentDate.getDate() - 1);
        const dateString = currentDate.toDateString();
        
        if (uniqueDates.includes(dateString)) {
          consecutiveDays++;
        } else {
          break;
        }
      }
      
      streakDays = consecutiveDays;

      // Award streak bonuses at milestones
      if (consecutiveDays === 7) {
        const streakTransaction = await byteService.awardStreakBonus(consecutiveDays, 'daily_checkin');
        if (streakTransaction) {
          streakBonus = streakTransaction.bonusBytes;
          bytesAwarded += streakBonus;
          console.log(`🔥 7-day check-in streak bonus: ${streakBonus} Bytes`);
        }
      } else if (consecutiveDays === 30) {
        const streakTransaction = await byteService.awardStreakBonus(consecutiveDays, 'daily_checkin');
        if (streakTransaction) {
          streakBonus = streakTransaction.bonusBytes;
          bytesAwarded += streakBonus;
          console.log(`🔥 30-day check-in streak bonus: ${streakBonus} Bytes`);
        }
      }
      
    } catch (streakError) {
      console.warn('⚠️ Streak calculation failed (non-blocking):', streakError);
    }

    console.log('✅ Daily check-in completed:', user.id, 'Bytes:', bytesAwarded);

    return NextResponse.json({
      success: true,
      message: streakBonus > 0 
        ? `Check-in complete! Streak bonus earned!`
        : 'Daily check-in completed successfully',
      checkIn: {
        date: new Date().toISOString(),
        mood,
        notes,
        gratitude,
        intention
      },
      rewards: {
        bytes: bytesAwarded,
        streakBonus,
        streakDays
      },
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Error processing daily check-in:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process check-in',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if user has checked in today
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await db
      .select()
      .from(userByteHistory)
      .where(
        and(
          eq(userByteHistory.userId, user.id),
          eq(userByteHistory.activityType, 'daily_checkin'),
          gte(userByteHistory.createdAt, today)
        )
      )
      .limit(1);

    const hasCheckedIn = existingCheckIn.length > 0;

    return NextResponse.json({
      hasCheckedIn,
      lastCheckIn: existingCheckIn[0]?.createdAt?.toISOString() || null,
      canCheckIn: !hasCheckedIn
    });

  } catch (error) {
    console.error('❌ Error checking daily check-in status:', error);
    return NextResponse.json(
      { error: 'Failed to check status' },
      { status: 500 }
    );
  }
}
