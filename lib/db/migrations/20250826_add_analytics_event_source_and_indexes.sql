-- Migration: add analytics event source enum + column, convert properties to jsonb, add indexes
-- Generated 2025-08-26

BEGIN;

-- 1. Create enum type for analytics event source if not exists
DO $$ BEGIN
  CREATE TYPE analytics_event_source AS ENUM (
    'checkin','no_contact','ritual','ritual_complete','wall_interact','ai_chat','wall_post','unknown'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Add source column (nullable initially)
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS source analytics_event_source;

-- 3. Convert properties column from text JSON string to jsonb (add temp column then swap)
ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS properties_json jsonb;

UPDATE analytics_events SET properties_json = CASE
  WHEN properties IS NULL OR properties = '' THEN '{}'::jsonb
  ELSE COALESCE(properties::jsonb, '{}'::jsonb)
END
WHERE properties_json IS NULL;

-- 4. Backfill source from existing properties_json keys (delta earning events only)
UPDATE analytics_events
SET source = CASE
  -- direct mapping via nested source property if present
  WHEN (properties_json ->> 'source') IS NOT NULL THEN (
    CASE lower(properties_json ->> 'source')
      WHEN 'checkin' THEN 'checkin'
      WHEN 'no_contact' THEN 'no_contact'
      WHEN 'nocontact' THEN 'no_contact'
      WHEN 'noContact' THEN 'no_contact'
      WHEN 'ritual' THEN 'ritual'
      WHEN 'ritualcomplete' THEN 'ritual_complete'
      WHEN 'ritual_complete' THEN 'ritual_complete'
      WHEN 'wall_interact' THEN 'wall_interact'
      WHEN 'wallinteract' THEN 'wall_interact'
      WHEN 'wall_post' THEN 'wall_post'
      WHEN 'wallpost' THEN 'wall_post'
      WHEN 'ai_chat' THEN 'ai_chat'
      WHEN 'aichat' THEN 'ai_chat'
      ELSE 'unknown'
    END)::analytics_event_source
  -- fallback to mode/context
  WHEN (properties_json ->> 'mode') IS NOT NULL THEN (
    CASE lower(properties_json ->> 'mode')
      WHEN 'ghost' THEN 'ritual'
      WHEN 'firewall' THEN 'ritual'
      ELSE 'unknown'
    END)::analytics_event_source
  ELSE 'unknown'
END
WHERE source IS NULL;

-- 5. Make source NOT NULL with default 'unknown'
ALTER TABLE analytics_events ALTER COLUMN source SET DEFAULT 'unknown';
UPDATE analytics_events SET source = 'unknown' WHERE source IS NULL;
ALTER TABLE analytics_events ALTER COLUMN source SET NOT NULL;

-- 6. Swap columns: drop old properties, rename jsonb
ALTER TABLE analytics_events DROP COLUMN properties;
ALTER TABLE analytics_events RENAME COLUMN properties_json TO properties;

-- 7. Indexes to accelerate queries
CREATE INDEX IF NOT EXISTS analytics_events_source_idx ON analytics_events (source);
CREATE INDEX IF NOT EXISTS analytics_events_event_source_time_idx ON analytics_events (event, source, timestamp DESC);

COMMIT;

-- Down migration (manual):
-- BEGIN;
-- ALTER TABLE analytics_events ADD COLUMN properties_text text;
-- UPDATE analytics_events SET properties_text = properties::text;
-- ALTER TABLE analytics_events DROP COLUMN properties;
-- ALTER TABLE analytics_events RENAME COLUMN properties_text TO properties;
-- ALTER TABLE analytics_events DROP COLUMN source;
-- DROP TYPE analytics_event_source;
-- COMMIT;
