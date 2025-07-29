// File: lib/db/schema.ts

import { pgTable, text, timestamp, integer, boolean, serial, varchar } from 'drizzle-orm/pg-core';

// Original existing users table structure (keeping compatibility)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
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

// This defines the type for a user object, which is used elsewhere.
export type User = typeof users.$inferSelect;
export type NoContactPeriod = typeof noContactPeriods.$inferSelect;
export type NoContactBreach = typeof noContactBreaches.$inferSelect;
