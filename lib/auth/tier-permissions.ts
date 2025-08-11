/**
 * CTRL+ALT+BLOCK™ Tier Permissions Matrix
 * Implements Ghost Mode vs Firewall Mode access controls per specification
 */

// Map old tier names to spec tier names
export type UserTier = 'ghost' | 'firewall';
export type LegacyTier = 'freemium' | 'paid_beginner' | 'paid_advanced';

// Core feature permissions
export interface TierPermissions {
  // Core Features
  cbdQuiz: boolean;
  journaling: boolean;
  dailyRituals: boolean;
  noContactTracking: boolean;
  basicProgress: boolean;
  
  // Advanced Features (Firewall Mode Only)
  aiTherapy: boolean;
  wallOfWounds: boolean;
  advancedAnalytics: boolean;
  crisisSupport: boolean;
  gamification: boolean;
  
  // Limits
  dailyRitualCount: number;
  aiTherapyMinutesPerMonth: number;
  voiceMinutesPerMonth: number;
  
  // Quality Controls
  journalValidation: {
    minChars: number;
    minDwellTime: number;
    minSentences: number;
    minUniqueCharRatio: number;
  };
}

// Tier definitions per specification
export const TIER_PERMISSIONS: Record<UserTier, TierPermissions> = {
  ghost: {
    // Core Features (All Users)
    cbdQuiz: true,
    journaling: true,
    dailyRituals: true,
    noContactTracking: true,
    basicProgress: true,
    
    // Advanced Features (Firewall Only)
    aiTherapy: false,
    wallOfWounds: false,
    advancedAnalytics: false,
    crisisSupport: false,
    gamification: false,
    
    // Limits
    dailyRitualCount: 1, // Ghost mode: 1 ritual per day
    aiTherapyMinutesPerMonth: 0,
    voiceMinutesPerMonth: 0,
    
    // Validation (Still required for quality)
    journalValidation: {
      minChars: 120,
      minDwellTime: 45,
      minSentences: 2,
      minUniqueCharRatio: 0.6
    }
  },
  
  firewall: {
    // Core Features (All Users)
    cbdQuiz: true,
    journaling: true,
    dailyRituals: true,
    noContactTracking: true,
    basicProgress: true,
    
    // Advanced Features (Firewall Mode)
    aiTherapy: true,
    wallOfWounds: true,
    advancedAnalytics: true,
    crisisSupport: true,
    gamification: true,
    
    // Limits
    dailyRitualCount: 2, // Firewall mode: 2 rituals per day
    aiTherapyMinutesPerMonth: 60, // 60 minutes of AI therapy per month
    voiceMinutesPerMonth: 30, // 30 minutes of voice therapy per month
    
    // Validation (Same quality standards)
    journalValidation: {
      minChars: 120,
      minDwellTime: 45,
      minSentences: 2,
      minUniqueCharRatio: 0.6
    }
  }
};

/**
 * Convert legacy tier names to specification tier names
 */
export function mapLegacyTierToSpec(legacyTier: LegacyTier): UserTier {
  switch (legacyTier) {
    case 'freemium':
      return 'ghost';
    case 'paid_beginner':
    case 'paid_advanced':
      return 'firewall';
    default:
      return 'ghost'; // Default to ghost mode
  }
}

/**
 * Get permissions for a user's tier
 */
export function getTierPermissions(tier: UserTier | LegacyTier): TierPermissions {
  // Handle legacy tier names
  const specTier = typeof tier === 'string' && ['paid_beginner', 'paid_advanced', 'freemium'].includes(tier)
    ? mapLegacyTierToSpec(tier as LegacyTier)
    : tier as UserTier;
    
  return TIER_PERMISSIONS[specTier] || TIER_PERMISSIONS.ghost;
}

/**
 * Check if user has access to a specific feature
 */
export function hasFeatureAccess(
  userTier: UserTier | LegacyTier,
  feature: keyof Omit<TierPermissions, 'dailyRitualCount' | 'aiTherapyMinutesPerMonth' | 'voiceMinutesPerMonth' | 'journalValidation'>
): boolean {
  const permissions = getTierPermissions(userTier);
  return permissions[feature];
}

/**
 * Get feature limits for a user's tier
 */
export function getFeatureLimit(
  userTier: UserTier | LegacyTier,
  limit: 'dailyRitualCount' | 'aiTherapyMinutesPerMonth' | 'voiceMinutesPerMonth'
): number {
  const permissions = getTierPermissions(userTier);
  return permissions[limit];
}

/**
 * Check if user can access a route based on their tier
 */
export function canAccessRoute(userTier: UserTier | LegacyTier, route: string): boolean {
  const permissions = getTierPermissions(userTier);
  
  // Route access rules
  if (route.includes('/ai-therapy')) {
    return permissions.aiTherapy;
  }
  
  if (route.includes('/wall')) {
    return permissions.wallOfWounds;
  }
  
  if (route.includes('/achievements') || route.includes('/gamification')) {
    return permissions.gamification;
  }
  
  if (route.includes('/crisis-support')) {
    return permissions.crisisSupport;
  }
  
  // Core routes available to all users
  if (route.includes('/quiz') || 
      route.includes('/ritual') || 
      route.includes('/no-contact') ||
      route.includes('/dashboard')) {
    return true;
  }
  
  return true; // Default allow
}

/**
 * Get upgrade message for blocked features
 */
export function getUpgradeMessage(feature: string): string {
  return `Upgrade to Firewall Mode to access ${feature}. Ghost Mode provides core emotional regulation tools, while Firewall Mode unlocks advanced AI therapy, crisis support, and gamification features.`;
}
