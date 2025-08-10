-- 0012_normalize_user_foreign_keys.sql
-- Purpose: Normalize legacy integer user FK columns to text to align with users.id (text)
-- Targets: activity_logs.user_id, invitations.invited_by, team_members.user_id
-- Safe & idempotent: checks current data_type before attempting conversion.
-- Strategy:
--  1. For each table/column still integer: drop related FK constraints if they exist.
--  2. ALTER COLUMN TYPE text USING cast.
--  3. Recreate FK constraints (guarded with exception handling for duplicate_object).
-- NOTE: This migration intentionally does NOT touch team_id columns (still integer) or other FKs.

DO $$ BEGIN
  -- activity_logs.user_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activity_logs' AND column_name = 'user_id' AND data_type = 'integer'
  ) THEN
    -- Drop FK if present (name from 0000 migration)
    IF EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'activity_logs_user_id_users_id_fk'
    ) THEN
      ALTER TABLE activity_logs DROP CONSTRAINT activity_logs_user_id_users_id_fk;
    END IF;
    ALTER TABLE activity_logs ALTER COLUMN user_id TYPE text USING user_id::text;
    BEGIN
      ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;

  -- invitations.invited_by
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invitations' AND column_name = 'invited_by' AND data_type = 'integer'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'invitations_invited_by_users_id_fk'
    ) THEN
      ALTER TABLE invitations DROP CONSTRAINT invitations_invited_by_users_id_fk;
    END IF;
    ALTER TABLE invitations ALTER COLUMN invited_by TYPE text USING invited_by::text;
    BEGIN
      ALTER TABLE invitations ADD CONSTRAINT invitations_invited_by_users_id_fk FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;

  -- team_members.user_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'team_members' AND column_name = 'user_id' AND data_type = 'integer'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'team_members_user_id_users_id_fk'
    ) THEN
      ALTER TABLE team_members DROP CONSTRAINT team_members_user_id_users_id_fk;
    END IF;
    ALTER TABLE team_members ALTER COLUMN user_id TYPE text USING user_id::text;
    BEGIN
      ALTER TABLE team_members ADD CONSTRAINT team_members_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END $$;
