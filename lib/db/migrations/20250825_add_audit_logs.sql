-- Migration: create audit_logs table (idempotent)
CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  user_id text REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  data text,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs (user_id, created_at DESC);
