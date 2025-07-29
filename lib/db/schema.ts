// File: lib/db/schema.ts

import { pgTable, text, timestamp, integer, boolean, serial, varchar } from 'drizzle-orm/pg-core';

// Original existing users table structure (keeping compatibility)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  hashedPassword: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Lucia auth sessions table (new for auth system)
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
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
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  contactName: text('contact_name').notNull(),
  startDate: timestamp('start_date', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
  targetDays: integer('target_days').notNull(),
  isActive: boolean('is_active').notNull().default(true),
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
  userId: integer('user_id')
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
  userId: integer('user_id')
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

// This defines the type for a user object, which is used elsewhere.
export type User = typeof users.$inferSelect;
export type NoContactPeriod = typeof noContactPeriods.$inferSelect;
export type NoContactBreach = typeof noContactBreaches.$inferSelect;
export type DailyRitual = typeof dailyRituals.$inferSelect;
export type RitualCompletion = typeof ritualCompletions.$inferSelect;
export type UserDailyPrescription = typeof userDailyPrescriptions.$inferSelect;
