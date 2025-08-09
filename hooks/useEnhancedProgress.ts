/**
 * React Hook for Enhanced Progress Features
 * Integrates live metrics, daily guidance, and FUP enforcement
 */

import { useState, useEffect, useCallback } from 'react';

interface LiveMetrics {
  current_streak: number;
  today_completions: number;
  week_completions: number;
  month_completions: number;
  completion_rate_7d: number;
  completion_rate_30d: number;
  average_mood_7d: number;
  average_mood_30d: number;
  streak_trend: 'increasing' | 'stable' | 'decreasing';
  mood_trend: 'improving' | 'stable' | 'declining';
  engagement_trend: 'increasing' | 'stable' | 'decreasing';
  streak_risk_level: 'low' | 'medium' | 'high';
  predicted_next_completion: string;
  improvement_velocity: number;
  next_milestone: {
    type: 'streak' | 'level' | 'achievement';
    description: string;
    progress_percentage: number;
    estimated_days: number;
  };
  percentile_rank: number;
  archetype_average_comparison: number;
}

interface DailyGuidance {
  phase: 'morning' | 'midday' | 'evening' | 'crisis';
  message: string;
  action_suggestion: string;
  motivation_boost: string;
  archetype_insight: string;
  progress_acknowledgment: string;
  gentle_nudge: string;
  crisis_support: any;
}

interface FUPStatus {
  tier: string;
  usage: {
    daily: Record<string, number>;
    monthly: Record<string, number>;
  };
  limits: {
    daily: Record<string, number>;
    monthly: Record<string, number>;
  };
  metrics: {
    daily_percentages: Record<string, number>;
    monthly_percentages: Record<string, number>;
    warnings: Array<{
      type: string;
      feature: string;
      percentage: number;
      message: string;
    }>;
    overall_health: 'healthy' | 'cautious' | 'concerning';
  };
  enforcement: {
    level: string;
    violations: any[];
    anti_gaming_flags: any[];
  };
  next_reset: {
    daily: string;
    monthly: string;
  };
}

export function useEnhancedProgress() {
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics | null>(null);
  const [dailyGuidance, setDailyGuidance] = useState<DailyGuidance | null>(null);
  const [fupStatus, setFupStatus] = useState<FUPStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch live metrics
  const fetchLiveMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/progress/live-metrics', {
        headers: {
          'x-user-email': 'user@example.com' // Replace with actual user email
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch live metrics');
      }
      
      const data = await response.json();
      setLiveMetrics(data);
    } catch (err) {
      console.error('Error fetching live metrics:', err);
      setError('Failed to load live metrics');
    }
  }, []);

  // Fetch daily guidance
  const fetchDailyGuidance = useCallback(async () => {
    try {
      const response = await fetch('/api/guidance/daily', {
        headers: {
          'x-user-email': 'user@example.com' // Replace with actual user email
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch daily guidance');
      }
      
      const data = await response.json();
      setDailyGuidance(data.guidance);
    } catch (err) {
      console.error('Error fetching daily guidance:', err);
      setError('Failed to load daily guidance');
    }
  }, []);

  // Fetch FUP status
  const fetchFUPStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/enforcement/fup-status', {
        headers: {
          'x-user-email': 'user@example.com' // Replace with actual user email
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch FUP status');
      }
      
      const data = await response.json();
      setFupStatus(data);
    } catch (err) {
      console.error('Error fetching FUP status:', err);
      setError('Failed to load FUP status');
    }
  }, []);

  // Check action permission
  const checkActionPermission = useCallback(async (action: string, context?: any) => {
    try {
      const response = await fetch('/api/enforcement/fup-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': 'user@example.com' // Replace with actual user email
        },
        body: JSON.stringify({ action, context })
      });
      
      if (!response.ok) {
        throw new Error('Failed to check action permission');
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error checking action permission:', err);
      return { allowed: false, reason: 'Permission check failed' };
    }
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchLiveMetrics(),
        fetchDailyGuidance(),
        fetchFUPStatus()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchLiveMetrics, fetchDailyGuidance, fetchFUPStatus]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auto-refresh live metrics every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLiveMetrics();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchLiveMetrics]);

  // Auto-refresh guidance every hour
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDailyGuidance();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchDailyGuidance]);

  return {
    liveMetrics,
    dailyGuidance,
    fupStatus,
    loading,
    error,
    refreshData,
    checkActionPermission,
    // Computed values
    isHealthy: fupStatus?.metrics.overall_health === 'healthy',
    hasWarnings: (fupStatus?.metrics.warnings?.length ?? 0) > 0,
    streakRisk: liveMetrics?.streak_risk_level,
    nextMilestone: liveMetrics?.next_milestone,
    currentPhase: dailyGuidance?.phase
  };
}
