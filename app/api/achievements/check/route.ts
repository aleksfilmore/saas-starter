/**
 * Achievement Check API for CTRL+ALT+BLOCK
 * 
 * Triggers achievement checks after user activities
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { AchievementService } from '@/lib/shop/AchievementService';

export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { activity, data } = body;

    if (!activity) {
      return NextResponse.json({ error: 'Activity type required' }, { status: 400 });
    }

    // Check for new achievements based on activity
    const achievementResult = await AchievementService.checkAchievements(user.id, activity, data);

    return NextResponse.json({
      ...achievementResult,
      count: achievementResult.newAchievements
    });

  } catch (error) {
    console.error('Achievement check error:', error);
    return NextResponse.json(
      { error: 'Failed to check achievements' },
      { status: 500 }
    );
  }
}
