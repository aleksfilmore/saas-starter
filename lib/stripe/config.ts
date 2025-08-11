import Stripe from 'stripe';

// Create Stripe instance only if environment variables are available
// This prevents build-time errors when env vars aren't set
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20' as any,
    typescript: true,
  });
}

// Export a function that throws an error at runtime if Stripe isn't configured
export function getStripe(): Stripe {
  if (!stripe) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
  }
  return stripe;
}

// For backwards compatibility, export the stripe instance
export { stripe };

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: '👻 Ghost Mode (Free)',
    priceId: null, // Free tier doesn't need Stripe
    price: 0,
    description: 'Essential tools to start your healing journey',
    features: [
      'No-Contact Tracker with daily check-in',
      'Shield window 24h (resets if missed)',
      '1 random daily ritual (general pool)',
      'Wall of Wounds™ - Read & react only ❤️🔥😭',
      'AI Therapy on-demand ($3.99/session, 300 msg cap)',
      'XP & Levels up to Level 15',
      'Starter Bytes & Badges (earn only)'
    ],
    limits: {
      shieldWindowHours: 24,
      dailyRituals: 1,
      maxLevel: 15,
      aiTherapyIncluded: false,
      aiTherapySessionPrice: 3.99,
      aiTherapyMessagesPerSession: 300,
      wallPosting: false,
      wallEditing: false,
      voiceTherapy: false,
      autoShield: false,
      unlimitedReroll: false,
      ritualArchetypeWeighted: false
    }
  },
  PREMIUM: {
    name: '🔥 Firewall Mode',
    priceId: 'price_1RtQQGQsKtdjWreV56y1dorc', // Production Firewall subscription
    price: 9.99,
    description: 'Complete protection and unlimited growth',
    features: [
      'No-Contact Tracker with daily check-in',
      'Shield window 48h + weekly auto-shield',
      '2 rituals/day science-weighted to your archetype',
      'Unlimited reroll on rituals',
      'Wall of Wounds™ - Unlimited posting, edit & delete',
      'AI Therapy Chat included (1,000 msgs/month)',
      'AI Voice Therapy ($4.99/15 min, 3 personas)',
      'Unlimited XP & Levels',
      'Earn & spend Bytes + all badges + secret quests'
    ],
    limits: {
      shieldWindowHours: 48,
      dailyRituals: 2,
      maxLevel: -1, // unlimited
      aiTherapyIncluded: true,
      aiTherapyMessagesPerMonth: 1000,
      voiceTherapyPrice: 4.99, // per 15 min
      wallPosting: true,
      wallEditing: true,
      voiceTherapy: true,
      autoShield: true,
      unlimitedReroll: true,
      ritualArchetypeWeighted: true
    }
  }
} as const;

// AI Therapy Product Configuration
export const AI_THERAPY_CONFIG = {
  priceId: 'price_1RtT7SJOZTvNXQXGi7jUm5Dw', // Production AI Therapy price
  price: 3.99,
  messagesIncluded: 300,
  name: 'AI Therapy Session',
  description: '300 AI therapy messages for $3.99'
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS;

// Feature gate checking
export function hasFeatureAccess(
  userTier: string,
  feature: string
): boolean {
  const tier = userTier.toUpperCase() as SubscriptionTier;
  
  if (tier === 'PREMIUM') {
    const limits = SUBSCRIPTION_PLANS.PREMIUM.limits;
    if (feature in limits) {
      const value = limits[feature as keyof typeof limits];
      return typeof value === 'boolean' ? value : true;
    }
  }
  
  // For free tier, check specific limits
  if (tier === 'FREE') {
    const limits = SUBSCRIPTION_PLANS.FREE.limits;
    if (feature in limits) {
      const value = limits[feature as keyof typeof limits];
      return typeof value === 'boolean' ? value : true;
    }
  }
  
  return false;
}

// Usage limit checking for AI therapy messages
export function getRemainingAIMessages(
  userTier: string,
  currentUsage: number
): number {
  const tier = userTier.toUpperCase() as SubscriptionTier;
  
  if (tier === 'PREMIUM') {
    const limit = SUBSCRIPTION_PLANS.PREMIUM.limits.aiTherapyMessagesPerMonth;
    return Math.max(0, limit - currentUsage);
  }
  
  // Free tier pays per session, no monthly limit
  return 0;
}

// Check if user can access voice therapy
export function canAccessVoiceTherapy(userTier: string): boolean {
  const tier = userTier.toUpperCase() as SubscriptionTier;
  return tier === 'PREMIUM' && SUBSCRIPTION_PLANS.PREMIUM.limits.voiceTherapy;
}

// Get pricing for pay-per-use features
export function getPayPerUsePrice(feature: 'aiTherapySession' | 'voiceTherapy'): number {
  if (feature === 'aiTherapySession') {
    return SUBSCRIPTION_PLANS.FREE.limits.aiTherapySessionPrice;
  }
  if (feature === 'voiceTherapy') {
    return SUBSCRIPTION_PLANS.PREMIUM.limits.voiceTherapyPrice || 4.99;
  }
  return 0;
}
