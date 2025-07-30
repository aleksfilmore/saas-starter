// Minimal Database Schema - Only Essential Columns
import { pgTable, text, timestamp, integer, boolean, varchar } from 'drizzle-orm/pg-core';

// Users table with only existing columns
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashedPassword: text('password_hash').notNull(),
  onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
  subscriptionTier: text('subscription_tier').notNull().default('ghost_mode'),
  xpPoints: integer('xp_points').notNull().default(0),
  byteBalance: integer('byte_balance').notNull().default(100),
  glowUpLevel: integer('glow_up_level').notNull().default(1),
  isAdmin: boolean('is_admin').notNull().default(false),
  isBanned: boolean('is_banned').notNull().default(false),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true, mode: 'date' }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// Sessions table
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
