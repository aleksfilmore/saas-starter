// Enhanced Database Schema for REFORMAT PROTOCOL™
import { pgTable, text, timestamp, integer, boolean, varchar, decimal, json } from 'drizzle-orm/pg-core';

// =====================================
// ENHANCED USER SYSTEM
// =====================================

export const users = pgTable('users', {
  // Core auth
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashedPassword: text('password_hash').notNull(),
  
  // Identity & Profile
  codename: text('codename').unique(), // User-chosen alias
  avatar: text('avatar'), // Avatar selection or upload
  
  // Onboarding Data
  attachmentStyle: text('attachment_style'), // anxious, avoidant, secure, disorganized
  distressLevel: integer('distress_level').default(0), // 0-100 from BDI-5
  programPath: text('program_path').default('30-day'), // 30-day, 90-day
  onboardingCompleted: boolean('onboarding_completed').default(false),
  
  // Gamification Core
  // xpPoints removed (bytes-only economy)
  byteBalance: integer('byte_balance').default(100), // Starting bytes
  glowUpLevel: integer('glow_up_level').default(1),
  currentPhase: text('current_phase').default('kernel_wounded'), // Status label
  
  // Subscription & Features
  subscriptionTier: text('subscription_tier').default('ghost_mode'), // ghost_mode, firewall, cult_leader
  subscriptionStatus: text('subscription_status').default('active'),
  
  // Tracking & Streaks
  noContactStreak: integer('no_contact_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastContactDate: timestamp('last_contact_date', { withTimezone: true, mode: 'date' }),
  streakShields: integer('streak_shields').default(0), // Purchased protection
  
  // Settings & Preferences
  dailyRitualCount: integer('daily_ritual_count').default(1), // Based on tier
  emoTone: text('emo_tone').default('balanced'), // numb, vengeance, logic, help_others
  privacySettings: json('privacy_settings'), // Anonymous posting preferences
  
  // Admin & Status
  isAdmin: boolean('is_admin').default(false),
  isBanned: boolean('is_banned').default(false),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

// =====================================
// ONBOARDING & ASSESSMENTS
// =====================================

export const onboardingResponses = pgTable('onboarding_responses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  step: text('step').notNull(), // slider_scan, attachment_test, distress_index
  responses: json('responses').notNull(), // Store all answers
  scores: json('scores'), // Calculated scores
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

// =====================================
// RITUAL SYSTEM
// =====================================

export const ritualTemplates = pgTable('ritual_templates', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(), // purge_block, stabilize, rewrite, glow_up
  difficulty: text('difficulty').notNull(), // beginner, intermediate, advanced
  weekNumber: integer('week_number'), // For program progression
  phaseRequired: text('phase_required'), // Minimum phase to unlock
  tierRequired: text('tier_required').default('ghost_mode'), // Subscription requirement
  // xpReward removed (bytes only)
  byteReward: integer('byte_reward').default(5),
  estimatedTime: integer('estimated_time_minutes'),
  tags: json('tags'), // Array of tags for filtering
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const userRituals = pgTable('user_rituals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  ritualTemplateId: text('ritual_template_id').notNull().references(() => ritualTemplates.id),
  assignedDate: timestamp('assigned_date', { withTimezone: true, mode: 'date' }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }),
  mood: integer('mood'), // 1-10 pre/post mood
  postMood: integer('post_mood'),
  notes: text('notes'),
  xpEarned: integer('xp_earned').default(0),
  bytesEarned: integer('bytes_earned').default(0),
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

// =====================================
// WALL OF WOUNDS (CONFESSIONAL)
// =====================================

export const wallPosts = pgTable('wall_posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id), // Can be null for anonymous
  anonymousId: text('anonymous_id').notNull(), // Separate ID for anonymity
  content: text('content').notNull(),
  
  // Glitch Taxonomy
  glitchCategory: text('glitch_category').notNull(), // system_error, loop_detected, etc.
  glitchTitle: text('glitch_title').notNull(), // Generated titles like "5Y5T3M_3RR0R"
  
  // Reaction Counts
  resonateCount: integer('resonate_count').default(0),
  sameLoopCount: integer('same_loop_count').default(0),
  draggedMeTooCount: integer('dragged_me_too_count').default(0),
  stoneColdCount: integer('stone_cold_count').default(0),
  cleansedCount: integer('cleansed_count').default(0),
  commentCount: integer('comment_count').default(0),
  
  // Status & Moderation
  isOraclePost: boolean('is_oracle_post').default(false), // Highlighted posts
  isFeatured: boolean('is_featured').default(false),
  isHidden: boolean('is_hidden').default(false),
  moderationFlags: integer('moderation_flags').default(0),
  
  // Gamification
  bytesEarned: integer('bytes_earned').default(25), // For posting
  totalReactions: integer('total_reactions').default(0), // Cached sum
  
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const wallReactions = pgTable('wall_reactions', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => wallPosts.id),
  userId: text('user_id').notNull().references(() => users.id),
  reactionType: text('reaction_type').notNull(), // resonate, same_loop, dragged_me_too, stone_cold, cleansed
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const wallComments = pgTable('wall_comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => wallPosts.id),
  userId: text('user_id').notNull().references(() => users.id),
  anonymousId: text('anonymous_id').notNull(), // For anonymous commenting
  content: text('content').notNull(),
  parentCommentId: text('parent_comment_id'), // For threaded replies
  bytesEarned: integer('bytes_earned').default(5),
  isHidden: boolean('is_hidden').default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

// =====================================
// GAMIFICATION & PROGRESSION
// =====================================

export const xpTransactions = pgTable('xp_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(),
  source: text('source').notNull(), // ritual_completion, streak_bonus, wall_activity
  description: text('description').notNull(),
  relatedId: text('related_id'), // ID of ritual, post, etc.
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const byteTransactions = pgTable('byte_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(), // Can be negative for spending
  source: text('source').notNull(), // earned, spent, purchased
  description: text('description').notNull(),
  relatedId: text('related_id'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const badges = pgTable('badges', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  icon: text('icon').notNull(), // Icon identifier
  category: text('category').notNull(), // identity, ritual, streak, wall, progression
  rarity: text('rarity').default('common'), // common, rare, epic, legendary
  unlockCondition: json('unlock_condition'), // Conditions to earn badge
  // xpReward removed (bytes only)
  byteReward: integer('byte_reward').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const userBadges = pgTable('user_badges', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  badgeId: text('badge_id').notNull().references(() => badges.id),
  earnedAt: timestamp('earned_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  progress: json('progress'), // For multi-step badges
});

// =====================================
// AI TOOLS & USAGE
// =====================================

export const aiSessions = pgTable('ai_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  toolType: text('tool_type').notNull(), // closure_simulator, letter_generator, tarot, etc.
  input: text('input').notNull(),
  output: text('output').notNull(),
  tone: text('tone'), // rage_mode, sarcastic_coach, inner_parent
  bytesSpent: integer('bytes_spent').default(0),
  sessionDuration: integer('session_duration_seconds'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

export const aiUsageLimits = pgTable('ai_usage_limits', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  dailyUsage: integer('daily_usage').default(0),
  weeklyUsage: integer('weekly_usage').default(0),
  monthlyUsage: integer('monthly_usage').default(0),
  lastResetDate: timestamp('last_reset_date', { withTimezone: true, mode: 'date' }).defaultNow(),
});

// =====================================
// SUBSCRIPTION & PAYMENTS
// =====================================

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  tier: text('tier').notNull(), // ghost_mode, firewall, cult_leader
  status: text('status').notNull(), // active, cancelled, past_due
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true, mode: 'date' }),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true, mode: 'date' }),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow(),
});

// =====================================
// TYPE EXPORTS
// =====================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type RitualTemplate = typeof ritualTemplates.$inferSelect;
export type UserRitual = typeof userRituals.$inferSelect;
export type WallPost = typeof wallPosts.$inferSelect;
export type WallReaction = typeof wallReactions.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
