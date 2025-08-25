-- Migration: add ai_therapy_message_purchases table
-- Generated manually (ensure idempotency checks if rerun)

CREATE TABLE IF NOT EXISTS ai_therapy_message_purchases (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  messages_granted integer NOT NULL,
  messages_used integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Helpful index for expiration & filtering
CREATE INDEX IF NOT EXISTS idx_ai_therapy_message_purchases_user_active
  ON ai_therapy_message_purchases (user_id, expires_at);
