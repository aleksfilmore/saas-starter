// Production Database Schema - Complete User Profile Support
import { pgTable, text, timestamp, varchar, integer, boolean, jsonb } from 'drizzle-orm/pg-core';

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

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
