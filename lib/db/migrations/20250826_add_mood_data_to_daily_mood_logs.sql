-- Migration: Add mood_data JSONB column & widen mood scale for daily_mood_logs
-- Date: 2025-08-26
-- Purpose: Formalize structured check-in fields (gratitude, challenge, intention) and backfill from legacy concatenated notes.

BEGIN;

-- Ensure table exists (idempotent safe)
CREATE TABLE IF NOT EXISTS daily_mood_logs (
  user_id TEXT NOT NULL,
  log_date DATE NOT NULL,
  mood INTEGER NOT NULL,
  notes TEXT,
  mood_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, log_date)
);

-- Add new JSONB column if missing
ALTER TABLE daily_mood_logs ADD COLUMN IF NOT EXISTS mood_data JSONB;

-- Ensure mood column can store 1-10 scale (was 1-5 originally). If constraint exists drop & recreate.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'daily_mood_logs_mood_check') THEN
    ALTER TABLE daily_mood_logs DROP CONSTRAINT daily_mood_logs_mood_check;
  END IF;
EXCEPTION WHEN undefined_table THEN
  -- table might not exist yet (created above) ignore
END $$;
ALTER TABLE daily_mood_logs ADD CONSTRAINT daily_mood_logs_mood_check CHECK (mood BETWEEN 1 AND 10);

-- Backfill structured fields from legacy concatenated notes pattern:
-- Pattern produced earlier: "Gratitude: <g>\nChallenge: <c>\nIntention: <i>"
-- Only attempt when mood_data is NULL and notes matches the marker strings.
UPDATE daily_mood_logs
SET mood_data = jsonb_build_object(
  'gratitude', NULLIF(trim(regexp_replace(split_part(notes,'Challenge:',1),'^Gratitude:','')),''),
  'challenge', NULLIF(trim(split_part(split_part(notes,'Intention:',1),'Challenge:',2)) ,''),
  'intention', NULLIF(trim(split_part(notes,'Intention:',2)),'')
)
WHERE mood_data IS NULL
  AND notes LIKE 'Gratitude:%Challenge:%Intention:%';

-- Optional: index for querying by log_date (analytics)
CREATE INDEX IF NOT EXISTS idx_daily_mood_logs_log_date ON daily_mood_logs(log_date);

COMMIT;
