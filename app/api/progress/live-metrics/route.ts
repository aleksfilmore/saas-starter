/**
 * Live Metrics API Endpoint
 * Returns real-time progress metrics and analytics
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock live metrics - in production this would come from the enhanced progress service
const generateLiveMetrics = (userEmail: string) => {
  const mockMetrics = {
    current_streak: 12,
    today_completions: 1,
    week_completions: 6,
    month_completions: 25,
    completion_rate_7d: 85.7,
    completion_rate_30d: 83.3,
    average_mood_7d: 4.3,
    average_mood_30d: 4.1,
    streak_trend: 'increasing' as const,
    mood_trend: 'improving' as const,
    engagement_trend: 'stable' as const,
    streak_risk_level: 'low' as 'low' | 'medium' | 'high',
    predicted_next_completion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    improvement_velocity: 2.3,
    next_milestone: {
      type: 'streak' as const,
      description: 'Complete a 14-day streak',
      progress_percentage: 85.7,
      estimated_days: 2
    },
    percentile_rank: 78,
    archetype_average_comparison: 112
  };

  // Vary metrics based on time of day for realism
  const hour = new Date().getHours();
  if (hour < 12) {
    mockMetrics.streak_risk_level = 'medium';
    mockMetrics.today_completions = 0;
  }

  return mockMetrics;
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

    const liveMetrics = generateLiveMetrics(userEmail);

    return NextResponse.json(liveMetrics);
  } catch (error) {
    console.error('Live metrics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
