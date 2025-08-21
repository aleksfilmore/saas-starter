/**
 * Achievement System for CTRL+ALT+BLOCK Byte Economy
 * 
 * Defines achievement milestones and rewards for healing activities
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'rituals' | 'community' | 'consistency' | 'milestones' | 'special';
  requirements: {
    type: 'count' | 'streak' | 'total' | 'combination';
    target: number;
    activity?: string;
    timeframe?: string;
  };
  rewards: {
    bytes: number;
    badge?: string;
    title?: string;
    unlocks?: string[];
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isHidden?: boolean;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  // === RITUAL ACHIEVEMENTS ===
  FIRST_RITUAL: {
    id: 'FIRST_RITUAL',
    name: 'First Step',
    description: 'Complete your first healing ritual',
    category: 'rituals',
    requirements: {
      type: 'count',
      target: 1,
      activity: 'DAILY_RITUAL_1'
    },
    rewards: {
      bytes: 50,
      badge: '🌱',
      title: 'Beginner'
    },
    rarity: 'common'
  },

  RITUAL_WARRIOR: {
    id: 'RITUAL_WARRIOR',
    name: 'Ritual Warrior',
    description: 'Complete 100 healing rituals',
    category: 'rituals',
    requirements: {
      type: 'count',
      target: 100,
      activity: 'DAILY_RITUAL_1'
    },
    rewards: {
      bytes: 500,
      badge: '⚔️',
      title: 'Ritual Warrior'
    },
    rarity: 'rare'
  },

  RITUAL_MASTER: {
    id: 'RITUAL_MASTER',
    name: 'Ritual Master',
    description: 'Complete 500 healing rituals',
    category: 'rituals',
    requirements: {
      type: 'count',
      target: 500,
      activity: 'DAILY_RITUAL_1'
    },
    rewards: {
      bytes: 2000,
      badge: '🏆',
      title: 'Ritual Master',
      unlocks: ['MASTER_MULTIPLIER']
    },
    rarity: 'epic'
  },

  // === CONSISTENCY ACHIEVEMENTS ===
  WEEK_STRONG: {
    id: 'WEEK_STRONG',
    name: 'Week Strong',
    description: 'Maintain a 7-day streak',
    category: 'consistency',
    requirements: {
      type: 'streak',
      target: 7
    },
    rewards: {
      bytes: 100,
      badge: '🔥',
      title: 'Consistent'
    },
    rarity: 'common'
  },

  MONTH_WARRIOR: {
    id: 'MONTH_WARRIOR',
    name: 'Month Warrior',
    description: 'Maintain a 30-day streak',
    category: 'consistency',
    requirements: {
      type: 'streak',
      target: 30
    },
    rewards: {
      bytes: 1000,
      badge: '🌟',
      title: 'Dedicated',
      unlocks: ['STREAK_MULTIPLIER']
    },
    rarity: 'rare'
  },

  UNSTOPPABLE: {
    id: 'UNSTOPPABLE',
    name: 'Unstoppable Force',
    description: 'Maintain a 100-day streak',
    category: 'consistency',
    requirements: {
      type: 'streak',
      target: 100
    },
    rewards: {
      bytes: 5000,
      badge: '💎',
      title: 'Unstoppable',
      unlocks: ['DIAMOND_MULTIPLIER']
    },
    rarity: 'legendary'
  },

  // === COMMUNITY ACHIEVEMENTS ===
  FIRST_POST: {
    id: 'FIRST_POST',
    name: 'Voice of Hope',
    description: 'Share your first wall post',
    category: 'community',
    requirements: {
      type: 'count',
      target: 1,
      activity: 'WALL_POST'
    },
    rewards: {
      bytes: 25,
      badge: '📢',
      title: 'Storyteller'
    },
    rarity: 'common'
  },

  COMMUNITY_PILLAR: {
    id: 'COMMUNITY_PILLAR',
    name: 'Community Pillar',
    description: 'Write 50 wall posts',
    category: 'community',
    requirements: {
      type: 'count',
      target: 50,
      activity: 'WALL_POST'
    },
    rewards: {
      bytes: 750,
      badge: '🏛️',
      title: 'Community Pillar'
    },
    rarity: 'rare'
  },

  HELPING_HAND: {
    id: 'HELPING_HAND',
    name: 'Helping Hand',
    description: 'Leave 100 supportive comments',
    category: 'community',
    requirements: {
      type: 'count',
      target: 100,
      activity: 'WALL_COMMENT'
    },
    rewards: {
      bytes: 400,
      badge: '🤝',
      title: 'Supporter'
    },
    rarity: 'rare'
  },

  // === MILESTONE ACHIEVEMENTS ===
  FIRST_THOUSAND: {
    id: 'FIRST_THOUSAND',
    name: 'First Thousand',
    description: 'Earn your first 1,000 Bytes',
    category: 'milestones',
    requirements: {
      type: 'total',
      target: 1000
    },
    rewards: {
      bytes: 100,
      badge: '💰',
      title: 'Earner'
    },
    rarity: 'common'
  },

  BYTE_MILLIONAIRE: {
    id: 'BYTE_MILLIONAIRE',
    name: 'Byte Millionaire',
    description: 'Earn 10,000 total Bytes',
    category: 'milestones',
    requirements: {
      type: 'total',
      target: 10000
    },
    rewards: {
      bytes: 2000,
      badge: '👑',
      title: 'Byte Millionaire',
      unlocks: ['VIP_SHOP_ACCESS']
    },
    rarity: 'epic'
  },

  // === SPECIAL ACHIEVEMENTS ===
  EARLY_BIRD: {
    id: 'EARLY_BIRD',
    name: 'Early Bird',
    description: 'Complete 10 check-ins before 8 AM',
    category: 'special',
    requirements: {
      type: 'count',
      target: 10,
      activity: 'CHECKIN'
    },
    rewards: {
      bytes: 200,
      badge: '🌅',
      title: 'Early Bird'
    },
    rarity: 'rare',
    isHidden: true
  },

  MIDNIGHT_WARRIOR: {
    id: 'MIDNIGHT_WARRIOR',
    name: 'Midnight Warrior',
    description: 'Complete 5 rituals after midnight',
    category: 'special',
    requirements: {
      type: 'count',
      target: 5,
      activity: 'DAILY_RITUAL_1'
    },
    rewards: {
      bytes: 300,
      badge: '🌙',
      title: 'Night Owl'
    },
    rarity: 'rare',
    isHidden: true
  },

  PERFECT_WEEK: {
    id: 'PERFECT_WEEK',
    name: 'Perfect Week',
    description: 'Complete all activities every day for a week',
    category: 'special',
    requirements: {
      type: 'combination',
      target: 7,
      timeframe: 'week'
    },
    rewards: {
      bytes: 1000,
      badge: '✨',
      title: 'Perfectionist'
    },
    rarity: 'epic',
    isHidden: true
  }
};

// === MULTIPLIER SYSTEM ===
export interface Multiplier {
  id: string;
  name: string;
  description: string;
  multiplier: number;
  duration: string; // in hours
  conditions?: string[];
  unlockRequirement?: string; // Achievement ID
}

export const MULTIPLIERS: Record<string, Multiplier> = {
  STREAK_MULTIPLIER: {
    id: 'STREAK_MULTIPLIER',
    name: 'Streak Boost',
    description: '2x Bytes for all activities',
    multiplier: 2.0,
    duration: '24',
    unlockRequirement: 'MONTH_WARRIOR'
  },

  MASTER_MULTIPLIER: {
    id: 'MASTER_MULTIPLIER',
    name: 'Master\'s Touch',
    description: '1.5x Bytes for ritual completion',
    multiplier: 1.5,
    duration: '168', // 1 week
    conditions: ['DAILY_RITUAL_1'],
    unlockRequirement: 'RITUAL_MASTER'
  },

  DIAMOND_MULTIPLIER: {
    id: 'DIAMOND_MULTIPLIER',
    name: 'Diamond Status',
    description: '3x Bytes for all activities',
    multiplier: 3.0,
    duration: '720', // 30 days
    unlockRequirement: 'UNSTOPPABLE'
  },

  WEEKEND_WARRIOR: {
    id: 'WEEKEND_WARRIOR',
    name: 'Weekend Warrior',
    description: '2x Bytes on weekends',
    multiplier: 2.0,
    duration: '48',
    conditions: ['WEEKEND_ONLY']
  }
};

// === ACHIEVEMENT CATEGORIES ===
export const ACHIEVEMENT_CATEGORIES = {
  rituals: {
    name: 'Healing Rituals',
    description: 'Achievements for completing healing rituals',
    icon: '🧘',
    color: 'purple'
  },
  community: {
    name: 'Community Support',
    description: 'Achievements for helping others',
    icon: '🤝',
    color: 'blue'
  },
  consistency: {
    name: 'Consistency',
    description: 'Achievements for maintaining streaks',
    icon: '🔥',
    color: 'orange'
  },
  milestones: {
    name: 'Milestones',
    description: 'Achievements for reaching Byte milestones',
    icon: '🎯',
    color: 'green'
  },
  special: {
    name: 'Special',
    description: 'Hidden and rare achievements',
    icon: '✨',
    color: 'gold'
  }
};

// === UTILITY FUNCTIONS ===
export function getAchievementsByCategory(category: string): Achievement[] {
  return Object.values(ACHIEVEMENTS).filter(achievement => achievement.category === category);
}

export function getAchievementsByRarity(rarity: string): Achievement[] {
  return Object.values(ACHIEVEMENTS).filter(achievement => achievement.rarity === rarity);
}

export function getVisibleAchievements(): Achievement[] {
  return Object.values(ACHIEVEMENTS).filter(achievement => !achievement.isHidden);
}

export function getHiddenAchievements(): Achievement[] {
  return Object.values(ACHIEVEMENTS).filter(achievement => achievement.isHidden);
}
