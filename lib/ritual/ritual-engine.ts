/**
 * Daily Ritual Engine
 * Handles ritual generation and assignment based on user tier and progress
 */

import { getRitualsByArchetype, getRandomRitual, Ritual } from '@/lib/rituals/database';
import type { DashboardType } from '@/lib/user/user-tier-service';
import { db } from '@/lib/db/drizzle';
import { users, rituals } from '@/lib/db/unified-schema';
import { eq, sql } from 'drizzle-orm';

// Global storage reference
declare global {
  var localUsers: Map<string, any>;
  var localSessions: Map<string, any>;
  var dailyRitualAssignments: Map<string, any>;
}

// Initialize daily ritual assignments storage
if (!global.dailyRitualAssignments) {
  global.dailyRitualAssignments = new Map();
}

export interface RitualTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  intensity: number; // 1-5
  duration: number; // minutes
  bytesReward: number;
  tierAccess: string[];
  archetypeMatch?: string[]; // emotional archetypes this works best for
  dayRange?: { min: number; max: number }; // protocol day range
  // xpReward removed (deprecated)
}

/**
 * Pre-written ritual pool for freemium and paid users
 */
const RITUAL_POOL: RitualTemplate[] = [
  // ===== FREEMIUM RITUALS (General Pool) =====
  {
    id: 'morning_no_check',
    title: '📵 Morning No-Check Protocol',
    description: 'Keep your phone away for the first 30 minutes after waking up. Let your mind boot up without digital interference.',
    category: 'digital_detox',
    intensity: 2,
    duration: 30,
    bytesReward: 25,
    tierAccess: ['freemium', 'paid_beginner', 'paid_advanced']
  },
  {
    id: 'mirror_affirmation',
    title: '🪞 Mirror Affirmation Hack',
    description: 'Look yourself in the eyes and say: "I am writing new code for my emotional operating system." 3 times.',
    category: 'self_compassion',
    intensity: 1,
    duration: 5,
    bytesReward: 15,
    tierAccess: ['freemium', 'paid_beginner', 'paid_advanced']
  },
  {
    id: 'power_walk',
    title: '⚡ Power Walk Debugging',
    description: 'Take a 15-minute walk while mentally listing 3 ways you\'ve grown stronger since your breakup.',
    category: 'physical_movement',
    intensity: 3,
    duration: 15,
    bytesReward: 20,
    tierAccess: ['freemium', 'paid_beginner', 'paid_advanced']
  },
  {
    id: 'gratitude_protocol',
    title: '🙏 Gratitude Protocol Execute',
    description: 'Write down 3 things you\'re grateful for that have nothing to do with relationships.',
    category: 'mindfulness',
    intensity: 1,
    duration: 10,
    bytesReward: 18,
    tierAccess: ['freemium', 'paid_beginner', 'paid_advanced']
  },
  {
    id: 'memory_defrag',
    title: '🧠 Memory Defragmentation',
    description: 'Spend 10 minutes organizing one small space (desk, drawer, shelf). External order creates internal calm.',
    category: 'organization',
    intensity: 2,
    duration: 10,
    bytesReward: 22,
    tierAccess: ['freemium', 'paid_beginner', 'paid_advanced']
  },

  // ===== PAID BEGINNER RITUALS (Days 0-14) =====
  {
    id: 'attachment_scan',
    title: '🔍 Attachment Style System Scan',
    description: 'Reflect on your attachment patterns. Write 3 sentences about how your emotional archetype shows up today.',
    category: 'self_awareness',
    intensity: 3,
    duration: 15,
    bytesReward: 30,
    tierAccess: ['paid_beginner', 'paid_advanced'],
    archetypeMatch: ['Data Flooder', 'Firewall Builder', 'Secure Node', 'Ghost in the Shell'],
    dayRange: { min: 0, max: 14 }
  },
  {
    id: 'emotion_logging',
    title: '📊 Emotion Data Logging',
    description: 'Log your emotional state 3 times today. Scale of 1-10 plus one word describing the feeling.',
    category: 'emotional_regulation',
    intensity: 2,
    duration: 20,
    bytesReward: 35,
    tierAccess: ['paid_beginner', 'paid_advanced'],
    dayRange: { min: 3, max: 14 }
  },
  {
    id: 'boundary_firewall',
    title: '🛡️ Personal Boundary Firewall',
    description: 'Identify one boundary you need to set this week. Write it down and practice saying it out loud.',
    category: 'boundaries',
    intensity: 4,
    duration: 20,
    bytesReward: 40,
    tierAccess: ['paid_beginner', 'paid_advanced'],
    archetypeMatch: ['Firewall Builder', 'Secure Node'],
    dayRange: { min: 5, max: 14 }
  },

  // ===== PAID ADVANCED RITUALS (Day 15+) =====
  {
    id: 'relationship_autopsy',
    title: '🔬 Relationship Pattern Autopsy',
    description: 'Analyze your past relationship patterns like a code review. What functions need refactoring?',
    category: 'deep_work',
    intensity: 5,
    duration: 30,
    bytesReward: 50,
    tierAccess: ['paid_advanced'],
    dayRange: { min: 15, max: 999 }
  },
  {
    id: 'future_self_programming',
    title: '🚀 Future Self Programming',
    description: 'Write a detailed description of who you\'ll be 6 months from now. Include specific habits and mindset shifts.',
    category: 'visioning',
    intensity: 4,
    duration: 25,
    bytesReward: 45,
    tierAccess: ['paid_advanced'],
    dayRange: { min: 20, max: 999 }
  },
  {
    id: 'shadow_work_debugging',
    title: '🌑 Shadow Work System Debug',
    description: 'Identify one aspect of yourself you\'ve been avoiding. Write about it with curiosity, not judgment.',
    category: 'shadow_work',
    intensity: 5,
    duration: 35,
    bytesReward: 60,
    tierAccess: ['paid_advanced'],
    dayRange: { min: 30, max: 999 }
  }
];

/**
 * Get today's ritual for a user based on their tier and archetype
 */
export async function getTodaysRitual(userId: string): Promise<RitualTemplate | null> {
  try {
    const today = new Date().toDateString();
    const assignmentKey = `${userId}-${today}`;
    
    // Check if we already assigned a ritual today
    if (global.dailyRitualAssignments.has(assignmentKey)) {
      const assignment = global.dailyRitualAssignments.get(assignmentKey);
      return convertRitualToTemplate(assignment.ritual);
    }
    
    // Get user data from local storage
    const user = global.localUsers?.get(userId);
    if (!user) return null;
    
    const userTier = user.tier || 'freemium';
    const userArchetype = user.archetype || 'PANIC PROTOCOL'; // fallback
    
    // Get a random ritual for this archetype and tier
    const ritual = getRandomRitual(userArchetype, userTier);
    if (!ritual) return null;
    
    // Store the assignment for today
    global.dailyRitualAssignments.set(assignmentKey, {
      userId,
      ritual,
      assignedAt: new Date().toISOString(),
      completed: false
    });
    
    console.log(`📜 Assigned ritual "${ritual.title}" to user ${userId} (${userArchetype})`);
    
    return convertRitualToTemplate(ritual);

  } catch (error) {
    console.error('Error getting today\'s ritual:', error);
    return null;
  }
}

/**
 * Convert our new Ritual format to the legacy RitualTemplate format
 */
function convertRitualToTemplate(ritual: Ritual): RitualTemplate {
  const intensityMap = {
    'beginner': 2,
    'intermediate': 3,
    'advanced': 5
  };
  
  return {
    id: ritual.id,
    title: ritual.title,
    description: ritual.description,
    category: ritual.category,
    intensity: intensityMap[ritual.difficulty],
    duration: ritual.duration_minutes,
    bytesReward: ritual.bytes_reward,
    tierAccess: [ritual.user_tier],
    archetypeMatch: ritual.archetype,
    dayRange: undefined
  };
}

/**
 * Generate a personalized ritual based on user profile
 */
async function generatePersonalizedRitual(
  user: any,
  dashboardType: DashboardType
): Promise<RitualTemplate | null> {
  
  // Filter rituals by tier access
  let availableRituals = RITUAL_POOL.filter(ritual => 
    ritual.tierAccess.includes(dashboardType)
  );

  // For paid users, filter by protocol day if available
  if (dashboardType !== 'freemium' && user.protocolDay !== undefined) {
    availableRituals = availableRituals.filter(ritual => {
      if (!ritual.dayRange) return true;
      return user.protocolDay >= ritual.dayRange.min && user.protocolDay <= ritual.dayRange.max;
    });
  }

  // For paid users, prioritize rituals matching their emotional archetype
  if (user.emotionalArchetype && dashboardType !== 'freemium') {
    const archetypeMatches = availableRituals.filter(ritual =>
      ritual.archetypeMatch?.includes(user.emotionalArchetype)
    );
    
    if (archetypeMatches.length > 0) {
      availableRituals = archetypeMatches;
    }
  }

  // Freemium users get randomized selection from general pool
  if (dashboardType === 'freemium') {
    const freemiumRituals = availableRituals.filter(ritual => 
      !ritual.archetypeMatch && !ritual.dayRange
    );
    if (freemiumRituals.length > 0) {
      availableRituals = freemiumRituals;
    }
  }

  // Select ritual (weighted by intensity for gradual progression)
  if (availableRituals.length === 0) {
    return getDefaultRitual(dashboardType);
  }

  // For paid users, gradually increase intensity over time
  if (dashboardType !== 'freemium' && user.protocolDay) {
    const preferredIntensity = Math.min(5, Math.floor(user.protocolDay / 7) + 1);
    const intensityMatches = availableRituals.filter(r => 
      Math.abs(r.intensity - preferredIntensity) <= 1
    );
    
    if (intensityMatches.length > 0) {
      availableRituals = intensityMatches;
    }
  }

  // Random selection from filtered rituals
  const selectedRitual = availableRituals[Math.floor(Math.random() * availableRituals.length)];
  
  // Return the ritual template directly (no database storage needed)
  return selectedRitual;
}

/**
 * Get default ritual if no others available
 */
function getDefaultRitual(dashboardType: DashboardType): RitualTemplate {
  const defaults = {
    'freemium': {
      id: 'default_freemium',
      title: '🌟 Daily Glow-Up Check',
      description: 'Take 5 minutes to do something that makes you feel good about yourself.',
      category: 'self_care',
      intensity: 1,
      duration: 5,
      bytesReward: 10,
      tierAccess: ['freemium']
    },
    'paid_beginner': {
      id: 'default_beginner',
      title: '💪 Strength Building Protocol',
      description: 'Reflect on one way you\'ve grown stronger since starting your healing journey.',
      category: 'self_awareness',
      intensity: 2,
      duration: 10,
      bytesReward: 25,
      tierAccess: ['paid_beginner']
    },
    'paid_advanced': {
      id: 'default_advanced',
      title: '🚀 System Optimization',
      description: 'Identify one area of your life you want to optimize this week and create an action plan.',
      category: 'growth',
      intensity: 3,
      duration: 20,
      bytesReward: 40,
      tierAccess: ['paid_advanced']
    }
  };

  return defaults[dashboardType] as RitualTemplate;
}

/**
 * Complete a ritual and award XP/Bytes
 */
export async function completeRitual(
  userId: string,
  ritualId: string,
  notes?: string,
  mood?: number
): Promise<{ success: boolean; bytesEarned: number }> {
  try {
    // Find the ritual template
    const ritualTemplate = RITUAL_POOL.find(r => r.id === ritualId);
    
    if (!ritualTemplate) {
      return { success: false, bytesEarned: 0 };
    }

    const bytesEarned = ritualTemplate.bytesReward;

    await db
      .update(users)
      .set({
        bytes: sql`${users.bytes} + ${bytesEarned}`,
        lastRitualCompleted: new Date(),
        streakDays: sql`${users.streakDays} + 1`
      })
      .where(eq(users.id, userId));
  return { success: true, bytesEarned };

  } catch (error) {
    console.error('Error completing ritual:', error);
  return { success: false, bytesEarned: 0 };
  }
}

/**
 * Allow ritual reroll (limited per day)
 */
export async function rerollRitual(userId: string): Promise<RitualTemplate | null> {
  try {
    // Get user data
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) return null;

    const userData = user[0];
    const dashboardType = userData.dashboardType as DashboardType;

    // Delete current ritual
    await db
      .delete(rituals)
      .where(eq(rituals.userId, userId));

    // Generate new ritual
    return await generatePersonalizedRitual(userData, dashboardType);

  } catch (error) {
    console.error('Error rerolling ritual:', error);
    return null;
  }
}

/**
 * Get ritual history for analytics
 */
export async function getRitualHistory(userId: string, limit: number = 30) {
  try {
    return await db
      .select()
      .from(rituals)
      .where(eq(rituals.userId, userId))
      .limit(limit);
  } catch (error) {
    console.error('Error getting ritual history:', error);
    return [];
  }
}
