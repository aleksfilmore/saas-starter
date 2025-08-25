-- Reconcile legacy daily_ritual_assignments structure to unified schema
-- Existing columns: id, user_id, ritual_id, assignment_date, is_completed, created_at
-- Needed columns (add if missing): assigned_date (timestamp), ritual_1_id, ritual_2_id, allocation_mode, user_weeks_at_assignment, has_rerolled, reroll_used_at
-- Strategy: If legacy table exists with assignment_date (date), retain it and create assigned_date if absent (copy values). Keep ritual_id as ritual_1_id when upgrading.

DO $$ BEGIN
  -- Add assigned_date as timestamptz if not exists and backfill from assignment_date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='daily_ritual_assignments' AND column_name='assigned_date'
  ) THEN
    ALTER TABLE daily_ritual_assignments ADD COLUMN assigned_date timestamptz;
    UPDATE daily_ritual_assignments SET assigned_date = assignment_date::timestamptz;
  END IF;

  -- Add ritual_1_id if missing and backfill from ritual_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='daily_ritual_assignments' AND column_name='ritual_1_id'
  ) THEN
    ALTER TABLE daily_ritual_assignments ADD COLUMN ritual_1_id text;
    UPDATE daily_ritual_assignments SET ritual_1_id = ritual_id;
  END IF;

  -- Add ritual_2_id if missing (nullable initially)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='daily_ritual_assignments' AND column_name='ritual_2_id'
  ) THEN
    ALTER TABLE daily_ritual_assignments ADD COLUMN ritual_2_id text;
  END IF;

  -- Allocation mode
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='daily_ritual_assignments' AND column_name='allocation_mode'
  ) THEN
    ALTER TABLE daily_ritual_assignments ADD COLUMN allocation_mode text DEFAULT 'guided';
  END IF;

  -- user_weeks_at_assignment
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='daily_ritual_assignments' AND column_name='user_weeks_at_assignment'
  ) THEN
    ALTER TABLE daily_ritual_assignments ADD COLUMN user_weeks_at_assignment integer DEFAULT 0;
  END IF;

  -- has_rerolled
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='daily_ritual_assignments' AND column_name='has_rerolled'
  ) THEN
    ALTER TABLE daily_ritual_assignments ADD COLUMN has_rerolled boolean DEFAULT false;
  END IF;

  -- reroll_used_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='daily_ritual_assignments' AND column_name='reroll_used_at'
  ) THEN
    ALTER TABLE daily_ritual_assignments ADD COLUMN reroll_used_at timestamptz;
  END IF;

EXCEPTION WHEN others THEN
  RAISE NOTICE 'Reconciliation encountered an error: %', SQLERRM;
END $$;

-- Optional: create index on user_id + assigned_date
CREATE INDEX IF NOT EXISTS idx_daily_ritual_assignments_user_assigned ON daily_ritual_assignments(user_id, assigned_date);