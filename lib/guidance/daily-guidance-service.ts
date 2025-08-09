/**
 * CTRL+ALT+BLOCK™ v1.1 - Daily Guidance System
 * Implements 30-day commitment framework per specification section 11
 */

import { db } from '@/lib/db';
import { eq, and, gte, desc, sql } from 'drizzle-orm';
import { users, ritualCompletions } from '@/lib/db/schema';

export interface DailyGuidance {
  day: number;
  title: string;
  whatToDo: string;
  whyItMatters: string;
  archetype?: string;
  isPaid: boolean;
  isPersonalized: boolean;
  commitmentDay?: number;
  phase: 'morning' | 'midday' | 'evening' | 'crisis';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface UserGuidanceState {
  currentDay: number;
  commitmentStartDate: Date;
  archetype?: string;
  isPersonalized: boolean;
  streakDays: number;
  ritualHistory: string[];
  therapyUsage: {
    sessionsThisWeek: number;
    lastSession?: Date;
  };
  tier: 'ghost' | 'firewall';
}

// CTRL+ALT+BLOCK™ v1.1 - 30-Day Commitment Framework
const COMMITMENT_FRAMEWORK = [
  {
    day: 1,
    title: "Day 1/30 • System Initialization",
    whatToDo: "Complete your first ritual and journal honestly about where you are right now",
    whyItMatters: "Honest baseline measurement is essential for tracking real progress over 30 days"
  },
  {
    day: 2,
    title: "Day 2/30 • Emotional Debugging", 
    whatToDo: "Identify one specific trigger that still affects you. Write it down.",
    whyItMatters: "You can't patch bugs you haven't located in your emotional code"
  },
  {
    day: 3,
    title: "Day 3/30 • Routine Installation",
    whatToDo: "Set a consistent time for your daily ritual. Treat it like a critical system update.",
    whyItMatters: "Consistency creates the neural pathways needed for lasting change"
  },
  {
    day: 4,
    title: "Day 4/30 • Network Security",
    whatToDo: "Identify one person who supports your healing and reach out to them today",
    whyItMatters: "Healing happens in connection. Secure support networks prevent isolation crashes"
  },
  {
    day: 5,
    title: "Day 5/30 • Data Validation",
    whatToDo: "Notice what thoughts feel automatic today. Question if they're actually true.",
    whyItMatters: "Automatic thoughts are often corrupted data from past wounds"
  },
  {
    day: 7,
    title: "Day 7/30 • First Week Complete",
    whatToDo: "Celebrate completing 7 days. Plan something that brings you joy.",
    whyItMatters: "Acknowledging progress reinforces positive behavioral patterns"
  },
  {
    day: 10,
    title: "Day 10/30 • Memory Optimization",
    whatToDo: "Write about a specific memory from your past relationship. Focus on what you learned.",
    whyItMatters: "Processing memories reduces their emotional charge and extracts wisdom"
  },
  {
    day: 14,
    title: "Day 14/30 • Two-Week Milestone", 
    whatToDo: "Compare current you to Day 1 you. Document the changes you notice.",
    whyItMatters: "Visible progress data motivates continued system optimization"
  },
  {
    day: 17,
    title: "Day 17/30 • Boundary Configuration",
    whatToDo: "Practice saying 'no' to something small today. Notice how it feels.",
    whyItMatters: "Healthy boundaries are firewalls that protect your emotional resources"
  },
  {
    day: 21,
    title: "Day 21/30 • Habit Formation Lock-In",
    whatToDo: "Your new routines should feel automatic now. If not, adjust your approach.",
    whyItMatters: "21 days typically creates habit pathways; strengthen them consciously"
  },
  {
    day: 25,
    title: "Day 25/30 • Future State Planning",
    whatToDo: "Visualize yourself 6 months from now. What does healed-you look like?",
    whyItMatters: "Clear vision of your future self guides present actions"
  },
  {
    day: 30,
    title: "Day 30/30 • System Upgrade Complete",
    whatToDo: "Reflect on your full transformation. You've rebuilt your emotional operating system.",
    whyItMatters: "You've proven you can engineer positive change. This is your new baseline."
  }
];

// Archetype-specific personalizations for paid tier
const ARCHETYPE_PERSONALIZATIONS = {
  'df': { // Data Flooder  
    focus: 'evidence-based healing',
    language: 'analytical',
    triggers: ['rumination', 'over-analysis', 'seeking certainty']
  },
  'fb': { // Firewall Builder
    focus: 'gradual vulnerability', 
    language: 'protective',
    triggers: ['intimacy', 'being seen', 'emotional exposure']
  },
  'gis': { // Ghost In Shell
    focus: 'clarity and consistency',
    language: 'stabilizing', 
    triggers: ['mixed signals', 'uncertainty', 'conflicting emotions']
  },
  'sn': { // Secure Node
    focus: 'expansion and growth',
    language: 'empowering',
    triggers: ['complacency', 'helping others too much', 'neglecting self']
  }
};

export class DailyGuidanceService {
  
  /**
   * Get daily guidance for user (CTRL+ALT+BLOCK™ v1.1 spec-compliant)
   */
  async getDailyGuidance(userId: string): Promise<DailyGuidance> {
    try {
      const userState = await this.getUserGuidanceState(userId);
      return this.generateGuidanceForDay(userState);
    } catch (error) {
      console.error('Error generating daily guidance:', error);
      // Fallback guidance
      return {
        day: 1,
        title: "Day 1/30 • System Initialization",
        whatToDo: "Complete your first ritual and journal honestly about where you are right now",
        whyItMatters: "Every transformation begins with honest self-assessment",
        isPaid: false,
        isPersonalized: false,
        phase: 'morning',
        priority: 'medium'
      };
    }
  }

  /**
   * Generate guidance for specific day in 30-day commitment
   */
  private generateGuidanceForDay(userState: UserGuidanceState): DailyGuidance {
    const effectiveDay = ((userState.currentDay - 1) % 30) + 1;
    const baseGuidance = COMMITMENT_FRAMEWORK.find(g => g.day === effectiveDay) || COMMITMENT_FRAMEWORK[0];
    
    // Free tier gets general copy
    if (userState.tier === 'ghost' || !userState.archetype) {
      return {
        day: effectiveDay,
        title: baseGuidance.title,
        whatToDo: baseGuidance.whatToDo,
        whyItMatters: baseGuidance.whyItMatters,
        isPaid: false,
        isPersonalized: false,
        commitmentDay: userState.currentDay,
        phase: 'morning',
        priority: 'medium'
      };
    }

    // Paid tier gets archetype-specific personalization
    return this.personalizeForArchetype(baseGuidance, userState);
  }

  /**
   * Personalize guidance for paid users with archetype-specific copy
   */
  private personalizeForArchetype(
    baseGuidance: typeof COMMITMENT_FRAMEWORK[0], 
    userState: UserGuidanceState
  ): DailyGuidance {
    const archetypeCode = userState.archetype as keyof typeof ARCHETYPE_PERSONALIZATIONS;
    const personalization = ARCHETYPE_PERSONALIZATIONS[archetypeCode];
    
    if (!personalization) {
      return {
        day: baseGuidance.day,
        title: baseGuidance.title,
        whatToDo: baseGuidance.whatToDo,
        whyItMatters: baseGuidance.whyItMatters,
        archetype: userState.archetype,
        isPaid: true,
        isPersonalized: false,
        commitmentDay: userState.currentDay,
        phase: 'morning',
        priority: 'medium'
      };
    }

    // Apply archetype-specific language adaptation
    let personalizedWhatToDo = this.adaptLanguageForArchetype(baseGuidance.whatToDo, personalization);
    let personalizedWhyItMatters = this.adaptLanguageForArchetype(baseGuidance.whyItMatters, personalization);

    // Add contextual enhancements based on user history
    if (userState.streakDays > 7) {
      personalizedWhatToDo += ` (Building on your ${userState.streakDays}-day streak momentum)`;
    }

    if (userState.therapyUsage.sessionsThisWeek > 2) {
      personalizedWhyItMatters += ` Your therapy engagement shows you're ready for deeper work.`;
    }

    return {
      day: baseGuidance.day,
      title: baseGuidance.title,
      whatToDo: personalizedWhatToDo,
      whyItMatters: personalizedWhyItMatters,
      archetype: userState.archetype,
      isPaid: true,
      isPersonalized: true,
      commitmentDay: userState.currentDay,
      phase: 'morning',
      priority: 'medium'
    };
  }

  /**
   * Adapt language based on archetype communication patterns
   */
  private adaptLanguageForArchetype(
    text: string, 
    archetype: typeof ARCHETYPE_PERSONALIZATIONS['df']
  ): string {
    switch (archetype.language) {
      case 'analytical':
        return text
          .replace(/feel/g, 'observe')
          .replace(/emotion/g, 'data point')
          .replace(/healing/g, 'debugging');
      
      case 'protective':
        return text
          .replace(/open/g, 'safely explore')
          .replace(/vulnerable/g, 'appropriately transparent')
          .replace(/share/g, 'selectively disclose');
      
      case 'stabilizing':
        return text
          .replace(/change/g, 'consistent adjustment')
          .replace(/try/g, 'systematically implement')
          .replace(/chaos/g, 'inconsistency');
      
      case 'empowering':
        return text
          .replace(/should/g, 'can choose to')
          .replace(/need to/g, 'have the power to')
          .replace(/must/g, 'get to');
      
      default:
        return text;
    }
  }

  /**
   * Get user's guidance state from database
   */
  private async getUserGuidanceState(userId: string): Promise<UserGuidanceState> {
    try {
      // Get user basic info
      const user = await db
        .select({
          archetype: users.emotionalArchetype,
          tier: users.tier,
          streakDays: users.streak,
          protocolDay: users.protocolDay,
          createdAt: users.createdAt
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user.length === 0) {
        throw new Error('User not found');
      }

      const userData = user[0];
      
      // Calculate current day in commitment
      const commitmentStart = userData.createdAt || new Date();
      const currentDay = this.calculateCurrentDay(commitmentStart);

      // Get therapy usage (placeholder - would need therapy session tracking)
      const therapyUsage = {
        sessionsThisWeek: 0,
        lastSession: undefined
      };

      // Get ritual history
      const recentCompletions = await db
        .select({ ritualId: ritualCompletions.ritualId })
        .from(ritualCompletions)
        .where(eq(ritualCompletions.userId, userId))
        .orderBy(desc(ritualCompletions.completedAt))
        .limit(10);

      return {
        currentDay,
        commitmentStartDate: commitmentStart,
        archetype: userData.archetype || undefined,
        isPersonalized: userData.tier === 'firewall',
        streakDays: userData.streakDays || 0,
        ritualHistory: recentCompletions.map(c => c.ritualId),
        therapyUsage,
        tier: userData.tier as 'ghost' | 'firewall'
      };

    } catch (error) {
      console.error('Error fetching user guidance state:', error);
      throw error;
    }
  }

  /**
   * Calculate current day in 30-day commitment
   */
  private calculateCurrentDay(commitmentStartDate: Date): number {
    const now = new Date();
    const diffTime = now.getTime() - commitmentStartDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return Math.max(1, diffDays);
  }

  /**
   * Check if user should restart their 30-day commitment
   */
  shouldRestartCommitment(currentDay: number, streakDays: number): boolean {
    return currentDay > 30 || (currentDay > 7 && streakDays < Math.floor(currentDay * 0.5));
  }

  /**
   * Get commitment progress percentage
   */
  getCommitmentProgress(currentDay: number): number {
    return Math.min(100, Math.round((currentDay / 30) * 100));
  }

  /**
   * Get next milestone for user
   */
  getNextMilestone(currentDay: number): { day: number; title: string } | null {
    const milestones = [3, 7, 14, 21, 30];
    const nextMilestone = milestones.find(m => m > currentDay);
    
    if (!nextMilestone) return null;
    
    const guidance = COMMITMENT_FRAMEWORK.find(g => g.day === nextMilestone);
    return {
      day: nextMilestone,
      title: guidance?.title || `Day ${nextMilestone}/30`
    };
  }
}

export const dailyGuidanceService = new DailyGuidanceService();
