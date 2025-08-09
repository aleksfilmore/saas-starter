/**
 * Enhanced Progress Analytics Service
 * Real-time metrics, trend analysis, and predictive insights
 */

import { db } from '@/lib/db';
import { eq, and, gte, desc, sql, count, avg } from 'drizzle-orm';
import { 
  users, 
  dailyRitualCompletions, 
  userDailyState,
  dailyRitualAssignments 
} from '@/lib/db/minimal-schema';
import { getTierPermissions, type LegacyTier } from '@/lib/auth/tier-permissions';

export interface LiveMetrics {
  // Real-time stats
  current_streak: number;
  today_completions: number;
  week_completions: number;
  month_completions: number;
  
  // Performance indicators
  completion_rate_7d: number;
  completion_rate_30d: number;
  average_mood_7d: number;
  average_mood_30d: number;
  
  // Trend analysis
  streak_trend: 'increasing' | 'stable' | 'decreasing';
  mood_trend: 'improving' | 'stable' | 'declining' | 'volatile';
  engagement_trend: 'increasing' | 'stable' | 'decreasing';
  
  // Predictive insights
  streak_risk_level: 'low' | 'medium' | 'high';
  predicted_next_completion: Date | null;
  improvement_velocity: number; // Rate of positive change
  
  // Milestones
  next_milestone: {
    type: 'streak' | 'level' | 'completion_count';
    description: string;
    progress_percentage: number;
    estimated_days: number;
  };
  
  // Comparative analysis
  percentile_rank: number; // Compared to similar users
  archetype_average_comparison: number; // How user compares to their archetype
}

export interface TrendData {
  date: string;
  completions: number;
  mood: number | null;
  xp_gained: number;
  streak_day: number;
}

export interface ProgressInsight {
  id: string;
  type: 'achievement' | 'warning' | 'recommendation' | 'milestone';
  title: string;
  description: string;
  confidence: number; // 0-100
  action_items: string[];
  created_at: Date;
}

export class EnhancedProgressService {
  
  /**
   * Get real-time live metrics for a user
   */
  async getLiveMetrics(userId: string): Promise<LiveMetrics> {
    try {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const week_ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const month_ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      // Get user context
      const user = await this.getUserContext(userId);
      
      // Real-time stats
      const todayCompletions = await this.getTodayCompletions(userId, today);
      const weekCompletions = await this.getCompletionCount(userId, week_ago);
      const monthCompletions = await this.getCompletionCount(userId, month_ago);
      
      // Performance indicators
      const completionRate7d = await this.getCompletionRate(userId, 7);
      const completionRate30d = await this.getCompletionRate(userId, 30);
      const averageMood7d = await this.getAverageMood(userId, 7);
      const averageMood30d = await this.getAverageMood(userId, 30);
      
      // Trend analysis
      const streakTrend = await this.analyzeStreakTrend(userId);
      const moodTrend = await this.analyzeMoodTrend(userId);
      const engagementTrend = await this.analyzeEngagementTrend(userId);
      
      // Predictive insights
      const streakRiskLevel = this.calculateStreakRisk(user.ritual_streak, todayCompletions.length);
      const predictedNextCompletion = await this.predictNextCompletion(userId);
      const improvementVelocity = await this.calculateImprovementVelocity(userId);
      
      // Milestones
      const nextMilestone = await this.getNextMilestone(userId, user);
      
      // Comparative analysis
      const percentileRank = await this.calculatePercentileRank(userId);
      const archetypeComparison = await this.getArchetypeComparison(userId, user.archetype || 'unknown');
      
      return {
        current_streak: user.ritual_streak || 0,
        today_completions: todayCompletions.length,
        week_completions: weekCompletions,
        month_completions: monthCompletions,
        completion_rate_7d: completionRate7d,
        completion_rate_30d: completionRate30d,
        average_mood_7d: averageMood7d,
        average_mood_30d: averageMood30d,
        streak_trend: streakTrend,
        mood_trend: moodTrend,
        engagement_trend: engagementTrend,
        streak_risk_level: streakRiskLevel,
        predicted_next_completion: predictedNextCompletion,
        improvement_velocity: improvementVelocity,
        next_milestone: nextMilestone,
        percentile_rank: percentileRank,
        archetype_average_comparison: archetypeComparison
      };
      
    } catch (error) {
      console.error('Error getting live metrics:', error);
      throw error;
    }
  }
  
  /**
   * Get detailed trend data for visualization
   */
  async getTrendData(userId: string, days: number = 30): Promise<TrendData[]> {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      const rawData = await db
        .select({
          date: sql<string>`DATE(${dailyRitualCompletions.completed_at})`,
          completions: count(dailyRitualCompletions.id),
          avg_mood: avg(dailyRitualCompletions.mood_rating),
          total_xp: sql<number>`COALESCE(SUM(${dailyRitualCompletions.xp_earned}), 0)`
        })
        .from(dailyRitualCompletions)
        .where(
          and(
            eq(dailyRitualCompletions.user_id, userId),
            gte(dailyRitualCompletions.completed_at, startDate)
          )
        )
        .groupBy(sql`DATE(${dailyRitualCompletions.completed_at})`)
        .orderBy(sql`DATE(${dailyRitualCompletions.completed_at})`);
      
      // Fill in missing dates and calculate streak days
      const trendData: TrendData[] = [];
      let currentStreak = 0;
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0];
        
        const dayData = rawData.find(d => d.date === date);
        const completions = dayData?.completions || 0;
        
        // Update streak calculation
        if (completions > 0) {
          currentStreak++;
        } else {
          currentStreak = 0;
        }
        
        trendData.push({
          date,
          completions,
          mood: dayData?.avg_mood ? Number(dayData.avg_mood) : null,
          xp_gained: dayData?.total_xp || 0,
          streak_day: currentStreak
        });
      }
      
      return trendData;
      
    } catch (error) {
      console.error('Error getting trend data:', error);
      return [];
    }
  }
  
  /**
   * Generate progress insights and recommendations
   */
  async generateProgressInsights(userId: string): Promise<ProgressInsight[]> {
    try {
      const metrics = await this.getLiveMetrics(userId);
      const insights: ProgressInsight[] = [];
      
      // Achievement insights
      if (metrics.current_streak >= 7 && metrics.current_streak % 7 === 0) {
        insights.push({
          id: `achievement_streak_${metrics.current_streak}`,
          type: 'achievement',
          title: `${metrics.current_streak}-Day Streak Achievement!`,
          description: `Congratulations! You've maintained a ${metrics.current_streak}-day ritual streak. This level of consistency creates lasting behavioral change.`,
          confidence: 100,
          action_items: ['Celebrate this milestone', 'Set your next streak goal', 'Share your success'],
          created_at: new Date()
        });
      }
      
      // Warning insights
      if (metrics.streak_risk_level === 'high') {
        insights.push({
          id: `warning_streak_risk`,
          type: 'warning',
          title: 'Streak At Risk',
          description: 'Your ritual streak is in danger. Missing today would break your current progress. Small actions now prevent major setbacks.',
          confidence: 85,
          action_items: ['Complete one ritual today', 'Set a reminder for tomorrow', 'Identify your biggest barrier'],
          created_at: new Date()
        });
      }
      
      // Recommendation insights
      if (metrics.mood_trend === 'improving' && metrics.completion_rate_7d > 0.8) {
        insights.push({
          id: `recommendation_growth`,
          type: 'recommendation',
          title: 'Ready for Advanced Practices',
          description: 'Your mood is improving and consistency is strong. Consider adding more challenging rituals or exploring advanced features.',
          confidence: 75,
          action_items: ['Try a longer ritual', 'Explore AI therapy features', 'Set a new personal challenge'],
          created_at: new Date()
        });
      }
      
      // Milestone insights
      if (metrics.next_milestone.progress_percentage >= 80) {
        insights.push({
          id: `milestone_approaching_${metrics.next_milestone.type}`,
          type: 'milestone',
          title: 'Milestone Approaching',
          description: `You're ${metrics.next_milestone.progress_percentage}% of the way to: ${metrics.next_milestone.description}`,
          confidence: 90,
          action_items: [`Continue current pace for ${metrics.next_milestone.estimated_days} more days`, 'Stay focused on your goal', 'Prepare to celebrate your achievement'],
          created_at: new Date()
        });
      }
      
      return insights.sort((a, b) => b.confidence - a.confidence);
      
    } catch (error) {
      console.error('Error generating progress insights:', error);
      return [];
    }
  }
  
  // Helper methods
  private async getUserContext(userId: string) {
    const user = await db
      .select({
        tier: users.tier,
        archetype: users.archetype,
        archetype_details: users.archetype_details,
        xp: users.xp,
        level: users.level,
        ritual_streak: users.ritual_streak,
        created_at: users.created_at
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
      
    return user[0] || {};
  }
  
  private async getTodayCompletions(userId: string, today: string) {
    return await db
      .select({ id: dailyRitualCompletions.id })
      .from(dailyRitualCompletions)
      .where(
        and(
          eq(dailyRitualCompletions.user_id, userId),
          sql`DATE(${dailyRitualCompletions.completed_at}) = ${today}`
        )
      );
  }
  
  private async getCompletionCount(userId: string, since: Date): Promise<number> {
    const result = await db
      .select({ count: count(dailyRitualCompletions.id) })
      .from(dailyRitualCompletions)
      .where(
        and(
          eq(dailyRitualCompletions.user_id, userId),
          gte(dailyRitualCompletions.completed_at, since)
        )
      );
      
    return result[0]?.count || 0;
  }
  
  private async getCompletionRate(userId: string, days: number): Promise<number> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const completions = await this.getCompletionCount(userId, since);
    
    // Get total possible completions (assignments)
    const assignments = await db
      .select({ count: count(dailyRitualAssignments.id) })
      .from(dailyRitualAssignments)
      .where(
        and(
          eq(dailyRitualAssignments.user_id, userId),
          gte(sql`${dailyRitualAssignments.assigned_date}::date`, since)
        )
      );
    
    const totalPossible = assignments[0]?.count || days; // Fallback to days if no assignments
    return totalPossible > 0 ? (completions / totalPossible) * 100 : 0;
  }
  
  private async getAverageMood(userId: string, days: number): Promise<number> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const result = await db
      .select({ avg_mood: avg(dailyRitualCompletions.mood_rating) })
      .from(dailyRitualCompletions)
      .where(
        and(
          eq(dailyRitualCompletions.user_id, userId),
          gte(dailyRitualCompletions.completed_at, since)
        )
      );
      
    return Number(result[0]?.avg_mood) || 0;
  }
  
  private async analyzeStreakTrend(userId: string): Promise<LiveMetrics['streak_trend']> {
    // Get last 14 days of completion data
    const trendData = await this.getTrendData(userId, 14);
    
    if (trendData.length < 7) return 'stable';
    
    const recent7 = trendData.slice(-7);
    const previous7 = trendData.slice(-14, -7);
    
    const recentStreaks = recent7.filter(d => d.completions > 0).length;
    const previousStreaks = previous7.filter(d => d.completions > 0).length;
    
    if (recentStreaks > previousStreaks + 1) return 'increasing';
    if (recentStreaks < previousStreaks - 1) return 'decreasing';
    return 'stable';
  }
  
  private async analyzeMoodTrend(userId: string): Promise<LiveMetrics['mood_trend']> {
    const trendData = await this.getTrendData(userId, 14);
    const moodData = trendData.filter(d => d.mood !== null).map(d => d.mood as number);
    
    if (moodData.length < 5) return 'stable';
    
    const recent = moodData.slice(-5);
    const previous = moodData.slice(-10, -5);
    
    if (previous.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
    
    // Check for volatility
    const variance = recent.reduce((acc, mood) => acc + Math.pow(mood - recentAvg, 2), 0) / recent.length;
    if (variance > 1.5) return 'volatile';
    
    if (recentAvg > previousAvg + 0.5) return 'improving';
    if (recentAvg < previousAvg - 0.5) return 'declining';
    return 'stable';
  }
  
  private async analyzeEngagementTrend(userId: string): Promise<LiveMetrics['engagement_trend']> {
    const trendData = await this.getTrendData(userId, 14);
    
    if (trendData.length < 7) return 'stable';
    
    const recent7 = trendData.slice(-7);
    const previous7 = trendData.slice(-14, -7);
    
    const recentTotal = recent7.reduce((sum, d) => sum + d.completions, 0);
    const previousTotal = previous7.reduce((sum, d) => sum + d.completions, 0);
    
    if (recentTotal > previousTotal + 2) return 'increasing';
    if (recentTotal < previousTotal - 2) return 'decreasing';
    return 'stable';
  }
  
  private calculateStreakRisk(currentStreak: number, todayCompletions: number): LiveMetrics['streak_risk_level'] {
    if (todayCompletions > 0) return 'low'; // Already completed today
    
    const hour = new Date().getHours();
    if (hour < 12) return 'low'; // Still morning
    if (hour < 18) return 'medium'; // Afternoon
    return 'high'; // Evening/night
  }
  
  private async predictNextCompletion(userId: string): Promise<Date | null> {
    // Simple prediction based on historical patterns
    // In a real implementation, this could use machine learning
    const trendData = await this.getTrendData(userId, 14);
    const completionTimes = trendData.filter(d => d.completions > 0);
    
    if (completionTimes.length === 0) return null;
    
    // Predict based on most common completion time
    // This is a simplified version - could be much more sophisticated
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0); // Default to 10 AM
    
    return tomorrow;
  }
  
  private async calculateImprovementVelocity(userId: string): Promise<number> {
    const trendData = await this.getTrendData(userId, 30);
    if (trendData.length < 10) return 0;
    
    // Calculate rate of change in mood over time
    const moodData = trendData.filter(d => d.mood !== null).map((d, i) => ({ x: i, y: d.mood as number }));
    
    if (moodData.length < 5) return 0;
    
    // Simple linear regression to find slope (improvement rate)
    const n = moodData.length;
    const sumX = moodData.reduce((sum, p) => sum + p.x, 0);
    const sumY = moodData.reduce((sum, p) => sum + p.y, 0);
    const sumXY = moodData.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = moodData.reduce((sum, p) => sum + p.x * p.x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    return slope * 100; // Convert to percentage improvement per day
  }
  
  private async getNextMilestone(userId: string, user: any): Promise<LiveMetrics['next_milestone']> {
    const streak = user.ritual_streak || 0;
    const level = user.level || 1;
    
    // Determine next milestone
    if (streak < 7) {
      return {
        type: 'streak',
        description: 'Complete a 7-day streak',
        progress_percentage: (streak / 7) * 100,
        estimated_days: 7 - streak
      };
    } else if (streak < 30) {
      return {
        type: 'streak',
        description: 'Complete a 30-day streak',
        progress_percentage: (streak / 30) * 100,
        estimated_days: 30 - streak
      };
    } else {
      // Focus on level progression
      const xpNeeded = (level + 1) * 1000; // Simple XP calculation
      const currentXP = user.xp || 0;
      const progress = (currentXP / xpNeeded) * 100;
      
      return {
        type: 'level',
        description: `Reach Level ${level + 1}`,
        progress_percentage: Math.min(progress, 100),
        estimated_days: Math.ceil((xpNeeded - currentXP) / 100) // Assume 100 XP per day
      };
    }
  }
  
  private async calculatePercentileRank(userId: string): Promise<number> {
    // Simplified percentile calculation
    // In production, this would compare against actual user cohorts
    return Math.floor(Math.random() * 40) + 60; // Mock: 60-100th percentile
  }
  
  private async getArchetypeComparison(userId: string, archetype: string): Promise<number> {
    // Simplified archetype comparison
    // In production, this would compare against users with same archetype
    return Math.floor(Math.random() * 30) + 85; // Mock: 85-115% of archetype average
  }
}

export const enhancedProgressService = new EnhancedProgressService();
