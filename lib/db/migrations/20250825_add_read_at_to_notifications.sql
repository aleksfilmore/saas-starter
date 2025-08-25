-- Add read_at column to notifications table if it does not exist
-- Ensures compatibility with API routes that set notifications.read_at
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='notifications' AND column_name='id'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='notifications' AND column_name='read_at'
    ) THEN
      ALTER TABLE notifications ADD COLUMN read_at TIMESTAMPTZ;
      -- Optional backfill: set read_at to created_at for already read notifications if read column exists
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='notifications' AND column_name='read'
      ) THEN
        EXECUTE 'UPDATE notifications SET read_at = created_at WHERE read = true AND read_at IS NULL';
      ELSIF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='notifications' AND column_name='is_read'
      ) THEN
        EXECUTE 'UPDATE notifications SET read_at = created_at WHERE is_read = true AND read_at IS NULL';
      END IF;
    END IF;
  END IF;
END $$;

-- Create helpful index if not present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_user_unread'
  ) THEN
    CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE read = FALSE;
  END IF;
END $$;
