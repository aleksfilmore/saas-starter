// Minimal schema that matches actual database structure
import { pgTable, text, timestamp, integer, boolean, varchar } from 'drizzle-orm/pg-core';

// Simple users table with only known existing columns
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashedPassword: text('password_hash').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  username: text('username').unique(),
  // (theme_preference column intentionally omitted – it does not exist in live DB)
  // Email verification fields
  email_verified: boolean('email_verified').default(false),
  email_verification_token: text('email_verification_token'),
  email_verification_sent_at: timestamp('email_verification_sent_at', { withTimezone: true }),
  // Add other columns that actually exist
  avatar: text('avatar'),
  onboarding_completed: boolean('onboarding_completed').default(false),
  subscription_tier: text('subscription_tier').default('ghost_mode'),
  // xp_points, byte_balance, glow_up_level removed (bytes economy)
  is_admin: boolean('is_admin').default(false),
  is_banned: boolean('is_banned').default(false),
  last_active_at: timestamp('last_active_at', { withTimezone: true }),
  reset_token: text('reset_token'),
  reset_token_expiry: timestamp('reset_token_expiry', { withTimezone: true }),
  tier: text('tier').notNull().default('ghost'),
  status: text('status').notNull().default('active'),
  current_protocol: text('current_protocol'),
  protocol_day: integer('protocol_day').notNull().default(0),
  dashboard_type: text('dashboard_type').notNull().default('standard'),
  emotional_archetype: text('emotional_archetype'),
  codename: text('codename'),
  avatar_style: text('avatar_style'),
  // xp removed
  bytes: integer('bytes').notNull().default(100),
  // level removed
  streak: integer('streak').notNull().default(0),
  streak_days: integer('streak_days').notNull().default(0),
  longest_streak: integer('longest_streak').notNull().default(0),
  no_contact_days: integer('no_contact_days').notNull().default(0),
  ux_stage: text('ux_stage'),
  ai_quota_used: integer('ai_quota_used').notNull().default(0),
  ai_quota_reset_at: timestamp('ai_quota_reset_at', { withTimezone: true }),
  ritual_history: text('ritual_history'),
  therapy_history: text('therapy_history'),
  shop_inventory: text('shop_inventory'),
  badges: text('badges'),
  last_ritual_completed: timestamp('last_ritual_completed', { withTimezone: true }),
  last_login: timestamp('last_login', { withTimezone: true }),
  last_no_contact_checkin: timestamp('last_no_contact_checkin', { withTimezone: true }),
  no_contact_streak_threatened: boolean('no_contact_streak_threatened').notNull().default(false)
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

// Simple notifications table (optional usage; graceful fallback if empty)
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  action_url: text('action_url'),
  action_text: text('action_text'),
  read: boolean('read').notNull().default(false), // legacy quick flag
  read_at: timestamp('read_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
