// CTRL+ALT+BLOCK™ — Badges-Only Gamification Schema (v2)
// Implements comprehensive badge system per spec

import { pgTable, text, timestamp, integer, boolean, varchar, jsonb } from 'drizzle-orm/pg-core';

// =====================================
// BADGES-ONLY GAMIFICATION TABLES
// =====================================

// Core badge definitions
export const badges = pgTable('badges', {
  id: text('id').primaryKey(), // G0, G1, F0, F1, X1, etc.
  code: text('code').notNull().unique(), // Same as id for lookups
  name: text('name').notNull(),
  description: text('description').notNull(),
  
  // Scope & Targeting
  tierScope: text('tier_scope').notNull(), // 'ghost' | 'firewall' | 'both'
  archetypeScope: text('archetype_scope'), // 'DF' | 'FB' | 'GS' | 'SN' | null for global
  
  // Visual & Art
  artUrl: text('art_url').notNull(),
  shareTemplateId: text('share_template_id'), // For social sharing cards
  
  // Rewards & Perks
  discountPercent: integer('discount_percent'), // 10, 15, 20, etc.
  discountCap: integer('discount_cap'), // Max value in cents (e.g. 4000 = €40)
  
  // System
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// User badge ownership and progress
export const userBadges = pgTable('user_badges', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  badgeId: text('badge_id').notNull().references(() => badges.id),
  
  // Progress & State
  earnedAt: timestamp('earned_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  appliedAsProfile: boolean('applied_as_profile').notNull().default(false),
  
  // Source tracking
  sourceEvent: text('source_event').notNull(), // 'check_in_completed', 'ritual_completed', etc.
  
  // Linked rewards
  discountCodeId: text('discount_code_id').references(() => discountCodes.id),
});

// Event log for badge evaluation (append-only audit trail)
export const badgeEvents = pgTable('badge_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  eventType: text('event_type').notNull(), // 'check_in_completed', 'ritual_completed', etc.
  payloadJson: jsonb('payload_json').notNull(), // Event-specific data
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// Shop discount codes generated from badges
export const discountCodes = pgTable('discount_codes', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(), // Generated coupon code
  
  // Value & Limits
  percent: integer('percent').notNull(), // 10, 15, 20, etc.
  capValue: integer('cap_value'), // Max discount in cents
  
  // Ownership & Usage
  userId: text('user_id').notNull().references(() => users.id),
  badgeId: text('badge_id').notNull().references(() => badges.id),
  redeemedAt: timestamp('redeemed_at', { withTimezone: true, mode: 'date' }),
  
  // System
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// Global settings for badge system
export const badgeSettings = pgTable('badge_settings', {
  key: text('key').primaryKey(), // 'streak_window_hours', 'game_cooldown_hours', etc.
  valueJson: jsonb('value_json').notNull(), // Flexible config storage
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// =====================================
// USER UPDATES FOR BADGES SYSTEM
// =====================================

// Users table needs archetype and profile badge
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashedPassword: text('password_hash').notNull(),
  
  // Identity & Profile
  username: text('username').unique(),
  
  // Badge System Core
  tier: text('tier').notNull().default('ghost'), // 'ghost' | 'firewall'
  archetype: text('archetype'), // 'DF' | 'FB' | 'GS' | 'SN' - set after quiz
  profileBadgeId: text('profile_badge_id').references(() => badges.id),
  
  // Notification Preferences
  emailOptIn: boolean('email_opt_in').notNull().default(true),
  timezone: text('timezone').default('UTC'),
  
  // Legacy fields (for migration compatibility)
  avatar: text('avatar'),
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  subscriptionTier: text('subscription_tier').notNull().default('ghost_mode'),
  // xpPoints & byteBalance removed in unified economy (bytes field in unified schema)
  glowUpLevel: integer('glow_up_level').notNull().default(1),
  
  // System
  isAdmin: boolean('is_admin').notNull().default(false),
  isBanned: boolean('is_banned').notNull().default(false),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true, mode: 'date' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// =====================================
// TYPE EXPORTS
// =====================================

export type Badge = typeof badges.$inferSelect;
export type NewBadge = typeof badges.$inferInsert;
export type UserBadge = typeof userBadges.$inferSelect;
export type NewUserBadge = typeof userBadges.$inferInsert;
export type BadgeEvent = typeof badgeEvents.$inferSelect;
export type NewBadgeEvent = typeof badgeEvents.$inferInsert;
export type DiscountCode = typeof discountCodes.$inferSelect;
export type NewDiscountCode = typeof discountCodes.$inferInsert;
export type BadgeSetting = typeof badgeSettings.$inferSelect;
export type NewBadgeSetting = typeof badgeSettings.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// =====================================
// ARCHETYPE DEFINITIONS
// =====================================

export const ARCHETYPES = {
  DF: {
    code: 'DF',
    name: 'Data Flooder',
    description: 'Anxious attachment - signal overflow, waveform patterns',
    colors: ['glitch-aqua', 'flowing-lines'],
    style: 'droplets'
  },
  FB: {
    code: 'FB', 
    name: 'Firewall Builder',
    description: 'Avoidant attachment - shields, grids, security patterns',
    colors: ['amber', 'oxide'],
    style: 'hard-edges'
  },
  GS: {
    code: 'GS',
    name: 'Ghost in the Shell',
    description: 'Fearful-avoidant attachment - masks, echoes, duality',
    colors: ['violet', 'indigo'],
    style: 'double-exposures'
  },
  SN: {
    code: 'SN',
    name: 'Secure Node',
    description: 'Secure attachment - lattice, anchors, stable geometry',
    colors: ['teal', 'emerald'],
    style: 'stable-geometry'
  }
} as const;

export type ArchetypeCode = keyof typeof ARCHETYPES;

// =====================================
// BADGE CATALOG (as per spec)
// =====================================

export const BADGE_CATALOG = [
  // Ghost Tier (Free) - 4 total per user
  {
    id: 'G0_DF',
    code: 'G0',
    name: 'Data Stream Embryo',
    description: 'Your journey begins - the first flicker of signal in the void',
    tierScope: 'ghost',
    archetypeScope: 'DF',
    unlock: 'assigned_at_onboarding'
  },
  {
    id: 'G0_FB',
    code: 'G0', 
    name: 'Protocol Genesis',
    description: 'First firewall protocols initializing - protection begins here',
    tierScope: 'ghost',
    archetypeScope: 'FB',
    unlock: 'assigned_at_onboarding'
  },
  {
    id: 'G0_GS',
    code: 'G0',
    name: 'Shell Fragment',
    description: 'First echo in the digital void - identity forming in shadows',
    tierScope: 'ghost',
    archetypeScope: 'GS', 
    unlock: 'assigned_at_onboarding'
  },
  {
    id: 'G0_SN',
    code: 'G0',
    name: 'Foundation Node',
    description: 'Stable anchor point established - your secure base in the network',
    tierScope: 'ghost',
    archetypeScope: 'SN',
    unlock: 'assigned_at_onboarding'
  },
  {
    id: 'G1',
    code: 'G1',
    name: 'Streak Spark',
    description: 'Seven days of no-contact discipline - the first spark of control',
    tierScope: 'ghost',
    archetypeScope: null,
    unlock: '7_consecutive_checkins',
    discountPercent: null
  },
  {
    id: 'G2', 
    code: 'G2',
    name: 'Ritual Rookie',
    description: 'Ten rituals completed with authentic journaling - discipline taking root',
    tierScope: 'ghost',
    archetypeScope: null,
    unlock: '10_ritual_completions',
    discountPercent: null
  },
  {
    id: 'G3',
    code: 'G3', 
    name: 'Quiet Momentum',
    description: 'Five days of mindful wall engagement - learning through observation',
    tierScope: 'ghost',
    archetypeScope: null,
    unlock: '5_wall_reaction_days',
    discountPercent: 10 // First discount unlock
  },
  // Firewall Swap Badges
  {
    id: 'F_SWAP_1',
    code: 'F_SWAP_1',
    name: 'Adaptive Shift',
    description: 'Performed first ritual swap to optimize healing flow',
    tierScope: 'firewall',
    archetypeScope: null,
    unlock: '1_ritual_swap'
  },
  {
    id: 'F_SWAP_10',
    code: 'F_SWAP_10',
    name: 'Strategic Reconstructor',
    description: 'Completed 10 ritual swaps demonstrating adaptive strategy',
    tierScope: 'firewall',
    archetypeScope: null,
    unlock: '10_ritual_swaps'
  }
] as const;
