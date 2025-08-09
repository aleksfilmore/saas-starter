// Production Database Schema - Complete User Profile Support
import { pgTable, text, timestamp, varchar, integer, boolean, jsonb, date, serial } from 'drizzle-orm/pg-core';

// Users table with complete profile data
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashedPassword: text('password_hash').notNull(),
  
  // User profile data
  tier: varchar('tier', { length: 50 }).notNull().default('freemium'), // freemium, paid_beginner, paid_advanced
  archetype: varchar('archetype', { length: 100 }), // PANIC PROTOCOL, FIREWALL BUILDER, etc.
  archetype_details: jsonb('archetype_details'), // Full archetype analysis
  
  // Gamification
  xp: integer('xp').notNull().default(0),
  bytes: integer('bytes').notNull().default(100),
  level: integer('level').notNull().default(1),
  
  // Streaks and stats
  ritual_streak: integer('ritual_streak').notNull().default(0),
  no_contact_streak: integer('no_contact_streak').notNull().default(0),
  last_checkin: timestamp('last_checkin', { withTimezone: true }),
  last_ritual: timestamp('last_ritual', { withTimezone: true }),
  
  // Account status
  is_verified: boolean('is_verified').notNull().default(false),
  subscription_status: varchar('subscription_status', { length: 50 }).default('free'), // free, active, cancelled
  subscription_expires: timestamp('subscription_expires', { withTimezone: true }),
  
  // Timestamps
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Sessions table
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

// Daily Ritual Assignments Table
export const dailyRitualAssignments = pgTable('daily_ritual_assignments', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id),
  assigned_date: date('assigned_date').notNull(),
  ritual_1_id: varchar('ritual_1_id', { length: 100 }).notNull(),
  ritual_2_id: varchar('ritual_2_id', { length: 100 }).notNull(),
  allocation_mode: varchar('allocation_mode', { length: 20 }).notNull().default('guided'),
  user_weeks_at_assignment: integer('user_weeks_at_assignment').notNull().default(0),
  has_rerolled: boolean('has_rerolled').notNull().default(false),
  reroll_used_at: timestamp('reroll_used_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Daily Ritual Completions Table
export const dailyRitualCompletions = pgTable('daily_ritual_completions', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id),
  assignment_id: integer('assignment_id').notNull().references(() => dailyRitualAssignments.id),
  ritual_id: varchar('ritual_id', { length: 100 }).notNull(),
  journal_text: text('journal_text').notNull(),
  mood_rating: integer('mood_rating'),
  dwell_time_seconds: integer('dwell_time_seconds').notNull().default(0),
  word_count: integer('word_count').notNull().default(0),
  xp_earned: integer('xp_earned').notNull().default(0),
  bytes_earned: integer('bytes_earned').notNull().default(0),
  completed_at: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
});

// User Daily State Tracking
export const userDailyState = pgTable('user_daily_state', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id),
  state_date: date('state_date').notNull(),
  rituals_completed_today: integer('rituals_completed_today').notNull().default(0),
  daily_cap_reached: boolean('daily_cap_reached').notNull().default(false),
  has_rerolled_today: boolean('has_rerolled_today').notNull().default(false),
  streak_days: integer('streak_days').notNull().default(0),
  last_completion_date: date('last_completion_date'),
  timezone: varchar('timezone', { length: 50 }).notNull().default('UTC'),
  total_weeks_active: integer('total_weeks_active').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Ritual History (for 30-day no-repeat tracking)
export const userRitualHistory = pgTable('user_ritual_history', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id),
  ritual_id: varchar('ritual_id', { length: 100 }).notNull(),
  last_assigned_date: date('last_assigned_date').notNull(),
  completion_count: integer('completion_count').notNull().default(0),
});

// Analytics Events for Daily Rituals
export const dailyRitualEvents = pgTable('daily_ritual_events', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id),
  event_type: varchar('event_type', { length: 50 }).notNull(),
  event_data: jsonb('event_data').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// =====================================
// NOTIFICATIONS & ENGAGEMENT
// =====================================

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id),
  type: varchar('type', { length: 50 }).notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  priority: varchar('priority', { length: 20 }).notNull().default('normal'),
  channels: jsonb('channels').notNull(), // ['push','in_app']
  metadata: jsonb('metadata'),
  delivered_at: timestamp('delivered_at', { withTimezone: true }),
  read_at: timestamp('read_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id),
  endpoint: text('endpoint').notNull(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  last_used_at: timestamp('last_used_at', { withTimezone: true }),
});

// =====================================
// ANALYTICS EVENTS (GENERIC)
// =====================================

export const analyticsEvents = pgTable('analytics_events', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').references(() => users.id),
  event_type: varchar('event_type', { length: 80 }).notNull(),
  properties: jsonb('properties').notNull().default('{}'),
  day_index: integer('day_index'), // days since signup
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// =====================================
// AI SESSIONS (CHAT / VOICE)
// =====================================

export const aiSessions = pgTable('ai_sessions', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id),
  mode: varchar('mode', { length: 20 }).notNull().default('chat'), // chat | voice
  started_at: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  ended_at: timestamp('ended_at', { withTimezone: true }),
  token_usage: jsonb('token_usage'),
  meta: jsonb('meta'),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type DailyRitualAssignment = typeof dailyRitualAssignments.$inferSelect;
export type NewDailyRitualAssignment = typeof dailyRitualAssignments.$inferInsert;

export type DailyRitualCompletion = typeof dailyRitualCompletions.$inferSelect;
export type NewDailyRitualCompletion = typeof dailyRitualCompletions.$inferInsert;

export type UserDailyState = typeof userDailyState.$inferSelect;
export type NewUserDailyState = typeof userDailyState.$inferInsert;

export type UserRitualHistory = typeof userRitualHistory.$inferSelect;
export type NewUserRitualHistory = typeof userRitualHistory.$inferInsert;

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type NewPushSubscription = typeof pushSubscriptions.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
export type AISession = typeof aiSessions.$inferSelect;
export type NewAISession = typeof aiSessions.$inferInsert;
