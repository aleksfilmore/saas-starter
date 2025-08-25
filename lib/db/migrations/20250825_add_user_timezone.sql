-- Migration: add timezone column to users (safe add)
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'UTC';