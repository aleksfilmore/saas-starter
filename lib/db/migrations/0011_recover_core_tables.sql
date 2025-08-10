-- 0011_recover_core_tables.sql
-- Drizzle migration: restore missing wall / ritual tables & columns if absent.
-- Safe, idempotent patterns (IF NOT EXISTS / DO blocks) to avoid failures on re-run.

DO $$ BEGIN
  -- anonymous_posts supplemental columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='glitch_title') THEN
    ALTER TABLE anonymous_posts ADD COLUMN glitch_title text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='glitch_category') THEN
    ALTER TABLE anonymous_posts ADD COLUMN glitch_category text DEFAULT 'general' NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='glitch_overlay') THEN
    ALTER TABLE anonymous_posts ADD COLUMN glitch_overlay text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='resonate_count') THEN
    ALTER TABLE anonymous_posts ADD COLUMN resonate_count integer DEFAULT 0 NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='same_loop_count') THEN
    ALTER TABLE anonymous_posts ADD COLUMN same_loop_count integer DEFAULT 0 NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='dragged_me_too_count') THEN
    ALTER TABLE anonymous_posts ADD COLUMN dragged_me_too_count integer DEFAULT 0 NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='stone_cold_count') THEN
    ALTER TABLE anonymous_posts ADD COLUMN stone_cold_count integer DEFAULT 0 NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='cleansed_count') THEN
    ALTER TABLE anonymous_posts ADD COLUMN cleansed_count integer DEFAULT 0 NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='comment_count') THEN
    ALTER TABLE anonymous_posts ADD COLUMN comment_count integer DEFAULT 0 NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='bytes_earned') THEN
    ALTER TABLE anonymous_posts ADD COLUMN bytes_earned integer DEFAULT 25 NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='is_anonymous') THEN
    ALTER TABLE anonymous_posts ADD COLUMN is_anonymous boolean DEFAULT true NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='is_featured') THEN
    ALTER TABLE anonymous_posts ADD COLUMN is_featured boolean DEFAULT false NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='is_oracle_post') THEN
    ALTER TABLE anonymous_posts ADD COLUMN is_oracle_post boolean DEFAULT false NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='is_viral_awarded') THEN
    ALTER TABLE anonymous_posts ADD COLUMN is_viral_awarded boolean DEFAULT false NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='updated_at') THEN
    ALTER TABLE anonymous_posts ADD COLUMN updated_at timestamptz DEFAULT now() NOT NULL;
  END IF;
END $$;

-- wall_post_comments
CREATE TABLE IF NOT EXISTS wall_post_comments (
  id text PRIMARY KEY,
  post_id text NOT NULL REFERENCES anonymous_posts(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  user_id text NOT NULL REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  content text NOT NULL,
  parent_comment_id text,
  bytes_earned integer DEFAULT 5 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- wall_post_reactions
CREATE TABLE IF NOT EXISTS wall_post_reactions (
  id text PRIMARY KEY,
  post_id text NOT NULL REFERENCES anonymous_posts(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  user_id text NOT NULL REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  reaction_type text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- ritual_entries (minimal recreation if absent)
CREATE TABLE IF NOT EXISTS ritual_entries (
  id text PRIMARY KEY,
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
);
