-- Reconcile voice therapy credits and notifications table structures with unified-schema expectations
DO $$ BEGIN
  -- Ensure voice_therapy_credits has created_at & updated_at timestamps
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='voice_therapy_credits' AND column_name='id') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='voice_therapy_credits' AND column_name='created_at') THEN
      ALTER TABLE voice_therapy_credits ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='voice_therapy_credits' AND column_name='updated_at') THEN
      ALTER TABLE voice_therapy_credits ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
    END IF;
  END IF;

  -- Ensure notifications has action_url, action_text if unified or actual-schema references require
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='id') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='action_url') THEN
      ALTER TABLE notifications ADD COLUMN action_url text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='action_text') THEN
      ALTER TABLE notifications ADD COLUMN action_text text;
    END IF;
    -- Ensure read flag column name consistency: if is_read exists but read missing, create read and backfill
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='is_read')
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='read') THEN
      ALTER TABLE notifications ADD COLUMN read boolean;
      UPDATE notifications SET read = is_read;
    END IF;
  END IF;
END $$;