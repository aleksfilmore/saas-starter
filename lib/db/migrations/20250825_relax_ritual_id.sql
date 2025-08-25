-- Legacy compatibility: make ritual_id nullable and backfill from ritual_1_id
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='daily_ritual_assignments' AND column_name='ritual_id'
  ) THEN
    -- Drop NOT NULL constraint if present
    BEGIN
      ALTER TABLE daily_ritual_assignments ALTER COLUMN ritual_id DROP NOT NULL;
    EXCEPTION WHEN others THEN
      -- Ignore if already nullable
      NULL;
    END;
    -- Backfill any nulls with ritual_1_id
    UPDATE daily_ritual_assignments 
      SET ritual_id = ritual_1_id 
      WHERE ritual_id IS NULL AND ritual_1_id IS NOT NULL;
  END IF;
END $$;