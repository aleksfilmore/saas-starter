// Complete Database Schema for SaaS Starter with Gamification
import { pgTable, text, timestamp, integer, boolean, varchar } from 'drizzle-orm/pg-core';

// =====================================
// AUTHENTICATION TABLES
// =====================================

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashedPassword: text('password_hash').notNull(),
  
  // Identity & Onboarding
  username: text('username').unique(),
  avatar: text('avatar'),
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  
  // Password Reset
  resetToken: text('reset_token'),
  resetTokenExpiry: timestamp('reset_token_expiry', { withTimezone: true, mode: 'date' }),
  
  // Subscription & Gamification
  subscriptionTier: text('subscription_tier').notNull().default('ghost_mode'),
  xpPoints: integer('xp_points').notNull().default(0),
  byteBalance: integer('byte_balance').notNull().default(100),
  glowUpLevel: integer('glow_up_level').notNull().default(1),
  
  // Admin & Status
  isAdmin: boolean('is_admin').notNull().default(false),
  isBanned: boolean('is_banned').notNull().default(false),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true, mode: 'date' }),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

// =====================================
// NO CONTACT TRACKER TABLES
// =====================================

export const noContactPeriods = pgTable('no_contact_periods', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  contactName: text('contact_name').notNull(),
  startDate: timestamp('start_date', { withTimezone: true, mode: 'date' }).notNull(),
  targetDays: integer('target_days').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  streakShieldsUsed: integer('streak_shields_used').notNull().default(0),
  maxStreakShieldsPerWeek: integer('max_streak_shields_per_week').notNull().default(2),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const noContactBreaches = pgTable('no_contact_breaches', {
  id: text('id').primaryKey(),
  periodId: text('period_id').notNull().references(() => noContactPeriods.id),
  breachDate: timestamp('breach_date', { withTimezone: true, mode: 'date' }).notNull(),
  breachType: text('breach_type').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const dailyCheckIns = pgTable('daily_check_ins', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  periodId: text('period_id').notNull().references(() => noContactPeriods.id),
  checkInDate: timestamp('check_in_date', { withTimezone: true, mode: 'date' }).notNull(),
  didTextTrash: boolean('did_text_trash').notNull().default(false),
  mood: integer('mood').notNull(),
  hadIntrusiveThoughts: boolean('had_intrusive_thoughts').notNull().default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// =====================================
// RITUAL SYSTEM TABLES
// =====================================

export const dailyRituals = pgTable('daily_rituals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  targetFrequency: text('target_frequency').notNull().default('daily'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const ritualCompletions = pgTable('ritual_completions', {
  id: text('id').primaryKey(),
  ritualId: text('ritual_id').notNull().references(() => dailyRituals.id),
  userId: text('user_id').notNull().references(() => users.id),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }).notNull(),
  notes: text('notes'),
  mood: integer('mood'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const userDailyPrescriptions = pgTable('user_daily_prescriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  prescribedDate: timestamp('prescribed_date', { withTimezone: true, mode: 'date' }).notNull(),
  ritualKey: text('ritual_key').notNull(),
  shufflesUsed: integer('shuffles_used').notNull().default(0),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }),
  completionNotes: text('completion_notes'),
  completionMood: integer('completion_mood'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// =====================================
// WALL OF WOUNDS TABLES
// =====================================

export const anonymousPosts = pgTable('anonymous_posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  content: text('content').notNull(),
  glitchTitle: text('glitch_title'),
  glitchCategory: text('glitch_category').notNull().default('general'),
  category: text('category').notNull().default('general'),
  glitchOverlay: text('glitch_overlay'),
  hearts: integer('hearts').notNull().default(0),
  resonateCount: integer('resonate_count').notNull().default(0),
  sameLoopCount: integer('same_loop_count').notNull().default(0),
  draggedMeTooCount: integer('dragged_me_too_count').notNull().default(0),
  stoneColdCount: integer('stone_cold_count').notNull().default(0),
  cleansedCount: integer('cleansed_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  bytesEarned: integer('bytes_earned').notNull().default(25),
  isActive: boolean('is_active').notNull().default(true),
  isAnonymous: boolean('is_anonymous').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  isOraclePost: boolean('is_oracle_post').notNull().default(false),
  isViralAwarded: boolean('is_viral_awarded').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const wallPostReactions = pgTable('wall_post_reactions', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => anonymousPosts.id),
  userId: text('user_id').notNull().references(() => users.id),
  reactionType: text('reaction_type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const wallPostComments = pgTable('wall_post_comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => anonymousPosts.id),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  parentCommentId: text('parent_comment_id'),
  bytesEarned: integer('bytes_earned').notNull().default(5),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// =====================================
// GAMIFICATION TABLES
// =====================================

export const badges = pgTable('badges', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  iconUrl: text('icon_url').notNull(),
  category: text('category').notNull(),
  tier: text('tier').notNull().default('bronze'),
  rarity: text('rarity').notNull().default('common'),
  xpReward: integer('xp_reward').notNull().default(0),
  byteReward: integer('byte_reward').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const userBadges = pgTable('user_badges', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  badgeId: text('badge_id').notNull().references(() => badges.id),
  earnedAt: timestamp('earned_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const xpTransactions = pgTable('xp_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(),
  source: text('source').notNull(),
  description: text('description').notNull(),
  relatedId: text('related_id'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const byteTransactions = pgTable('byte_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  amount: integer('amount').notNull(),
  source: text('source').notNull(),
  description: text('description').notNull(),
  relatedId: text('related_id'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// =====================================
// TYPE EXPORTS
// =====================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type NoContactPeriod = typeof noContactPeriods.$inferSelect;
export type NewNoContactPeriod = typeof noContactPeriods.$inferInsert;
export type NoContactBreach = typeof noContactBreaches.$inferSelect;
export type NewNoContactBreach = typeof noContactBreaches.$inferInsert;
export type DailyCheckIn = typeof dailyCheckIns.$inferSelect;
export type NewDailyCheckIn = typeof dailyCheckIns.$inferInsert;
export type DailyRitual = typeof dailyRituals.$inferSelect;
export type NewDailyRitual = typeof dailyRituals.$inferInsert;
export type RitualCompletion = typeof ritualCompletions.$inferSelect;
export type NewRitualCompletion = typeof ritualCompletions.$inferInsert;
export type UserDailyPrescription = typeof userDailyPrescriptions.$inferSelect;
export type NewUserDailyPrescription = typeof userDailyPrescriptions.$inferInsert;
export type AnonymousPost = typeof anonymousPosts.$inferSelect;
export type NewAnonymousPost = typeof anonymousPosts.$inferInsert;
export type WallPostReaction = typeof wallPostReactions.$inferSelect;
export type NewWallPostReaction = typeof wallPostReactions.$inferInsert;
export type WallPostComment = typeof wallPostComments.$inferSelect;
export type NewWallPostComment = typeof wallPostComments.$inferInsert;
export type Badge = typeof badges.$inferSelect;
export type NewBadge = typeof badges.$inferInsert;
export type UserBadge = typeof userBadges.$inferSelect;
export type NewUserBadge = typeof userBadges.$inferInsert;
export type XpTransaction = typeof xpTransactions.$inferSelect;
export type NewXpTransaction = typeof xpTransactions.$inferInsert;
export type ByteTransaction = typeof byteTransactions.$inferSelect;
export type NewByteTransaction = typeof byteTransactions.$inferInsert;
