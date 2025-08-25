/**
 * Daily Guidance API Endpoint
 * Returns personalized guidance based on user archetype and progress
 */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

// Mock user archetype data - in production this would come from the database
const getUserArchetype = (userEmail: string) => {
  return {
    primary_archetype: 'Catalyst',
    secondary_archetype: 'Thriver', 
    archetype_details: {
      motivation_style: 'achievement-focused',
      communication_preference: 'direct',
      growth_pattern: 'incremental'
    },
    current_streak: 12,
    completion_pattern: 'consistent',
    recent_mood_trend: 'improving'
  };
};

// Mock guidance generation - in production this would use the daily guidance service
const generateDailyGuidance = (archetype: any) => {
  const hour = new Date().getHours();
  let phase: 'morning' | 'midday' | 'evening' | 'crisis';
  
  if (hour < 12) phase = 'morning';
  else if (hour < 18) phase = 'midday';
  else phase = 'evening';

  const guidance = {
    phase,
    message: '',
    action_suggestion: '',
    motivation_boost: '',
    archetype_insight: '',
    progress_acknowledgment: '',
    gentle_nudge: '',
    crisis_support: null as any
  };

  switch (phase) {
    case 'morning':
      guidance.message = `Good morning, ${archetype.primary_archetype}! Your 12-day streak shows incredible dedication.`;
      guidance.action_suggestion = 'Start with a 5-minute mindfulness ritual to set a positive tone for the day.';
      guidance.motivation_boost = 'As a Catalyst, you have the power to transform challenges into opportunities today.';
      guidance.archetype_insight = 'Your achievement-focused nature thrives on clear goals. Set one meaningful intention for today.';
      guidance.progress_acknowledgment = 'Your consistent completion pattern shows remarkable self-discipline.';
      break;

    case 'midday':
      guidance.message = `Midday check-in, ${archetype.primary_archetype}! How is your energy flowing?`;
      guidance.action_suggestion = 'Take a moment to do a quick breathing exercise or gratitude practice.';
      guidance.motivation_boost = 'You\'re building momentum with each conscious choice you make.';
      guidance.archetype_insight = 'Your direct communication style serves you well - be honest about what you need right now.';
      guidance.gentle_nudge = 'If you haven\'t completed today\'s ritual, now is a perfect time.';
      break;

    case 'evening':
      guidance.message = `Evening reflection time, ${archetype.primary_archetype}. How did today serve your growth?`;
      guidance.action_suggestion = 'Consider journaling about one insight or challenge from today.';
      guidance.motivation_boost = 'Your improving mood trend shows the positive impact of your commitment.';
      guidance.archetype_insight = 'Your incremental growth pattern is creating lasting change, one day at a time.';
      guidance.progress_acknowledgment = 'Completing rituals consistently for 12 days is a significant achievement.';
      break;
  }

  return guidance;
};

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email required' },
        { status: 401 }
      );
    }

    const userArchetype = getUserArchetype(userEmail);
    const dailyGuidance = generateDailyGuidance(userArchetype);

    return NextResponse.json({
      guidance: dailyGuidance,
      user_context: {
        archetype: userArchetype.primary_archetype,
        streak: userArchetype.current_streak,
        trend: userArchetype.recent_mood_trend
      }
    });
  } catch (error) {
    console.error('Daily guidance API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
