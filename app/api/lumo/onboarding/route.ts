import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/unified-schema';
import { eq } from 'drizzle-orm';

// GET /api/lumo/onboarding - Get user's Lumo onboarding state
export async function GET(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Check user's onboarding state
    // This would typically be stored in user preferences or a dedicated table
    const onboardingState = {
      hasSeenOnboarding: false, // TODO: user.onboardingCompleted || false,
      lastLumoShow: null, // Would be stored in user metadata
      isFirstTimeUser: true, // TODO: !user.onboardingCompleted,
      lumoPersona: 'core', // Default persona
      quotaLeft: user.tier === 'firewall' ? -1 : 5, // Unlimited for paid users
      tier: user.tier || 'ghost',
      dismissedAt: null
    };

    return NextResponse.json({
      success: true,
      data: onboardingState
    });

  } catch (error) {
    console.error('Lumo onboarding state API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve onboarding state' },
      { status: 500 }
    );
  }
}

// POST /api/lumo/onboarding - Update user's Lumo onboarding state
export async function POST(request: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'dismiss':
        // Mark onboarding as completed
        await db.update(users)
          .set({
            onboardingCompleted: true
          })
          .where(eq(users.id, user.id));
        break;

      case 'complete':
        // Mark full onboarding as completed
        await db.update(users)
          .set({
            onboardingCompleted: true
          })
          .where(eq(users.id, user.id));
        break;

      case 'set_persona':
        // Store preferred Lumo persona (would need a user preferences table)
        // For now, just acknowledge the request
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding state updated successfully'
    });

  } catch (error) {
    console.error('Lumo onboarding update API error:', error);
    return NextResponse.json(
      { error: 'Failed to update onboarding state' },
      { status: 500 }
    );
  }
}
