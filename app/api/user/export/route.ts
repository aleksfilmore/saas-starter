import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get complete user data
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!userData.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const fullUser = userData[0];

    // Create comprehensive data export
    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        userId: user.id,
        exportType: 'complete_user_data',
        gdprCompliant: true
      },
      profile: {
        username: fullUser.username,
        email: fullUser.email,
        createdAt: fullUser.createdAt,
        updatedAt: fullUser.updatedAt,
        onboardingCompleted: fullUser.onboardingCompleted,
        subscriptionTier: fullUser.subscriptionTier,
        tier: fullUser.tier
      },
      progress: {
        bytes: fullUser.bytes,
        milestone: Math.floor((fullUser.bytes || 0)/1000) + 1,
        milestoneProgress: (fullUser.bytes || 0) % 1000,
        milestoneSize: 1000,
        streak: fullUser.streak,
        streakDays: fullUser.streakDays,
        longestStreak: fullUser.longestStreak,
        protocolDay: fullUser.protocolDay,
        noContactDays: fullUser.noContactDays
      },
      therapy: {
        therapyHistory: fullUser.therapyHistory ? JSON.parse(fullUser.therapyHistory) : [],
        aiQuotaUsed: fullUser.aiQuotaUsed
      },
      preferences: {
        dashboardType: fullUser.dashboardType
      },
      security: {
        lastActiveAt: fullUser.lastActiveAt,
        // Note: We don't export sensitive data like password hashes
        resetTokenExpiry: fullUser.resetTokenExpiry
      }
    };

    return NextResponse.json(exportData);

  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
