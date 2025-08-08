-- Migration: Add Ritual Journal Tables
-- Date: 2025-08-08
-- Purpose: Add journal functionality to rituals for both free and premium users

-- Create ritual entries table for journal functionality
CREATE TABLE IF NOT EXISTS ritual_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ritual_code VARCHAR(64) NOT NULL,
  ritual_title VARCHAR(128),
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Journal data
  mood INTEGER, -- 1-7 scale
  what_i_did TEXT, -- "What did you do?"
  how_i_feel TEXT, -- "How do you feel now?"
  tags VARCHAR(256), -- comma-separated tags for premium users
  source VARCHAR(16) DEFAULT 'text', -- 'text' or 'voice'
  
  -- Metadata for XP/Bytes validation
  time_spent_seconds INTEGER, -- Track dwell time for XP validation
  text_length INTEGER, -- Combined length for XP validation
  xp_awarded INTEGER DEFAULT 0, -- Track XP given for this entry
  bytes_awarded INTEGER DEFAULT 0, -- Track Bytes given for this entry
  
  -- AI & Analysis (for premium users)
  tokens_used INTEGER DEFAULT 0, -- for AI digest accounting
  summary_id TEXT, -- link to weekly summary
  sentiment VARCHAR(16), -- positive, neutral, negative
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP -- soft delete
);

-- Create weekly summaries table for AI-generated insights (premium users)
CREATE TABLE IF NOT EXISTS weekly_summaries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start TIMESTAMP NOT NULL, -- Monday of the week
  week_end TIMESTAMP NOT NULL, -- Sunday of the week
  
  -- AI-generated content
  bullets TEXT, -- JSON array of 3 key insights
  sentiment_avg INTEGER, -- 1-7 average mood for the week
  next_suggestion TEXT, -- AI suggested next ritual
  entry_count INTEGER DEFAULT 0, -- Number of entries analyzed
  
  -- Metadata
  tokens_used INTEGER DEFAULT 0,
  generated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ritual_entries_user_date ON ritual_entries(user_id, performed_at);
CREATE INDEX IF NOT EXISTS idx_ritual_entries_user_ritual ON ritual_entries(user_id, ritual_code);
CREATE INDEX IF NOT EXISTS idx_ritual_entries_user_created ON ritual_entries(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user_week ON weekly_summaries(user_id, week_start);

-- Add some sample ritual codes for reference
COMMENT ON COLUMN ritual_entries.ritual_code IS 'Ritual identifier: breath_firewall, digital_detox, mindfulness_scan, etc.';
COMMENT ON COLUMN ritual_entries.source IS 'Entry method: text (typed) or voice (speech-to-text)';
COMMENT ON COLUMN ritual_entries.time_spent_seconds IS 'Minimum 20 seconds required for XP/Bytes award';
COMMENT ON COLUMN ritual_entries.text_length IS 'Combined length of what_i_did + how_i_feel for validation';
