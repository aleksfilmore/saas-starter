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

// Daily Check-ins for No Contact Tracker
export const dailyCheckIns = pgTable('daily_check_ins', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
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

// Anonymous Wall Posts
export const anonymousPosts = pgTable('anonymous_posts', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id), // Nullable for true anonymity
  content: text('content').notNull(),
  category: text('category').notNull().default('general'), // 'vent', 'victory', 'advice', 'general'
  hearts: integer('hearts').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// Anonymous Wall Hearts (reactions)
export const anonymousPostHearts = pgTable('anonymous_post_hearts', {
  id: text('id').primaryKey(),
  postId: text('post_id')
    .notNull()
    .references(() => anonymousPosts.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull().defaultNow(),
});

// AI Generated Letters
export const aiLetters = pgTable('ai_letters', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
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

// This defines the type for a user object, which is used elsewhere.
export type User = typeof users.$inferSelect;
export type NoContactPeriod = typeof noContactPeriods.$inferSelect;
export type NoContactBreach = typeof noContactBreaches.$inferSelect;
export type DailyRitual = typeof dailyRituals.$inferSelect;
export type RitualCompletion = typeof ritualCompletions.$inferSelect;
export type UserDailyPrescription = typeof userDailyPrescriptions.$inferSelect;
export type DailyCheckIn = typeof dailyCheckIns.$inferSelect;
export type AnonymousPost = typeof anonymousPosts.$inferSelect;
export type AnonymousPostHeart = typeof anonymousPostHearts.$inferSelect;
export type AILetter = typeof aiLetters.$inferSelect;
