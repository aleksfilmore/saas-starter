/**
 * User Tier & Dashboard Type Management Service
 * Implements the tier system from the dev brief
 */

export type UserTier = 'freemium' | 'paid';
export type UserStatus = 'active' | 'cancelled' | 'trialing';
export type DashboardType = 'freemium' | 'paid_beginner' | 'paid_advanced';
export type UserRole = 'ghost_user' | 'paid_beginner_user' | 'paid_advanced_user';

interface UserTierData {
  id: string;
  tier: UserTier;
  status: UserStatus;
  createdAt: Date;
  protocolDay: number;
  dashboardType?: DashboardType;
}

/**
 * Calculate the dashboard type based on user tier and days since signup
 */
export function calculateDashboardType(user: UserTierData): DashboardType {
  // Freemium users always get freemium dashboard
  if (user.tier === 'freemium') {
    return 'freemium';
  }

  // Paid users get different dashboards based on how long they've been paid
  if (user.tier === 'paid' && user.status === 'active') {
    const daysSinceCreation = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // First 14 days: paid_beginner
    if (daysSinceCreation <= 14) {
      return 'paid_beginner';
    }
    
    // Day 15+: paid_advanced
    return 'paid_advanced';
  }

  // Fallback to freemium for cancelled/trialing users
  return 'freemium';
}

/**
 * Get user role enum for database queries
 */
export function getUserRole(dashboardType: DashboardType): UserRole {
  switch (dashboardType) {
    case 'freemium':
      return 'ghost_user';
    case 'paid_beginner':
      return 'paid_beginner_user';
    case 'paid_advanced':
      return 'paid_advanced_user';
    default:
      return 'ghost_user';
  }
}

/**
 * Check if user has access to specific features
 */
export function hasFeatureAccess(dashboardType: DashboardType, feature: string): boolean {
  const featureMatrix = {
    'freemium': [
      'no_contact_tracker',
      'glow_up_console',
      'daily_ritual_rotation',
      'byte_counter',
      'wall_read_only',
      'streak_counter'
    ],
    'paid_beginner': [
      'no_contact_tracker',
      'glow_up_console',
      'personalized_rituals',
      'ai_therapy_weekly',
      'byte_shop_limited',
      'ritual_bank_limited',
      'wall_write_access',
      'emotional_dial',
      'streak_counter'
    ],
    'paid_advanced': [
      'no_contact_tracker',
      'glow_up_console',
      'personalized_rituals',
      'ai_therapy_weekly',
      'byte_shop_full',
      'ritual_bank_full',
      'ritual_scheduler',
      'ai_companion',
      'ritual_streak_bonuses',
      'xp_multipliers',
      'cosmetic_upgrades',
      'mission_logs',
      'glitch_achievements',
      'wall_write_access',
      'emotional_dial',
      'streak_counter'
    ]
  };

  return featureMatrix[dashboardType]?.includes(feature) || false;
}

/**
 * Get AI therapy quota limits
 */
export function getAITherapyQuota(dashboardType: DashboardType): {
  weeklyIncluded: number;
  bytesCostPerExtra: number;
  dollarCostPerExtra: number;
} {
  switch (dashboardType) {
    case 'freemium':
      return {
        weeklyIncluded: 0,
        bytesCostPerExtra: 100,
        dollarCostPerExtra: 5
      };
    case 'paid_beginner':
    case 'paid_advanced':
      return {
        weeklyIncluded: 1,
        bytesCostPerExtra: 50,
        dollarCostPerExtra: 5
      };
    default:
      return {
        weeklyIncluded: 0,
        bytesCostPerExtra: 100,
        dollarCostPerExtra: 5
      };
  }
}

/**
 * Get Byte Shop access level
 */
export function getByteShopAccess(dashboardType: DashboardType): {
  hasAccess: boolean;
  categories: string[];
} {
  switch (dashboardType) {
    case 'freemium':
      return {
        hasAccess: false,
        categories: []
      };
    case 'paid_beginner':
      return {
        hasAccess: true,
        categories: ['extra_ai_sessions', 'emergency_rituals', 'basic_avatars']
      };
    case 'paid_advanced':
      return {
        hasAccess: true,
        categories: [
          'extra_ai_sessions',
          'emergency_rituals',
          'basic_avatars',
          'premium_avatars',
          'exclusive_rituals',
          'glitch_events',
          'cosmetic_upgrades'
        ]
      };
    default:
      return {
        hasAccess: false,
        categories: []
      };
  }
}

/**
 * Calculate XP and Byte rewards based on user tier
 */
export function calculateRewards(
  dashboardType: DashboardType,
  baseXP: number,
  baseBytes: number
): { xp: number; bytes: number } {
  const multipliers = {
    'freemium': { xp: 1.0, bytes: 1.0 },
    'paid_beginner': { xp: 1.2, bytes: 1.2 },
    'paid_advanced': { xp: 1.5, bytes: 1.5 }
  };

  const multiplier = multipliers[dashboardType];
  
  return {
    xp: Math.floor(baseXP * multiplier.xp),
    bytes: Math.floor(baseBytes * multiplier.bytes)
  };
}

/**
 * Check if user should auto-transition dashboard type
 */
export function shouldTransitionDashboard(user: UserTierData): DashboardType | null {
  const currentType = user.dashboardType || calculateDashboardType(user);
  const calculatedType = calculateDashboardType(user);
  
  // If calculated type is different from current, user should transition
  if (currentType !== calculatedType) {
    return calculatedType;
  }
  
  return null;
}

/**
 * Get dashboard configuration for UI components
 */
export function getDashboardConfig(dashboardType: DashboardType) {
  const configs = {
    'freemium': {
      title: 'Ghost Mode Dashboard',
      subtitle: 'Basic healing tools - upgrade to unlock full potential',
      showUpgradeBanner: true,
      primaryColor: '#6B7280', // Gray
      modules: [
        'no_contact_tracker',
        'glow_up_console',
        'daily_ritual_rotation',
        'wall_read_only'
      ],
      restrictions: {
        aiTherapy: 'locked',
        ritualBank: 'locked',
        byteShop: 'locked'
      }
    },
    'paid_beginner': {
      title: 'Firewall Mode - Beginner',
      subtitle: 'Building your defense systems',
      showUpgradeBanner: false,
      primaryColor: '#8B5CF6', // Purple
      modules: [
        'personalized_rituals',
        'ai_therapy_limited',
        'byte_shop_limited',
        'ritual_bank_limited',
        'no_contact_tracker',
        'wall_write_access'
      ],
      restrictions: {
        ritualScheduler: 'locked',
        aiCompanion: 'locked',
        fullByteShop: 'locked'
      }
    },
    'paid_advanced': {
      title: 'Firewall Mode - Advanced',
      subtitle: 'Full access to all healing protocols',
      showUpgradeBanner: false,
      primaryColor: '#10B981', // Green
      modules: [
        'personalized_rituals',
        'ai_therapy_full',
        'byte_shop_full',
        'ritual_bank_full',
        'ritual_scheduler',
        'ai_companion',
        'mission_logs',
        'no_contact_tracker',
        'wall_write_access'
      ],
      restrictions: {}
    }
  };

  return configs[dashboardType];
}
