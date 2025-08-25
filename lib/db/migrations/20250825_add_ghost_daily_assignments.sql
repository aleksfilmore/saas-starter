-- Migration: ghost_daily_assignments table for stable ghost ritual allocation
CREATE TABLE IF NOT EXISTS ghost_daily_assignments (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_date text NOT NULL,
  timezone text NOT NULL DEFAULT 'UTC',
  ritual_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, assigned_date)
);

CREATE INDEX IF NOT EXISTS idx_ghost_daily_assignments_user_date ON ghost_daily_assignments(user_id, assigned_date);