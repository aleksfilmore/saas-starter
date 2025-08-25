/**
 * Daily Ritual API - Get today's ritual assignments
 * GET /api/daily-rituals/today
 */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { dailyRitualService } from '@/lib/rituals/daily-ritual-service-drizzle';
import { validateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has paid subscription
    // This would typically check subscription status from the user record
    // For now, we'll assume all users can access this feature
    
    const result = await dailyRitualService.getTodaysRituals(user.id);
    
    return NextResponse.json({
      success: true,
      data: {
        assignments: result.assignments,
        rituals: result.rituals.map(ritual => ({
          ...ritual,
          assignmentId: result.assignments?.id
        })),
        userState: {
          streakDays: result.userState.streakDays,
          ritualsCompletedToday: result.userState.ritualsCompletedToday,
          dailyCapReached: result.userState.dailyCapReached,
          hasRerolledToday: result.userState.hasRerolledToday,
          totalWeeksActive: result.userState.totalWeeksActive
        },
        canReroll: result.canReroll
      }
    });
  } catch (error) {
    console.error('Error getting today\'s rituals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch today\'s rituals' },
      { status: 500 }
    );
  }
}
