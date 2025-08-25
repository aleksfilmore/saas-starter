/**
 * Daily Ritual API - Reroll today's rituals
 * POST /api/daily-rituals/reroll
 */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { dailyRitualService } from '@/lib/rituals/daily-ritual-service-drizzle';
import { validateRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { user, session } = await validateRequest();
    
    if (!user || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Reroll today's rituals
    const result = await dailyRitualService.rerollTodaysRituals(user.id);

    if (!result.success) {
      return NextResponse.json({ 
        error: result.error || 'Failed to reroll rituals' 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        newRituals: result.newRituals
      }
    });
  } catch (error) {
    console.error('Error rerolling rituals:', error);
    return NextResponse.json(
      { error: 'Failed to reroll rituals' },
      { status: 500 }
    );
  }
}
