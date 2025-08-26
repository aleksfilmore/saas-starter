/**
 * Analytics Events System
 * Tracks user behavior and business metrics
 */

export interface AnalyticsEvent {
  userId?: string;
  sessionId?: string;
  event: string;
  properties?: Record<string, any>;
  timestamp?: Date;
  userAgent?: string;
  ip?: string;
  referer?: string;
}

// Event categories for better organization
export const EventCategories = {
  USER: 'user',
  SUBSCRIPTION: 'subscription', 
  FEATURE: 'feature',
  CONVERSION: 'conversion',
  ENGAGEMENT: 'engagement',
  RETENTION: 'retention'
} as const;

// Predefined events for consistency
export const AnalyticsEvents = {
  // User lifecycle
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  USER_DELETED_ACCOUNT: 'user_deleted_account',
  
  // Onboarding flow
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_ABANDONED: 'onboarding_abandoned',
  
  // Subscription events
  SUBSCRIPTION_PLAN_VIEWED: 'subscription_plan_viewed',
  SUBSCRIPTION_CHECKOUT_STARTED: 'subscription_checkout_started',
  SUBSCRIPTION_CHECKOUT_COMPLETED: 'subscription_checkout_completed',
  SUBSCRIPTION_CHECKOUT_FAILED: 'subscription_checkout_failed',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  SUBSCRIPTION_RENEWED: 'subscription_renewed',
  
  // Feature usage
  AI_THERAPY_SESSION_STARTED: 'ai_therapy_session_started',
  AI_THERAPY_SESSION_COMPLETED: 'ai_therapy_session_completed',
  AI_THERAPY_MESSAGE_SENT: 'ai_therapy_message_sent',
  AI_THERAPY_PAYWALL_HIT: 'ai_therapy_paywall_hit',
  
  RITUAL_STARTED: 'ritual_started',
  RITUAL_COMPLETED: 'ritual_completed',
  RITUAL_REROLLED: 'ritual_rerolled',
  
  WALL_POST_CREATED: 'wall_post_created',
  WALL_POST_VIEWED: 'wall_post_viewed',
  WALL_POST_LIKED: 'wall_post_liked',
  WALL_POST_COMMENTED: 'wall_post_commented',
  WALL_CATEGORY_SELECTED: 'wall_category_selected',
  
  NO_CONTACT_SHIELD_ACTIVATED: 'no_contact_shield_activated',
  NO_CONTACT_CHECKIN_COMPLETED: 'no_contact_checkin_completed',
  
  // Engagement
  DAILY_LOGIN: 'daily_login',
  DASHBOARD_VIEWED: 'dashboard_viewed',
  DASHBOARD_TILE_IMPRESSION: 'dashboard_tile_impression',
  DASHBOARD_TILE_CLICK: 'dashboard_tile_click',
  PROFILE_UPDATED: 'profile_updated',
  SETTINGS_VIEWED: 'settings_viewed',
  
  // Conversion funnels
  PAYWALL_VIEWED: 'paywall_viewed',
  PAYWALL_UPGRADE_CLICKED: 'paywall_upgrade_clicked',
  PRICING_PAGE_VIEWED: 'pricing_page_viewed',
  FREE_TRIAL_STARTED: 'free_trial_started',
  
  // Referrals
  REFERRAL_LINK_GENERATED: 'referral_link_generated',
  REFERRAL_LINK_SHARED: 'referral_link_shared',
  REFERRAL_SIGNUP_COMPLETED: 'referral_signup_completed',
  REFERRAL_REWARD_EARNED: 'referral_reward_earned'
  ,BADGE_PROFILE_CHANGED: 'badge_profile_changed'
  ,NOTIFICATION_OPENED: 'notification_opened'
  ,CHECKIN_COMPLETED: 'checkin_completed'
  // Check-in multi-step granular
  ,CHECKIN_STEP_VIEWED: 'checkin_step_viewed'
  ,CHECKIN_STEP_COMPLETED: 'checkin_step_completed'
  ,CHECKIN_STARTED: 'checkin_started'
  // Daily action granular completions (dashboard checklist)
  ,DAILY_ACTION_CHECKIN_COMPLETED: 'daily_action_checkin_completed'
  ,DAILY_ACTION_NO_CONTACT_COMPLETED: 'daily_action_no_contact_completed'
  ,DAILY_ACTION_RITUAL_COMPLETED: 'daily_action_ritual_completed'
  ,DAILY_ACTION_WALL_INTERACT_COMPLETED: 'daily_action_wall_interact_completed'
  ,DAILY_ACTION_AI_CHAT_COMPLETED: 'daily_action_ai_chat_completed'
  ,DAILY_ACTION_WALL_POST_COMPLETED: 'daily_action_wall_post_completed'
  // Bytes economy specific (granular earning events)
  ,BYTES_EARNED_RITUAL: 'bytes_earned_ritual'
  ,BYTES_EARNED_RITUAL_GHOST: 'bytes_earned_ritual_ghost'
  ,BYTES_EARNED_DAILY_ACTION: 'bytes_earned_daily_action'
  ,BYTES_EARNED_AI_CHAT: 'bytes_earned_ai_chat'
  ,BYTES_EARNED_WALL_POST: 'bytes_earned_wall_post'
  ,BYTES_EARNED_WALL_INTERACT: 'bytes_earned_wall_interact'
  ,BYTES_EARNED_CHECKIN: 'bytes_earned_checkin'
  ,BYTES_EARNED_NO_CONTACT: 'bytes_earned_no_contact'
  // Generic emitted change (avoid high volume aggregation on client; sampled if needed)
  ,BYTES_BALANCE_UPDATED: 'bytes_balance_updated'
} as const;

// Feature usage tracking
export interface FeatureUsage {
  feature: string;
  category: string;
  userId: string;
  timestamp: Date;
  properties?: Record<string, any>;
}

// Conversion funnel stages
export const ConversionFunnels = {
  SIGN_UP: [
    'landing_page_viewed',
    'sign_up_started',
    'sign_up_completed',
    'onboarding_completed'
  ],
  SUBSCRIPTION: [
    'pricing_page_viewed',
    'plan_selected',
    'checkout_started',
    'payment_completed',
    'subscription_active'
  ],
  AI_THERAPY: [
    'ai_therapy_discovered',
    'ai_therapy_paywall_viewed',
    'ai_therapy_payment_started',
    'ai_therapy_session_started',
    'ai_therapy_session_completed'
  ]
} as const;

// User cohort definitions
export interface UserCohort {
  cohortId: string;
  name: string;
  definition: string;
  createdAt: Date;
  userCount: number;
}

// Retention metrics
export interface RetentionMetrics {
  day1: number;
  day7: number;
  day30: number;
  day90: number;
}

// Revenue metrics
export interface RevenueMetrics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  arpu: number; // Average Revenue Per User
  ltv: number; // Lifetime Value
  churnRate: number;
  cac: number; // Customer Acquisition Cost
}
