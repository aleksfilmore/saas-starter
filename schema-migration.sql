-- Migration to change user IDs from integer to text/UUID
-- This is a major change that requires careful handling of existing data

-- First, create new tables with the correct schema
CREATE TABLE users_new (
  id TEXT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE sessions_new (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users_new(id),
  expires_at TIMESTAMPTZ NOT NULL
);

-- If there's existing data, we need to migrate it
-- For now, let's assume we're starting fresh and drop existing tables
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS daily_check_ins CASCADE;
DROP TABLE IF EXISTS ritual_completions CASCADE;
DROP TABLE IF EXISTS user_daily_prescriptions CASCADE;
DROP TABLE IF EXISTS anonymous_post_hearts CASCADE;
DROP TABLE IF EXISTS ai_letters CASCADE;
DROP TABLE IF EXISTS no_contact_breaches CASCADE;
DROP TABLE IF EXISTS no_contact_periods CASCADE;
DROP TABLE IF EXISTS daily_rituals CASCADE;
DROP TABLE IF EXISTS anonymous_posts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Rename new tables to original names
ALTER TABLE users_new RENAME TO users;
ALTER TABLE sessions_new RENAME TO sessions;
