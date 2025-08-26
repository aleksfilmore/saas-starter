-- Idempotent recreation of core content tables that may have been dropped.
-- Includes: anonymous_posts, wall_post_reactions, ritual_entries
-- Safe for repeated execution in any environment.

DO $$
BEGIN
  -- anonymous_posts
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='anonymous_posts') THEN
    CREATE TABLE anonymous_posts (
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
    );
  END IF;

  -- wall_post_reactions
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='wall_post_reactions') THEN
    CREATE TABLE wall_post_reactions (
      id text PRIMARY KEY NOT NULL,
      post_id text NOT NULL REFERENCES anonymous_posts(id),
      user_id text NOT NULL REFERENCES users(id),
      reaction_type text NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    );
  END IF;

  -- ritual_entries
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='ritual_entries') THEN
    CREATE TABLE ritual_entries (
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
    );
  END IF;

  -- Indexes (CREATE INDEX IF NOT EXISTS is supported in PG >=9.5)
  CREATE INDEX IF NOT EXISTS ritual_entries_user_performed_idx ON ritual_entries (user_id, performed_at);
  CREATE INDEX IF NOT EXISTS ritual_entries_user_code_idx ON ritual_entries (user_id, ritual_code);
END $$;
