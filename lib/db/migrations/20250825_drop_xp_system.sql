-- Migration: Drop obsolete XP system columns & tables (one-way)
-- Safely removes XP/level era artifacts now replaced by bytes.

-- 1. Drop dependent columns from daily ritual completions if exist
ALTER TABLE daily_ritual_completions DROP COLUMN IF EXISTS xp_earned;
ALTER TABLE ritual_completions DROP COLUMN IF EXISTS xp_earned;

-- 2. Drop user columns (order chosen to avoid dependency issues)
ALTER TABLE users DROP COLUMN IF EXISTS xp;
ALTER TABLE users DROP COLUMN IF EXISTS level;
ALTER TABLE users DROP COLUMN IF EXISTS xp_points;
ALTER TABLE users DROP COLUMN IF EXISTS byte_balance; -- duplicate of bytes

-- 3. Drop xp transactions table
DROP TABLE IF EXISTS xp_transactions CASCADE;

-- 4. Remove any legacy views referencing xp (ignore errors)
DO $$ BEGIN
  EXECUTE 'DROP VIEW IF EXISTS user_xp_progress';
EXCEPTION WHEN others THEN NULL; END $$;

-- 5. Note: schema code updated in unified-schema.ts accordingly.

-- Irreversible: we intentionally do not recreate XP artifacts.