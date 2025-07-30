// User Stats and Gamification API
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { getUserStats, getWeeklyWallOracles } from '@/lib/db/gamification';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'stats';

    switch (endpoint) {
      case 'stats':
        const userStats = await getUserStats(user.id);
        if (!userStats) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(userStats);

      case 'oracles':
        const weeklyOracles = await getWeeklyWallOracles();
        return NextResponse.json({ oracles: weeklyOracles });

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

  } catch (error) {
    console.error('User stats API error:', error);
    return NextResponse.json({ 
      error: 'Failed to load user data' 
    }, { status: 500 });
  }
}
