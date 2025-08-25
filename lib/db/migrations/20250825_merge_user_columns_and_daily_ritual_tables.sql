-- Migration: merge user extra columns + ensure daily ritual tables
-- Adds missing columns if they do not exist; creates ritual tables if absent.

-- === User table new columns ===
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ritual_streak integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS no_contact_streak integer NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS archetype text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS archetype_details json;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;

-- === Daily ritual assignments ===
-- If legacy daily_ritual_assignments exists with assignment_date, do not recreate; only create if absent
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='daily_ritual_assignments') THEN
    CREATE TABLE daily_ritual_assignments (
      id serial PRIMARY KEY,
      user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      assigned_date date NOT NULL,
      ritual_1_id text NOT NULL,
      ritual_2_id text NOT NULL,
      allocation_mode text NOT NULL DEFAULT 'guided',
      user_weeks_at_assignment integer NOT NULL DEFAULT 0,
      has_rerolled boolean NOT NULL DEFAULT false,
      reroll_used_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  ELSE
    -- Add missing columns incrementally for legacy structure
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='ritual_1_id') THEN
      ALTER TABLE daily_ritual_assignments ADD COLUMN ritual_1_id text;
      -- backfill from ritual_id if exists
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='ritual_id') THEN
        UPDATE daily_ritual_assignments SET ritual_1_id = ritual_id;
      END IF;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='ritual_2_id') THEN
      ALTER TABLE daily_ritual_assignments ADD COLUMN ritual_2_id text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='allocation_mode') THEN
      ALTER TABLE daily_ritual_assignments ADD COLUMN allocation_mode text DEFAULT 'guided';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='user_weeks_at_assignment') THEN
      ALTER TABLE daily_ritual_assignments ADD COLUMN user_weeks_at_assignment integer DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='has_rerolled') THEN
      ALTER TABLE daily_ritual_assignments ADD COLUMN has_rerolled boolean DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='reroll_used_at') THEN
      ALTER TABLE daily_ritual_assignments ADD COLUMN reroll_used_at timestamptz;
    END IF;
    -- If neither assigned_date nor assignment_date present, add assigned_date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='assigned_date')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='assignment_date') THEN
      ALTER TABLE daily_ritual_assignments ADD COLUMN assigned_date date;
    END IF;
  END IF;
END $$;

-- === Completions ===
CREATE TABLE IF NOT EXISTS daily_ritual_completions (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id integer NOT NULL REFERENCES daily_ritual_assignments(id) ON DELETE CASCADE,
  ritual_id text NOT NULL,
  journal_text text NOT NULL,
  mood_rating integer,
  dwell_time_seconds integer NOT NULL DEFAULT 0,
  word_count integer NOT NULL DEFAULT 0,
  xp_earned integer NOT NULL DEFAULT 0,
  bytes_earned integer NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now()
);

-- === Daily state ===
CREATE TABLE IF NOT EXISTS user_daily_state (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  state_date date NOT NULL,
  rituals_completed_today integer NOT NULL DEFAULT 0,
  daily_cap_reached boolean NOT NULL DEFAULT false,
  has_rerolled_today boolean NOT NULL DEFAULT false,
  streak_days integer NOT NULL DEFAULT 0,
  last_completion_date date,
  timezone text NOT NULL DEFAULT 'UTC',
  total_weeks_active integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- === Ritual history ===
CREATE TABLE IF NOT EXISTS user_ritual_history (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ritual_id text NOT NULL,
  last_assigned_date date NOT NULL,
  completion_count integer NOT NULL DEFAULT 0
);

-- === Events ===
CREATE TABLE IF NOT EXISTS daily_ritual_events (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data json,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indices for performance
-- Create index referencing whichever date column exists
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='assigned_date') THEN
    CREATE INDEX IF NOT EXISTS idx_daily_ritual_assignments_user_date ON daily_ritual_assignments(user_id, assigned_date);
  ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='assignment_date') THEN
    CREATE INDEX IF NOT EXISTS idx_daily_ritual_assignments_user_date ON daily_ritual_assignments(user_id, assignment_date);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_daily_ritual_completions_user_completed ON daily_ritual_completions(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_user_daily_state_user_date ON user_daily_state(user_id, state_date);
