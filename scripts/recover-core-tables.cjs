#!/usr/bin/env node
/**
 * Recover core tables (anonymous_posts, wall_post_comments, wall_post_reactions, ritual_entries)
 * without relying on drizzle migration state. Uses pg client directly so it can run even when
 * drizzle-kit journal is broken. Safe (IF NOT EXISTS) idempotent creation.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load env (.env.local preferred) just like prestart
try {
  const dotenv = require('dotenv');
  const local = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(local)) dotenv.config({ path: local }); else dotenv.config();
} catch {}

if (!process.env.POSTGRES_URL) {
  console.error('[RECOVER-CORE] POSTGRES_URL not set');
  process.exit(1);
}

const client = new Client({ connectionString: process.env.POSTGRES_URL, ssl: { rejectUnauthorized: false } });

const statements = [
  `CREATE TABLE IF NOT EXISTS anonymous_posts (
    id text PRIMARY KEY NOT NULL,
    user_id text REFERENCES users(id),
    content text NOT NULL,
    glitch_title text,
    glitch_category text DEFAULT 'general' NOT NULL,
    category text DEFAULT 'general' NOT NULL,
    glitch_overlay text,
    hearts integer DEFAULT 0 NOT NULL,
    resonate_count integer DEFAULT 0 NOT NULL,
    same_loop_count integer DEFAULT 0 NOT NULL,
    dragged_me_too_count integer DEFAULT 0 NOT NULL,
    stone_cold_count integer DEFAULT 0 NOT NULL,
    cleansed_count integer DEFAULT 0 NOT NULL,
    comment_count integer DEFAULT 0 NOT NULL,
    bytes_earned integer DEFAULT 25 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_anonymous boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    is_oracle_post boolean DEFAULT false NOT NULL,
    is_viral_awarded boolean DEFAULT false NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS wall_post_reactions (
    id text PRIMARY KEY NOT NULL,
    post_id text NOT NULL REFERENCES anonymous_posts(id),
    user_id text NOT NULL REFERENCES users(id),
    reaction_type text NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS wall_post_comments (
    id text PRIMARY KEY NOT NULL,
    post_id text NOT NULL REFERENCES anonymous_posts(id),
    user_id text NOT NULL REFERENCES users(id),
    content text NOT NULL,
    parent_comment_id text,
    bytes_earned integer DEFAULT 5 NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS ritual_entries (
    id text PRIMARY KEY NOT NULL,
    user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ritual_code varchar(64) NOT NULL,
    ritual_title varchar(128),
    performed_at timestamptz DEFAULT now(),
    mood integer,
    what_i_did text,
    how_i_feel text,
    tags varchar(256),
    source varchar(16) DEFAULT 'text',
    time_spent_seconds integer,
    text_length integer,
    xp_awarded integer DEFAULT 0,
    bytes_awarded integer DEFAULT 0,
    tokens_used integer DEFAULT 0,
    summary_id text,
    sentiment varchar(16),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    deleted_at timestamptz
  )`,
  `CREATE INDEX IF NOT EXISTS ritual_entries_user_performed_idx ON ritual_entries (user_id, performed_at)`,
  `CREATE INDEX IF NOT EXISTS ritual_entries_user_code_idx ON ritual_entries (user_id, ritual_code)`
];

(async () => {
  console.log('[RECOVER-CORE] Connecting...');
  await client.connect();
  try {
    for (const stmt of statements) {
      console.log('[RECOVER-CORE] Executing:', stmt.split('\n')[0]);
      await client.query(stmt);
    }
    console.log('[RECOVER-CORE] Core table recovery complete.');
  } catch (e) {
    console.error('[RECOVER-CORE] Error:', e.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
