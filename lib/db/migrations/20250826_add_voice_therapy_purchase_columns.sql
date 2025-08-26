-- Add purchase_date and stripe_session_id columns to voice_therapy_credits
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='voice_therapy_credits' AND column_name='id'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='voice_therapy_credits' AND column_name='purchase_date'
    ) THEN
      ALTER TABLE voice_therapy_credits ADD COLUMN purchase_date timestamptz;
      -- Backfill existing rows using created_at
      UPDATE voice_therapy_credits SET purchase_date = created_at WHERE purchase_date IS NULL;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='voice_therapy_credits' AND column_name='stripe_session_id'
    ) THEN
      ALTER TABLE voice_therapy_credits ADD COLUMN stripe_session_id text;
    END IF;
  END IF;
END $$;

-- Optional: add unique index on stripe_session_id to prevent duplicate credit grants per session
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='voice_therapy_credits' AND column_name='stripe_session_id'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes WHERE indexname = 'uniq_voice_therapy_credits_stripe_session'
    ) THEN
      CREATE UNIQUE INDEX uniq_voice_therapy_credits_stripe_session 
        ON voice_therapy_credits(stripe_session_id) 
        WHERE stripe_session_id IS NOT NULL;
    END IF;
  END IF;
END $$;
