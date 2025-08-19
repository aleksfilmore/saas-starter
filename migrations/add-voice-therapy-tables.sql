-- Add voice therapy credits and sessions tables
-- This migration adds support for voice therapy credit purchases and session tracking

CREATE TABLE IF NOT EXISTS voice_therapy_credits (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  minutes_purchased INTEGER NOT NULL,
  minutes_remaining INTEGER NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  stripe_session_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS voice_therapy_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  credit_id TEXT NOT NULL REFERENCES voice_therapy_credits(id),
  minutes_used INTEGER NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  persona TEXT,
  summary TEXT
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_voice_therapy_credits_user_id ON voice_therapy_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_therapy_credits_active ON voice_therapy_credits(user_id, is_active, expiry_date);
CREATE INDEX IF NOT EXISTS idx_voice_therapy_sessions_user_id ON voice_therapy_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_therapy_sessions_credit_id ON voice_therapy_sessions(credit_id);
