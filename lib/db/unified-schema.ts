// Consolidated unified schema. Based on legacy schema.ts (full product scope)
// plus added daily ritual tables & extra user columns (archetype, details, streak tracking, etc.).
// After migration, all imports should target this file.
import { pgTable, text, timestamp, integer, boolean, varchar, index, json, real, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';

// USERS (legacy + new columns for unified)
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

  // Tier / subscription (legacy + new)
  tier: text('tier').notNull().default('freemium'),
  status: text('status').notNull().default('active'),
  currentProtocol: text('current_protocol'),
  protocolDay: integer('protocol_day').notNull().default(0),
  dashboardType: text('dashboard_type').notNull().default('freemium'),
  subscriptionTier: text('subscription_tier').notNull().default('ghost_mode'),
  subscriptionStatus: text('subscription_status').default('free'),
  subscriptionExpires: timestamp('subscription_expires', { withTimezone: true, mode: 'date' }),

  // Emotional profile (new unified adds archetype fields)
  emotionalArchetype: text('emotional_archetype'),
  archetype: text('archetype'),
  archetypeDetails: json('archetype_details'),
  codename: text('codename'),
  avatarStyle: text('avatar_style'),

  // Gamification & Progress (XP/level removed – bytes only)
  bytes: integer('bytes').notNull().default(100),
  streak: integer('streak').notNull().default(0),
  streakDays: integer('streak_days').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  noContactDays: integer('no_contact_days').notNull().default(0),
  // Added unified counters
  ritualStreak: integer('ritual_streak').notNull().default(0),
  noContactStreak: integer('no_contact_streak').notNull().default(0),
  timezone: text('timezone').notNull().default('UTC'),
  // (Removed xpPoints / byteBalance duplicates – migration drops underlying columns)
  glowUpLevel: integer('glow_up_level').notNull().default(1),

  // No-contact tracking
  lastNoContactCheckin: timestamp('last_no_contact_checkin', { withTimezone: true, mode: 'date' }),
  noContactStreakThreatened: boolean('no_contact_streak_threatened').notNull().default(false),

  // AI Therapy quota
  aiQuotaUsed: integer('ai_quota_used').notNull().default(0),
  aiQuotaResetAt: timestamp('ai_quota_reset_at', { withTimezone: true, mode: 'date' }),

  // History JSON strings
  ritualHistory: text('ritual_history').default('[]'),
  therapyHistory: text('therapy_history').default('[]'),
  shopInventory: text('shop_inventory').default('[]'),
  badges: text('badges').default('[]'),

  // Activity timestamps
  lastRitualCompleted: timestamp('last_ritual_completed', { withTimezone: true, mode: 'date' }),
  lastLogin: timestamp('last_login', { withTimezone: true, mode: 'date' }),
  lastCheckin: timestamp('last_checkin', { withTimezone: true, mode: 'date' }),
  lastRitual: timestamp('last_ritual', { withTimezone: true, mode: 'date' }),

  // Admin / status
  isAdmin: boolean('is_admin').notNull().default(false),
  isBanned: boolean('is_banned').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  isVerified: boolean('is_verified').notNull().default(false),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true, mode: 'date' }),
  uxStage: text('ux_stage').default('newcomer'),

  // Email & verification
  emailNotifications: boolean('email_notifications').notNull().default(true),
  emailVerified: boolean('email_verified').notNull().default(false),
  emailVerificationToken: text('email_verification_token'),
  emailVerificationSentAt: timestamp('email_verification_sent_at', { withTimezone: true, mode: 'date' }),

  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

// === Daily Ritual (new unified tables) ===
export const dailyRitualAssignments = pgTable('daily_ritual_assignments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(()=> users.id),
  assignedDate: timestamp('assigned_date', { withTimezone: true, mode: 'date' }).notNull(),
  ritual1Id: text('ritual_1_id').notNull(),
  ritual2Id: text('ritual_2_id').notNull(),
  allocationMode: text('allocation_mode').notNull().default('guided'),
  userWeeksAtAssignment: integer('user_weeks_at_assignment').notNull().default(0),
  hasRerolled: boolean('has_rerolled').notNull().default(false),
  rerollUsedAt: timestamp('reroll_used_at', { withTimezone: true, mode: 'date' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const dailyRitualCompletions = pgTable('daily_ritual_completions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(()=> users.id),
  assignmentId: integer('assignment_id').notNull().references(()=> dailyRitualAssignments.id),
  ritualId: text('ritual_id').notNull(),
  journalText: text('journal_text').notNull(),
  moodRating: integer('mood_rating'),
  dwellTimeSeconds: integer('dwell_time_seconds').notNull().default(0),
  wordCount: integer('word_count').notNull().default(0),
  bytesEarned: integer('bytes_earned').notNull().default(0),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const userDailyState = pgTable('user_daily_state', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(()=> users.id),
  stateDate: timestamp('state_date', { withTimezone: true, mode: 'date' }).notNull(),
  ritualsCompletedToday: integer('rituals_completed_today').notNull().default(0),
  dailyCapReached: boolean('daily_cap_reached').notNull().default(false),
  hasRerolledToday: boolean('has_rerolled_today').notNull().default(false),
  streakDays: integer('streak_days').notNull().default(0),
  lastCompletionDate: timestamp('last_completion_date', { withTimezone: true, mode: 'date' }),
  timezone: text('timezone').notNull().default('UTC'),
  totalWeeksActive: integer('total_weeks_active').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const userRitualHistory = pgTable('user_ritual_history', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(()=> users.id),
  ritualId: text('ritual_id').notNull(),
  lastAssignedDate: timestamp('last_assigned_date', { withTimezone: true, mode: 'date' }).notNull(),
  completionCount: integer('completion_count').notNull().default(0),
});

export const dailyRitualEvents = pgTable('daily_ritual_events', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(()=> users.id),
  eventType: text('event_type').notNull(),
  eventData: text('event_data'), // store json string (simpler for merge)
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// Voice therapy credits (inlined to avoid undefined legacy re-export)
export const voiceTherapyCredits = pgTable('voice_therapy_credits', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(() => users.id),
  minutesPurchased: integer('minutes_purchased').notNull().default(0),
  minutesRemaining: integer('minutes_remaining').notNull().default(0),
  expiryDate: timestamp('expiry_date', { withTimezone: true, mode: 'date' }),
  isActive: boolean('is_active').notNull().default(true),
  purchaseDate: timestamp('purchase_date', { withTimezone: true, mode: 'date' }),
  stripeSessionId: text('stripe_session_id'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const voiceTherapySessions = pgTable('voice_therapy_sessions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(() => users.id),
  minutesUsed: integer('minutes_used').notNull().default(0),
  startedAt: timestamp('started_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  endedAt: timestamp('ended_at', { withTimezone: true, mode: 'date' }),
  transcript: text('transcript'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// Notifications (minimal)
export const notifications = pgTable('notifications', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  title: text('title'),
  message: text('message'),
  // Legacy column is_read retained; a separate 'read' boolean may also exist via reconciliation migration.
  // Prefer 'read' semantics in application layer; keep both mapped if needed.
  isRead: boolean('is_read').notNull().default(false),
  read: boolean('read'), // added via reconciliation migration if previously only is_read existed
  actionUrl: text('action_url'),
  actionText: text('action_text'),
  readAt: timestamp('read_at', { withTimezone: true, mode: 'date' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// User ritual swaps (tracks swap events / counts)
export const userRitualSwaps = pgTable('user_ritual_swaps', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(() => users.id),
  swapDate: timestamp('swap_date', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  reason: text('reason'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// Ghost user daily ritual assignment (stable per user per local date)
export const ghostDailyAssignments = pgTable('ghost_daily_assignments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id').notNull().references(()=> users.id),
  assignedDate: text('assigned_date').notNull(), // stored as YYYY-MM-DD in user local tz
  timezone: text('timezone').notNull().default('UTC'),
  ritualId: text('ritual_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// AI therapy message purchases (used for ghost-tier message bundles)
export const aiTherapyMessagePurchases = pgTable('ai_therapy_message_purchases', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(()=> users.id),
  messagesGranted: integer('messages_granted').notNull().default(0),
  messagesUsed: integer('messages_used').notNull().default(0),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// === Inlined legacy tables (phase 1) ===
// These replace temporary wrapper re-exports. Additional legacy tables will be
// migrated in subsequent passes until schema.ts can be deleted entirely.

// Ritual completions (legacy system – kept minimal; prefer daily_ritual_completions going forward)
export const ritualCompletions = pgTable('ritual_completions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  ritualId: text('ritual_id').notNull(),
  journalEntry: text('journal_entry'),
  mood: integer('mood'),
  bytesEarned: integer('bytes_earned').notNull().default(0),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// Analytics events
export const analyticsEventSourceEnum = pgEnum('analytics_event_source', ['checkin','no_contact','ritual','ritual_complete','wall_interact','ai_chat','wall_post','unknown']);

export const analyticsEvents = pgTable('analytics_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  sessionId: text('session_id'),
  event: text('event').notNull(),
  properties: jsonb('properties').notNull().default('{}'),
  source: analyticsEventSourceEnum('source').notNull().default('unknown'),
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  userAgent: text('user_agent'),
  ip: text('ip'),
  referer: text('referer'),
}, (table) => ({
  eventIdx: index('analytics_events_event_idx').on(table.event),
  eventTimeIdx: index('analytics_events_event_time_idx').on(table.event, table.timestamp),
  sourceIdx: index('analytics_events_source_idx').on(table.source),
  timeIdx: index('analytics_events_time_idx').on(table.timestamp)
}));

// User sessions for analytics (not auth sessions table above)
export const userSessions = pgTable('user_sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  sessionId: text('session_id').notNull().unique(),
  startTime: timestamp('start_time', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  lastActivity: timestamp('last_activity', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// Conversion funnel progression (simple append log)
export const conversionFunnels = pgTable('conversion_funnels', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  funnelName: text('funnel_name').notNull(),
  stage: text('stage').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  properties: text('properties').notNull().default('{}'),
});

// Subscription events (used for revenue metrics / audit trail)
export const subscriptionEvents = pgTable('subscription_events', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  type: text('type').notNull(), // e.g. checkout_completed, subscription_renewed
  amount: integer('amount'), // amount in cents (optional depending on event)
  currency: text('currency'),
  raw: text('raw'), // JSON string of provider payload
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// (Remaining legacy tables copied from previous schema.ts omitted here for brevity in patch)
// NOTE: We intentionally retained the original legacy tables in schema.ts; they should be
// moved or re-generated here in a full consolidation. For incremental step, we only needed
// the new ritual tables + user columns. (Follow-up: migrate remaining table definitions).

// Minimal exported types (add others as needed)
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type DailyRitualAssignment = typeof dailyRitualAssignments.$inferSelect;
export type DailyRitualCompletion = typeof dailyRitualCompletions.$inferSelect;
export type UserDailyState = typeof userDailyState.$inferSelect;
export type UserRitualHistory = typeof userRitualHistory.$inferSelect;

// TEMPORARY: Re-export remaining legacy schema pieces so we can progressively migrate
// and then inline them (next step) before deleting original schema.ts.
// IMPORTANT: Avoid hard crash on circular import (schema.ts re-exports this file).
// Use optional chaining so unresolved legacy module during early evaluation doesn't throw.
// TODO: Inline remaining legacy table definitions here and remove this section entirely.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - allow circular soft import
import * as legacy from './schema';

// Selected table re-exports (avoid duplicates already defined above)
// Provide explicit types to avoid implicit any (retain legacy table types)
// Temporary any-casted legacy re-exports (to be fully inlined then removed)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// Defensive wrappers: avoid accessing properties on undefined during circular load
export const noContactPeriods = (()=>{ try { return (legacy as any).noContactPeriods; } catch { return undefined as any; }})();
export const noContactBreaches = (()=>{ try { return (legacy as any).noContactBreaches; } catch { return undefined as any; }})();
export const dailyCheckIns = (()=>{ try { return (legacy as any).dailyCheckIns; } catch { return undefined as any; }})();
export const dailyRituals = (()=>{ try { return (legacy as any).dailyRituals; } catch { return undefined as any; }})();
export const userDailyPrescriptions = (()=>{ try { return (legacy as any).userDailyPrescriptions; } catch { return undefined as any; }})();
export const rituals = (()=>{ try { return (legacy as any).rituals; } catch { return undefined as any; }})();
export const ritualLibrary = (()=>{ try { return (legacy as any).ritualLibrary; } catch { return undefined as any; }})();
export const ritualEntries = (()=>{ try { return (legacy as any).ritualEntries; } catch { return undefined as any; }})();
export const journalDrafts = (()=>{ try { return (legacy as any).journalDrafts; } catch { return undefined as any; }})();
export const weeklySummaries = (()=>{ try { return (legacy as any).weeklySummaries; } catch { return undefined as any; }})();
export const anonymousPosts = (()=>{ try { return (legacy as any).anonymousPosts; } catch { return undefined as any; }})();
export const wallPostReactions = (()=>{ try { return (legacy as any).wallPostReactions; } catch { return undefined as any; }})();
export const wallPostComments = (()=>{ try { return (legacy as any).wallPostComments; } catch { return undefined as any; }})();
export const moderationQueue = (()=>{ try { return (legacy as any).moderationQueue; } catch { return undefined as any; }})();
export const moderationLogs = (()=>{ try { return (legacy as any).moderationLogs; } catch { return undefined as any; }})();
export const badges = (()=>{ try { return (legacy as any).badges; } catch { return undefined as any; }})();
export const userBadges = (()=>{ try { return (legacy as any).userBadges; } catch { return undefined as any; }})();
// xpTransactions dropped – XP system removed
export const byteTransactions = (()=>{ try { return (legacy as any).byteTransactions; } catch { return undefined as any; }})();
export const referrals = (()=>{ try { return (legacy as any).referrals; } catch { return undefined as any; }})();
export const blogPosts = (()=>{ try { return (legacy as any).blogPosts; } catch { return undefined as any; }})();
export const apiUsage = (()=>{ try { return (legacy as any).apiUsage; } catch { return undefined as any; }})();
export const auditLogs = (()=>{ try { return (legacy as any).auditLogs; } catch { return undefined as any; }})();
// aiTherapyMessagePurchases now defined above in this file (unified schema)
export const shopProducts = (()=>{ try { return (legacy as any).shopProducts; } catch { return undefined as any; }})();
export const shopOrders = (()=>{ try { return (legacy as any).shopOrders; } catch { return undefined as any; }})();
export const shopOrderItems = (()=>{ try { return (legacy as any).shopOrderItems; } catch { return undefined as any; }})();
export const shopCart = (()=>{ try { return (legacy as any).shopCart; } catch { return undefined as any; }})();
export const byteEarningRules = (()=>{ try { return (legacy as any).byteEarningRules; } catch { return undefined as any; }})();
export const userByteHistory = (()=>{ try { return (legacy as any).userByteHistory; } catch { return undefined as any; }})();
export const streakBonuses = (()=>{ try { return (legacy as any).streakBonuses; } catch { return undefined as any; }})();
export const digitalProductAccess = (()=>{ try { return (legacy as any).digitalProductAccess; } catch { return undefined as any; }})();
export const userAchievements = (()=>{ try { return (legacy as any).userAchievements; } catch { return undefined as any; }})();
export const userMultipliers = (()=>{ try { return (legacy as any).userMultipliers; } catch { return undefined as any; }})();
export const achievementProgress = (()=>{ try { return (legacy as any).achievementProgress; } catch { return undefined as any; }})();
// Types
// Legacy type exports temporarily removed to avoid circular reference during migration.
