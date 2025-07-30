import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Temporary basic dashboard data (will be enhanced after migration)
    const dashboardData = {
      systemHealth: {
        totalUsers: 1,
        activeNoContactPeriods: 0,
        completedRituals: 0,
        wallPosts: 0,
        systemUptime: '99.9%'
      },
      userOverview: {
        newUsersToday: 0,
        newUsersThisWeek: 1,
        usersByTier: {
          anonymous: 1,
          verified: 0,
          premium: 0
        },
        topUsers: [
          {
            codename: 'TestAgent001',
            xpPoints: 0,
            tier: 'anonymous',
            lastActive: 'Today'
          }
        ]
      },
      contentModeration: {
        flaggedPosts: 0,
        reportedContent: 0,
        bannedUsers: 0
      }
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
