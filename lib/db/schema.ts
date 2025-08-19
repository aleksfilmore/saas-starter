// Complete Database Schema for SaaS Starter with Gamification
import { pgTable, text, timestamp, integer, boolean, varchar, index } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';

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
  
  // User Tier System (Dev Brief Requirements)
  tier: text('tier').notNull().default('freemium'), // freemium | paid
  status: text('status').notNull().default('active'), // active | cancelled | trialing
  currentProtocol: text('current_protocol'), // 30-day | 90-day | null
  protocolDay: integer('protocol_day').notNull().default(0),
  dashboardType: text('dashboard_type').notNull().default('freemium'), // freemium | paid_beginner | paid_advanced
  
  // Emotional Profile
  emotionalArchetype: text('emotional_archetype'), // "Data Flooder", "Firewall Builder", etc.
  codename: text('codename'),
  avatarStyle: text('avatar_style'),
  
  // Gamification & Progress
  xp: integer('xp').notNull().default(0),
  bytes: integer('bytes').notNull().default(100),
  level: integer('level').notNull().default(1),
  streak: integer('streak').notNull().default(0),
  streakDays: integer('streak_days').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  noContactDays: integer('no_contact_days').notNull().default(0),
  
  // No-Contact Check-In Tracking
  lastNoContactCheckin: timestamp('last_no_contact_checkin', { withTimezone: true, mode: 'date' }),
  noContactStreakThreatened: boolean('no_contact_streak_threatened').notNull().default(false),
  
  // Legacy fields (keeping for backward compatibility)
  subscriptionTier: text('subscription_tier').notNull().default('ghost_mode'),
  xpPoints: integer('xp_points').notNull().default(0),
  byteBalance: integer('byte_balance').notNull().default(100),
  glowUpLevel: integer('glow_up_level').notNull().default(1),
  uxStage: text('ux_stage').default('newcomer'), // newcomer, established, veteran, system_admin
  
  // AI Therapy quota system
  aiQuotaUsed: integer('ai_quota_used').notNull().default(0),
  aiQuotaResetAt: timestamp('ai_quota_reset_at', { withTimezone: true, mode: 'date' }),
  
  // History tracking (JSON arrays)
  ritualHistory: text('ritual_history').default('[]'), // JSON array of completed rituals
  therapyHistory: text('therapy_history').default('[]'), // JSON array of therapy sessions
  shopInventory: text('shop_inventory').default('[]'), // JSON array of purchased items
  badges: text('badges').default('[]'), // JSON array of earned badge IDs
  
  // Timestamps
  lastRitualCompleted: timestamp('last_ritual_completed', { withTimezone: true, mode: 'date' }),
  lastLogin: timestamp('last_login', { withTimezone: true, mode: 'date' }),
  
  // Admin & Status
  isAdmin: boolean('is_admin').notNull().default(false),
  isBanned: boolean('is_banned').notNull().default(false),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true, mode: 'date' }),
  
  // Email Preferences
  emailNotifications: boolean('email_notifications').notNull().default(true),
  
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

// Dashboard 2.0 Rituals Table
export const rituals = pgTable('rituals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(), // emotional_regulation, mindfulness, etc.
  intensity: integer('intensity').notNull().default(1), // 1-5 scale
  duration: integer('duration').notNull().default(10), // minutes
  isCompleted: boolean('is_completed').notNull().default(false),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }),
  isReroll: boolean('is_reroll').notNull().default(false), // true if generated via reroll
  xpReward: integer('xp_reward').notNull().default(50),
  bytesReward: integer('bytes_reward').notNull().default(25),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// =====================================
// RITUAL LIBRARY (Free Ritual Bank)
// =====================================

export const ritualLibrary = pgTable('ritual_library', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  duration: text('duration'),
  difficulty: text('difficulty'),
  journal_prompt: text('journal_prompt'),
  lesson: text('lesson'),
  steps: text('steps').array(), // JSON array of strings
  archetype: text('archetype'),
  tier_requirement: text('tier_requirement'),
  is_premium: boolean('is_premium').default(false),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// =====================================
// RITUAL JOURNAL ENTRIES
// =====================================

export const ritualEntries = pgTable('ritual_entries', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  ritualCode: varchar('ritual_code', { length: 64 }).notNull(), // 'breath_firewall', 'digital_detox', etc.
  ritualTitle: varchar('ritual_title', { length: 128 }), // Store title for reference
  performedAt: timestamp('performed_at', { withTimezone: true }).defaultNow(),
  
  // Journal data
  mood: integer('mood'), // 1-7 scale
  whatIDid: text('what_i_did'), // "What did you do?"
  howIFeel: text('how_i_feel'), // "How do you feel now?"
  tags: varchar('tags', { length: 256 }), // comma-separated tags for premium users
  source: varchar('source', { length: 16 }).$type<'text'|'voice'>().default('text'),
  
  // Metadata
  timeSpent: integer('time_spent_seconds'), // Track dwell time for XP validation
  textLength: integer('text_length'), // Combined length for XP validation
  xpAwarded: integer('xp_awarded').default(0), // Track XP given for this entry
  bytesAwarded: integer('bytes_awarded').default(0), // Track Bytes given for this entry
  
  // AI & Analysis (for premium users)
  tokensUsed: integer('tokens_used').default(0), // for AI digest accounting
  summaryId: text('summary_id'), // link to weekly summary
  sentiment: varchar('sentiment', { length: 16 }), // positive, neutral, negative
  
  // Audit
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'), // soft delete
}, (t) => ({
  byUserDate: index().on(t.userId, t.performedAt),
  byUserRitual: index().on(t.userId, t.ritualCode),
  byUserCreated: index().on(t.userId, t.createdAt),
}));

// Journal drafts for autosave and recovery
export const journalDrafts = pgTable('journal_drafts', {
  id: text('id').primaryKey(), // Format: userId_ritualId_assignmentId
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  ritualId: text('ritual_id').notNull(),
  assignmentId: integer('assignment_id'), // Nullable for non-assignment rituals
  text: text('text').notNull(),
  timingSeconds: integer('timing_seconds').notNull().default(0),
  lastSaved: timestamp('last_saved', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
}, (t) => ({
  byUserRitual: index().on(t.userId, t.ritualId),
  byUserSaved: index().on(t.userId, t.lastSaved),
}));

// Weekly AI summaries for premium users
export const weeklySummaries = pgTable('weekly_summaries', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  weekStart: timestamp('week_start').notNull(), // Monday of the week
  weekEnd: timestamp('week_end').notNull(), // Sunday of the week
  
  // AI-generated content
  bullets: text('bullets'), // JSON array of 3 key insights
  sentimentAvg: integer('sentiment_avg'), // 1-7 average mood for the week
  nextSuggestion: text('next_suggestion'), // AI suggested next ritual
  entryCount: integer('entry_count').default(0), // Number of entries analyzed
  
  // Metadata
  tokensUsed: integer('tokens_used').default(0),
  generatedAt: timestamp('generated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => ({
  byUserWeek: index().on(t.userId, t.weekStart),
}));

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
// CONTENT MODERATION TABLES
// =====================================

export const moderationQueue = pgTable('moderation_queue', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => anonymousPosts.id),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  flagReason: text('flag_reason').notNull(),
  severity: text('severity').notNull(), // 'low', 'medium', 'high'
  status: text('status').notNull().default('pending'), // 'pending', 'approved', 'rejected', 'edited'
  suggestedAction: text('suggested_action').notNull(), // 'approve', 'flag', 'reject', 'edit'
  detectedIssues: text('detected_issues'), // JSON array of issues
  moderatorId: text('moderator_id').references(() => users.id),
  moderatorNotes: text('moderator_notes'),
  moderatedAt: timestamp('moderated_at', { withTimezone: true, mode: 'date' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const moderationLogs = pgTable('moderation_logs', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => anonymousPosts.id),
  action: text('action').notNull(), // 'auto_flagged', 'auto_approved', 'manual_approved', 'manual_rejected', 'edited'
  moderatorId: text('moderator_id').references(() => users.id), // null for auto actions
  reason: text('reason'),
  previousContent: text('previous_content'),
  newContent: text('new_content'),
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
// VOICE THERAPY TABLES
// =====================================

export const voiceTherapyCredits = pgTable('voice_therapy_credits', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  minutesPurchased: integer('minutes_purchased').notNull(),
  minutesRemaining: integer('minutes_remaining').notNull(),
  purchaseDate: timestamp('purchase_date', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  expiryDate: timestamp('expiry_date', { withTimezone: true, mode: 'date' }).notNull(), // 30 days from purchase
  stripeSessionId: text('stripe_session_id'),
  isActive: boolean('is_active').notNull().default(true),
});

export const voiceTherapySessions = pgTable('voice_therapy_sessions', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  userId: text('user_id').notNull().references(() => users.id),
  creditId: text('credit_id').notNull().references(() => voiceTherapyCredits.id),
  minutesUsed: integer('minutes_used').notNull(),
  sessionStart: timestamp('session_start', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  sessionEnd: timestamp('session_end', { withTimezone: true, mode: 'date' }),
  persona: text('persona'), // which AI persona was used
  summary: text('summary'), // session summary
});

// =====================================
// ANALYTICS & TRACKING TABLES
// =====================================

export const analyticsEvents = pgTable('analytics_events', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  sessionId: text('session_id'),
  event: text('event').notNull(),
  properties: text('properties'), // JSON string
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  userAgent: text('user_agent'),
  ip: text('ip'),
  referer: text('referer'),
});

export const userSessions = pgTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  sessionId: text('session_id').notNull().unique(),
  startTime: timestamp('start_time', { withTimezone: true, mode: 'date' }).notNull(),
  lastActivity: timestamp('last_activity', { withTimezone: true, mode: 'date' }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true, mode: 'date' }),
  deviceType: text('device_type'),
  browser: text('browser'),
  os: text('os'),
});

export const conversionFunnels = pgTable('conversion_funnels', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  funnelName: text('funnel_name').notNull(),
  stage: text('stage').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  properties: text('properties'), // JSON string
});

export const referrals = pgTable('referrals', {
  id: text('id').primaryKey(),
  referrerId: text('referrer_id').notNull(),
  refereeId: text('referee_id'),
  referralCode: text('referral_code').notNull().unique(),
  status: text('status').notNull().default('pending'), // pending | completed | rewarded
  rewardType: text('reward_type'), // subscription_discount | bonus_credits
  rewardAmount: integer('reward_amount').default(0),
  clickedAt: timestamp('clicked_at', { withTimezone: true, mode: 'date' }),
  signedUpAt: timestamp('signed_up_at', { withTimezone: true, mode: 'date' }),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const subscriptionEvents = pgTable('subscription_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  eventType: text('event_type').notNull(), // created | updated | cancelled | payment_succeeded | payment_failed
  planId: text('plan_id'),
  amount: integer('amount'), // in cents
  currency: text('currency').default('usd'),
  status: text('status'),
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  metadata: text('metadata'), // JSON string
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
export type ModerationQueue = typeof moderationQueue.$inferSelect;
export type NewModerationQueue = typeof moderationQueue.$inferInsert;
export type ModerationLog = typeof moderationLogs.$inferSelect;
export type NewModerationLog = typeof moderationLogs.$inferInsert;
export type Badge = typeof badges.$inferSelect;
export type NewBadge = typeof badges.$inferInsert;
export type UserBadge = typeof userBadges.$inferSelect;
export type NewUserBadge = typeof userBadges.$inferInsert;
export type XpTransaction = typeof xpTransactions.$inferSelect;
export type NewXpTransaction = typeof xpTransactions.$inferInsert;
export type ByteTransaction = typeof byteTransactions.$inferSelect;
export type NewByteTransaction = typeof byteTransactions.$inferInsert;
export type VoiceTherapyCredit = typeof voiceTherapyCredits.$inferSelect;
export type NewVoiceTherapyCredit = typeof voiceTherapyCredits.$inferInsert;
export type VoiceTherapySession = typeof voiceTherapySessions.$inferSelect;
export type NewVoiceTherapySession = typeof voiceTherapySessions.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;
export type ConversionFunnel = typeof conversionFunnels.$inferSelect;
export type NewConversionFunnel = typeof conversionFunnels.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;
export type SubscriptionEvent = typeof subscriptionEvents.$inferSelect;
export type NewSubscriptionEvent = typeof subscriptionEvents.$inferInsert;

// Journal types
export type RitualEntry = typeof ritualEntries.$inferSelect;
export type NewRitualEntry = typeof ritualEntries.$inferInsert;
export type JournalDraft = typeof journalDrafts.$inferSelect;
export type NewJournalDraft = typeof journalDrafts.$inferInsert;
export type WeeklySummary = typeof weeklySummaries.$inferSelect;
export type NewWeeklySummary = typeof weeklySummaries.$inferInsert;
