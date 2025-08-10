-- 0009_unified_recovery_and_normalization.sql
-- Consolidated forward-only migration replacing prior removed 0010,0011,0012 files.
-- Responsibilities:
--  1. Recover (create if missing) core engagement / ritual tables.
--  2. Add any missing supplemental columns to anonymous_posts.
--  3. Ensure wall_post_comments & wall_post_reactions FKs exist.
--  4. Ensure ritual_entries table (rich version) exists.
--  5. Normalize legacy integer user FK columns (activity_logs.user_id, invitations.invited_by, team_members.user_id) to text.
-- Idempotent: every operation guarded (IF NOT EXISTS / conditional checks / duplicate_object catch).

------------------------------------------------------------
-- 1 & 2. anonymous_posts supplemental columns
DO $$ BEGIN
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

------------------------------------------------------------
-- 3. wall_post_comments & wall_post_reactions tables & constraints
CREATE TABLE IF NOT EXISTS wall_post_comments (
  id text PRIMARY KEY,
  post_id text NOT NULL,
  user_id text NOT NULL,
  content text NOT NULL,
  parent_comment_id text,
  bytes_earned integer DEFAULT 5 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS wall_post_reactions (
  id text PRIMARY KEY,
  post_id text NOT NULL,
  user_id text NOT NULL,
  reaction_type text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

DO $$ BEGIN
  BEGIN
    ALTER TABLE wall_post_comments ADD CONSTRAINT wall_post_comments_post_id_anonymous_posts_id_fk FOREIGN KEY (post_id) REFERENCES anonymous_posts(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TABLE wall_post_comments ADD CONSTRAINT wall_post_comments_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TABLE wall_post_reactions ADD CONSTRAINT wall_post_reactions_post_id_anonymous_posts_id_fk FOREIGN KEY (post_id) REFERENCES anonymous_posts(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN
    ALTER TABLE wall_post_reactions ADD CONSTRAINT wall_post_reactions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
  EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

------------------------------------------------------------
-- 4. ritual_entries rich table (create if absent; no destructive changes)
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

------------------------------------------------------------
-- 5. Normalize legacy integer FK columns to text
DO $$ BEGIN
  -- activity_logs.user_id
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activity_logs' AND column_name='user_id' AND data_type='integer') THEN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='activity_logs_user_id_users_id_fk') THEN
      ALTER TABLE activity_logs DROP CONSTRAINT activity_logs_user_id_users_id_fk;
    END IF;
    ALTER TABLE activity_logs ALTER COLUMN user_id TYPE text USING user_id::text;
    BEGIN
      ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;

  -- invitations.invited_by
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invitations' AND column_name='invited_by' AND data_type='integer') THEN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='invitations_invited_by_users_id_fk') THEN
      ALTER TABLE invitations DROP CONSTRAINT invitations_invited_by_users_id_fk;
    END IF;
    ALTER TABLE invitations ALTER COLUMN invited_by TYPE text USING invited_by::text;
    BEGIN
      ALTER TABLE invitations ADD CONSTRAINT invitations_invited_by_users_id_fk FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;

  -- team_members.user_id
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team_members' AND column_name='user_id' AND data_type='integer') THEN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='team_members_user_id_users_id_fk') THEN
      ALTER TABLE team_members DROP CONSTRAINT team_members_user_id_users_id_fk;
    END IF;
    ALTER TABLE team_members ALTER COLUMN user_id TYPE text USING user_id::text;
    BEGIN
      ALTER TABLE team_members ADD CONSTRAINT team_members_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;

-- End of consolidated migration
