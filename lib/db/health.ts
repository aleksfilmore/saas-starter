import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

// Core tables we expect to exist for app stability
export const CORE_TABLES = [
  'users',
  'sessions',
  'anonymous_posts',
  'wall_post_reactions',
  // wall_post_comments removed (feature not used)
  'ritual_entries'
];

// One-time warning cache to avoid log spam
const warned = new Set<string>();

export async function getExistingTables(): Promise<Set<string>> {
  const rows = await db.execute<{ tablename: string }>(sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`);
  return new Set(rows.map(r => r.tablename));
}

export async function getMissingCoreTables(): Promise<string[]> {
  const existing = await getExistingTables();
  return CORE_TABLES.filter(t => !existing.has(t));
}

export function logMissingTableOnce(table: string) {
  if (!warned.has(table)) {
    warned.add(table);
    console.warn(`[DB-HEALTH] Missing expected table: ${table}`);
  }
}

export async function restoreMissingTables(tables: string[]): Promise<{ restored: string[]; skipped: string[] }> {
  const restored: string[] = [];
  const skipped: string[] = [];
  for (const t of tables) {
    switch (t) {
      case 'wall_post_comments':
        // Skipped intentionally; comments feature removed.
        skipped.push(t);
        break;
      case 'ritual_entries':
        await db.execute(sql`CREATE TABLE IF NOT EXISTS ritual_entries (
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
        )`);
        // Indexes
        await db.execute(sql`CREATE INDEX IF NOT EXISTS ritual_entries_user_performed_idx ON ritual_entries (user_id, performed_at)`);
        await db.execute(sql`CREATE INDEX IF NOT EXISTS ritual_entries_user_code_idx ON ritual_entries (user_id, ritual_code)`);
        restored.push(t);
        break;
      case 'wall_post_reactions':
        await db.execute(sql`CREATE TABLE IF NOT EXISTS wall_post_reactions (
          id text PRIMARY KEY NOT NULL,
          post_id text NOT NULL REFERENCES anonymous_posts(id),
          user_id text NOT NULL REFERENCES users(id),
          reaction_type text NOT NULL,
          created_at timestamptz DEFAULT now() NOT NULL,
          updated_at timestamptz DEFAULT now() NOT NULL
        )`);
        restored.push(t);
        break;
      case 'anonymous_posts':
        await db.execute(sql`CREATE TABLE IF NOT EXISTS anonymous_posts (
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
        )`);
        restored.push(t);
        break;
      default:
        skipped.push(t);
    }
  }
  return { restored, skipped };
}
