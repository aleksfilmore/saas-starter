/**
 * Daily Ritual Engine
 * Handles ritual generation and assignment based on user tier and progress
 */

import { db } from '@/lib/db';
import { users, rituals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { DashboardType } from '../user/user-tier-service';
import { generateId } from '@/lib/utils';

export interface RitualTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  intensity: number; // 1-5
  duration: number; // minutes
  xpReward: number;
  bytesReward: number;
  tierAccess: DashboardType[];
  archetypeMatch?: string[]; // emotional archetypes this works best for
  dayRange?: { min: number; max: number }; // protocol day range
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
    xpReward: 50,
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
    xpReward: 30,
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
    xpReward: 40,
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
    xpReward: 35,
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
    xpReward: 45,
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
    xpReward: 60,
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
    xpReward: 70,
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
    xpReward: 80,
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
    xpReward: 100,
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
    xpReward: 90,
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
    xpReward: 120,
    bytesReward: 60,
    tierAccess: ['paid_advanced'],
    dayRange: { min: 30, max: 999 }
  }
];

/**
 * Get today's ritual for a user based on their tier and profile
 */
export async function getTodaysRitual(userId: string): Promise<RitualTemplate | null> {
  try {
    // Get user data
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user.length) return null;

    const userData = user[0];
    const dashboardType = userData.dashboardType as DashboardType;
    
    // Check if user already has a ritual for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingRitual = await db
      .select()
      .from(rituals)
      .where(eq(rituals.userId, userId))
      .limit(1);

    // If ritual exists and is from today, return it
    if (existingRitual.length && existingRitual[0].createdAt >= today) {
      const template = RITUAL_POOL.find(r => r.id === existingRitual[0].title);
      return template || null;
    }

    // Generate new ritual based on user tier and profile
    return await generatePersonalizedRitual(userData, dashboardType);

  } catch (error) {
    console.error('Error getting today\'s ritual:', error);
    return null;
  }
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
  
  // Store the ritual assignment in database
  await createRitualAssignment(user.id, selectedRitual);
  
  return selectedRitual;
}

/**
 * Create a ritual assignment in the database
 */
async function createRitualAssignment(userId: string, ritual: RitualTemplate) {
  try {
    await db.insert(rituals).values({
      id: generateId(),
      userId,
      title: ritual.id, // Store template ID for lookup
      description: ritual.description,
      category: ritual.category,
      intensity: ritual.intensity,
      duration: ritual.duration,
      xpReward: ritual.xpReward,
      bytesReward: ritual.bytesReward,
      isCompleted: false,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Error creating ritual assignment:', error);
  }
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
      xpReward: 25,
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
      xpReward: 50,
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
      xpReward: 75,
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
): Promise<{ success: boolean; xpEarned: number; bytesEarned: number }> {
  try {
    // Get the ritual
    const ritual = await db
      .select()
      .from(rituals)
      .where(eq(rituals.id, ritualId))
      .limit(1);

    if (!ritual.length || ritual[0].userId !== userId) {
      return { success: false, xpEarned: 0, bytesEarned: 0 };
    }

    const ritualData = ritual[0];
    
    // Mark as completed
    await db
      .update(rituals)
      .set({
        isCompleted: true,
        completedAt: new Date()
      })
      .where(eq(rituals.id, ritualId));

    // Award XP and Bytes
    const xpEarned = ritualData.xpReward;
    const bytesEarned = ritualData.bytesReward;

    await db
      .update(users)
      .set({
        xp: users.xp + xpEarned,
        bytes: users.bytes + bytesEarned,
        lastRitualCompleted: new Date(),
        streakDays: users.streakDays + 1
      })
      .where(eq(users.id, userId));

    return { success: true, xpEarned, bytesEarned };

  } catch (error) {
    console.error('Error completing ritual:', error);
    return { success: false, xpEarned: 0, bytesEarned: 0 };
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
