-- Inline voice therapy credits, sessions, notifications, and user_ritual_swaps tables
-- Safe IF NOT EXISTS creation for incremental deployment

CREATE TABLE IF NOT EXISTS voice_therapy_credits (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  minutes_purchased integer NOT NULL DEFAULT 0,
  minutes_remaining integer NOT NULL DEFAULT 0,
  expiry_date timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS voice_therapy_sessions (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  minutes_used integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  transcript text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text,
  message text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_ritual_swaps (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  swap_date timestamptz NOT NULL DEFAULT now(),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
