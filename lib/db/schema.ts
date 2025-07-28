// File: lib/db/schema.ts

import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

// This is your existing users table.
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  // Explicitly naming the column to match what the code expects.
  hashedPassword: text('hashed_password').notNull(),
});

// This is the required sessions table for Lucia auth.
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

// This defines the type for a user object, which is used elsewhere.
export type User = typeof users.$inferSelect;
