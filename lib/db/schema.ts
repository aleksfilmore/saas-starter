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
  avatar: text('avatar'), // System icon identifier
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  
  // Subscription & Gamification
  subscriptionTier: text('subscription_tier').notNull().default('ghost_mode'), // ghost_mode, firewall_mode, cult_leader
  xpPoints: integer('xp_points').notNull().default(0),
  byteBalance: integer('byte_balance').notNull().default(100), // Start with 100 Bytes
  glowUpLevel: integer('glow_up_level').notNull().default(1),
  
  // Admin & Moderation
  isAdmin: boolean('is_admin').notNull().default(false),
  isBanned: boolean('is_banned').notNull().default(false),
  lastActiveAt: timestamp('last_active_at', {
    withTimezone: true,
    mode: 'date',
  }),
  
  // Timestamps
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Lucia auth sessions table (new for auth system)
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')  // Changed from integer to text to match users.id
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

// No Contact Tracker tables
export const noContactPeriods = pgTable('no_contact_periods', {
  id: text('id').primaryKey(),
  userId: text('user_id')  // Changed from integer to text
    .notNull()
    .references(() => users.id),
  contactName: text('contact_name').notNull(),
  startDate: timestamp('start_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  targetDays: integer('target_days').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  streakShieldsUsed: integer('streak_shields_used').notNull().default(0),
  maxStreakShieldsPerWeek: integer('max_streak_shields_per_week').notNull().default(1),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

export const noContactBreaches = pgTable('no_contact_breaches', {
  id: text('id').primaryKey(),
  periodId: text('period_id')
    .notNull()
    .references(() => noContactPeriods.id),
  breachDate: timestamp('breach_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  breachType: text('breach_type').notNull(), // 'call', 'text', 'social_media', 'in_person', 'other'
  notes: text('notes'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Daily Rituals tables
export const dailyRituals = pgTable('daily_rituals', {
  id: text('id').primaryKey(),
  userId: text('user_id')  // Changed from integer to text
    .notNull()
    .references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(), // 'morning', 'evening', 'self_care', 'fitness', 'mindfulness', 'creativity', 'productivity'
  targetFrequency: text('target_frequency').notNull().default('daily'), // 'daily', 'weekly', 'custom'
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

export const ritualCompletions = pgTable('ritual_completions', {
  id: text('id').primaryKey(),
  ritualId: text('ritual_id')
    .notNull()
    .references(() => dailyRituals.id),
  completedAt: timestamp('completed_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  notes: text('notes'),
  mood: integer('mood'), // 1-5 scale
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Daily Prescribed Rituals
export const userDailyPrescriptions = pgTable('user_daily_prescriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  prescribedDate: timestamp('prescribed_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  ritualKey: text('ritual_key').notNull(), // Key to identify the prescribed ritual
  shufflesUsed: integer('shuffles_used').notNull().default(0),
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at', {
    withTimezone: true,
    mode: 'date',
  }),
  completionNotes: text('completion_notes'),
  completionMood: integer('completion_mood'), // 1-5 scale
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Daily Check-ins for No Contact Tracker
export const dailyCheckIns = pgTable('daily_check_ins', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  periodId: text('period_id')
    .notNull()
    .references(() => noContactPeriods.id),
  checkInDate: timestamp('check_in_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  didTextTrash: boolean('did_text_trash').notNull().default(false),
  mood: integer('mood').notNull(), // 1-5 scale
  hadIntrusiveThoughts: boolean('had_intrusive_thoughts').notNull().default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Anonymous Wall Posts (Enhanced Confessional Wall)
export const anonymousPosts = pgTable('anonymous_posts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.id), // Nullable for true anonymity
  content: text('content').notNull(),
  glitchTitle: text('glitch_title'), // Auto-generated titles like "Loop Detected", "Firewall Breach"
  glitchCategory: text('glitch_category').notNull().default('general'), // 'system_error', 'loop_detected', etc.
  category: text('category').notNull().default('general'), // 'heartbreak', 'relapse', 'ghosted', 'rage', 'nostalgia', 'shame'
  glitchOverlay: text('glitch_overlay'), // 'static', 'distorted_heart', 'crt_style'
  hearts: integer('hearts').notNull().default(0),
  resonateCount: integer('resonate_count').notNull().default(0),
  sameLoopCount: integer('same_loop_count').notNull().default(0),
  draggedMeTooCount: integer('dragged_me_too_count').notNull().default(0),
  stoneColdCount: integer('stone_cold_count').notNull().default(0),
  cleansedCount: integer('cleansed_count').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  bytesEarned: integer('bytes_earned').notNull().default(25), // Bytes earned from this post
  isActive: boolean('is_active').notNull().default(true),
  isAnonymous: boolean('is_anonymous').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false), // Daily Pulse featured
  isOraclePost: boolean('is_oracle_post').notNull().default(false), // Top weekly post
  isViralAwarded: boolean('is_viral_awarded').notNull().default(false), // Prevent duplicate viral rewards
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Wall Post Reactions (Enhanced with Glitch Reactions)
export const wallPostReactions = pgTable('wall_post_reactions', {
  id: text('id').primaryKey(),
  postId: text('post_id')
    .notNull()
    .references(() => anonymousPosts.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  reactionType: text('reaction_type').notNull(), // 'resonate', 'same_loop', 'dragged_me_too', 'stone_cold', 'cleansed'
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Wall Post Comments (Premium/Ultra Only)
export const wallPostComments = pgTable('wall_post_comments', {
  id: text('id').primaryKey(),
  postId: text('post_id')
    .notNull()
    .references(() => anonymousPosts.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(), // Max 140 characters
  parentCommentId: text('parent_comment_id')
    .references(() => wallPostComments.id), // For nested replies
  bytesEarned: integer('bytes_earned').notNull().default(5),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Cult Bubbles (Ultra-Exclusive Micro Communities)
export const cultBubbles = pgTable('cult_bubbles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id),
  description: text('description'),
  maxMembers: integer('max_members').notNull().default(3),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Cult Bubble Members
export const cultBubbleMembers = pgTable('cult_bubble_members', {
  id: text('id').primaryKey(),
  bubbleId: text('bubble_id')
    .notNull()
    .references(() => cultBubbles.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  role: text('role').notNull().default('member'), // 'creator', 'member'
  joinedAt: timestamp('joined_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Bubble Posts (Private Confessions within Bubbles)
export const bubblePosts = pgTable('bubble_posts', {
  id: text('id').primaryKey(),
  bubbleId: text('bubble_id')
    .notNull()
    .references(() => cultBubbles.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(),
  glitchTitle: text('glitch_title'),
  category: text('category').notNull().default('general'),
  reactionCount: integer('reaction_count').notNull().default(0),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// XP Transactions (Track all XP earnings/spending)
export const xpTransactions = pgTable('xp_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  amount: integer('amount').notNull(), // Can be negative for spending
  source: text('source').notNull(), // 'ritual_complete', 'ai_tool_use', 'streak_bonus', 'badge_unlock'
  description: text('description').notNull(),
  relatedId: text('related_id'), // ID of ritual, tool use, etc.
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Byte Transactions (Track all Byte earnings/spending)
export const byteTransactions = pgTable('byte_transactions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  amount: integer('amount').notNull(), // Can be negative for spending
  source: text('source').notNull(), // 'wall_post', 'upvote_received', 'comment', 'purchase', 'donation'
  description: text('description').notNull(),
  relatedId: text('related_id'), // ID of post, purchase, etc.
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// AI Generated Letters
export const aiLetters = pgTable('ai_letters', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  letterType: text('letter_type').notNull(), // 'breakup', 'closure', 'forgiveness', 'angry', 'sad'
  recipient: text('recipient').notNull(), // Who the letter is for
  emotion: text('emotion').notNull(), // User's current emotion
  scenario: text('scenario').notNull(), // Brief scenario context
  generatedContent: text('generated_content').notNull(),
  isPrivate: boolean('is_private').notNull().default(true),
  wasSent: boolean('was_sent').notNull().default(false),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Badges System
export const badges = pgTable('badges', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  iconUrl: text('icon_url').notNull(),
  category: text('category').notNull(), // 'streak', 'ritual', 'ai_usage', 'community', 'milestone'
  tier: text('tier').notNull().default('bronze'), // 'bronze', 'silver', 'gold', 'platinum', 'diamond'
  rarity: text('rarity').notNull().default('common'), // 'common', 'uncommon', 'rare', 'epic', 'legendary'
  xpReward: integer('xp_reward').notNull().default(0),
  byteReward: integer('byte_reward').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// User Badge Achievements
export const userBadges = pgTable('user_badges', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  badgeId: text('badge_id')
    .notNull()
    .references(() => badges.id),
  earnedAt: timestamp('earned_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
  metadata: text('metadata'), // JSON string for badge-specific data
});

// Admin Audit Log
export const adminAuditLog = pgTable('admin_audit_log', {
  id: text('id').primaryKey(),
  adminUserId: text('admin_user_id')
    .notNull()
    .references(() => users.id),
  action: text('action').notNull(), // 'user_tier_change', 'badge_grant', 'content_moderate', etc.
  targetUserId: text('target_user_id')
    .references(() => users.id),
  targetResourceId: text('target_resource_id'), // ID of post, ritual, etc. being acted upon
  oldValue: text('old_value'),
  newValue: text('new_value'),
  reason: text('reason'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NoContactPeriod = typeof noContactPeriods.$inferSelect;
export type NoContactBreach = typeof noContactBreaches.$inferSelect;
export type DailyRitual = typeof dailyRituals.$inferSelect;
export type RitualCompletion = typeof ritualCompletions.$inferSelect;
export type UserDailyPrescription = typeof userDailyPrescriptions.$inferSelect;
export type DailyCheckIn = typeof dailyCheckIns.$inferSelect;
export type AnonymousPost = typeof anonymousPosts.$inferSelect;
export type WallPostReaction = typeof wallPostReactions.$inferSelect;
export type WallPostComment = typeof wallPostComments.$inferSelect;
export type CultBubble = typeof cultBubbles.$inferSelect;
export type CultBubbleMember = typeof cultBubbleMembers.$inferSelect;
export type BubblePost = typeof bubblePosts.$inferSelect;
export type XpTransaction = typeof xpTransactions.$inferSelect;
export type ByteTransaction = typeof byteTransactions.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type AILetter = typeof aiLetters.$inferSelect;
