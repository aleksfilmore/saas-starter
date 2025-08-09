/**
 * FUP Enforcement API Endpoint
 * Returns current usage status and enforcement information
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock user tier and usage data - in production this would come from the database
const getUserUsageStatus = (userEmail: string) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return {
    tier: 'premium',
    daily_usage: {
      ritual_completions: 2,
      ai_therapy_sessions: 1,
      journal_entries: 1,
      voice_messages: 0
    },
    daily_limits: {
      ritual_completions: 10,
      ai_therapy_sessions: 5,
      journal_entries: 20,
      voice_messages: 3
    },
    monthly_usage: {
      ritual_completions: 45,
      ai_therapy_sessions: 12,
      journal_entries: 38,
      voice_messages: 8
    },
    monthly_limits: {
      ritual_completions: 300,
      ai_therapy_sessions: 150,
      journal_entries: 600,
      voice_messages: 90
    },
    violations: [],
    anti_gaming_flags: [],
    enforcement_level: 'none' as const,
    next_reset: {
      daily: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000).toISOString(),
      monthly: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString()
    }
  };
};

// Calculate usage percentages and warnings
const calculateUsageMetrics = (usage: any) => {
  const dailyPercentages = {
    ritual_completions: (usage.daily_usage.ritual_completions / usage.daily_limits.ritual_completions) * 100,
    ai_therapy_sessions: (usage.daily_usage.ai_therapy_sessions / usage.daily_limits.ai_therapy_sessions) * 100,
    journal_entries: (usage.daily_usage.journal_entries / usage.daily_limits.journal_entries) * 100,
    voice_messages: (usage.daily_usage.voice_messages / usage.daily_limits.voice_messages) * 100
  };

  const monthlyPercentages = {
    ritual_completions: (usage.monthly_usage.ritual_completions / usage.monthly_limits.ritual_completions) * 100,
    ai_therapy_sessions: (usage.monthly_usage.ai_therapy_sessions / usage.monthly_limits.ai_therapy_sessions) * 100,
    journal_entries: (usage.monthly_usage.journal_entries / usage.monthly_limits.journal_entries) * 100,
    voice_messages: (usage.monthly_usage.voice_messages / usage.monthly_limits.voice_messages) * 100
  };

  const warnings: Array<{
    type: string;
    feature: string;
    percentage: number;
    message: string;
  }> = [];
  
  // Check for approaching limits
  Object.entries(dailyPercentages).forEach(([key, percentage]) => {
    if (percentage >= 80) {
      warnings.push({
        type: 'daily_limit_warning',
        feature: key,
        percentage,
        message: `You're approaching your daily limit for ${key.replace('_', ' ')}`
      });
    }
  });

  Object.entries(monthlyPercentages).forEach(([key, percentage]) => {
    if (percentage >= 90) {
      warnings.push({
        type: 'monthly_limit_warning',
        feature: key,
        percentage,
        message: `You're approaching your monthly limit for ${key.replace('_', ' ')}`
      });
    }
  });

  return {
    daily_percentages: dailyPercentages,
    monthly_percentages: monthlyPercentages,
    warnings,
    overall_health: warnings.length === 0 ? 'healthy' : warnings.length < 3 ? 'cautious' : 'concerning'
  };
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

    const usageStatus = getUserUsageStatus(userEmail);
    const usageMetrics = calculateUsageMetrics(usageStatus);

    return NextResponse.json({
      tier: usageStatus.tier,
      usage: {
        daily: usageStatus.daily_usage,
        monthly: usageStatus.monthly_usage
      },
      limits: {
        daily: usageStatus.daily_limits,
        monthly: usageStatus.monthly_limits
      },
      metrics: usageMetrics,
      enforcement: {
        level: usageStatus.enforcement_level,
        violations: usageStatus.violations,
        anti_gaming_flags: usageStatus.anti_gaming_flags
      },
      next_reset: usageStatus.next_reset
    });
  } catch (error) {
    console.error('FUP enforcement API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint for checking action permission
export async function POST(request: NextRequest) {
  try {
    const userEmail = request.headers.get('x-user-email');
    const { action, context } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email required' },
        { status: 401 }
      );
    }

    const usageStatus = getUserUsageStatus(userEmail);
    
    // Check if action is allowed
    let allowed = true;
    let reason = '';
    let enforcement_action = 'none';

    // Simple enforcement logic - in production this would use the FUP service
    switch (action) {
      case 'complete_ritual':
        if (usageStatus.daily_usage.ritual_completions >= usageStatus.daily_limits.ritual_completions) {
          allowed = false;
          reason = 'Daily ritual completion limit reached';
          enforcement_action = 'block';
        }
        break;
      
      case 'start_ai_therapy':
        if (usageStatus.daily_usage.ai_therapy_sessions >= usageStatus.daily_limits.ai_therapy_sessions) {
          allowed = false;
          reason = 'Daily AI therapy session limit reached';
          enforcement_action = 'block';
        }
        break;
      
      case 'create_journal':
        if (usageStatus.daily_usage.journal_entries >= usageStatus.daily_limits.journal_entries) {
          allowed = false;
          reason = 'Daily journal entry limit reached';
          enforcement_action = 'block';
        }
        break;

      case 'voice_message':
        if (usageStatus.daily_usage.voice_messages >= usageStatus.daily_limits.voice_messages) {
          allowed = false;
          reason = 'Daily voice message limit reached';
          enforcement_action = 'block';
        }
        break;
    }

    return NextResponse.json({
      allowed,
      reason,
      enforcement_action,
      current_usage: usageStatus.daily_usage,
      limits: usageStatus.daily_limits
    });
  } catch (error) {
    console.error('FUP enforcement check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
