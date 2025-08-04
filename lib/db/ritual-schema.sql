-- RITUAL SYSTEM DATABASE SCHEMA
-- Implements the exact spec from your detailed implementation plan

-- Master ritual library table
CREATE TABLE rituals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL, -- Array of step objects with type, content, etc.
  archetype TEXT[] NOT NULL, -- ['FIREWALL_BUILDER', 'GHOST_IN_SHELL', etc.]
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 5) NOT NULL DEFAULT 1,
  media_refs JSONB DEFAULT '{}', -- {audio: 'url', image: 'url', video: 'url'}
  tags TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['breath', 'boundaries', 'creativity']
  category TEXT NOT NULL, -- From existing categories: 'grief-cycle', 'petty-purge', etc.
  emotional_tone TEXT CHECK (emotional_tone IN ('rage', 'softness', 'grief', 'spite', 'neutral')) DEFAULT 'neutral',
  action_type TEXT CHECK (action_type IN ('reflect', 'destroy', 'create', 'share', 'digital')) DEFAULT 'reflect',
  tier TEXT CHECK (tier IN ('ghost', 'firewall', 'deep-reset')) DEFAULT 'ghost',
  estimated_time TEXT DEFAULT '10 minutes',
  xp_reward INTEGER DEFAULT 15,
  byte_reward INTEGER DEFAULT 25,
  is_milestone BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User ritual delivery and completion tracking
CREATE TABLE user_rituals (
  user_id UUID NOT NULL,
  ritual_id UUID NOT NULL REFERENCES rituals(id) ON DELETE CASCADE,
  delivered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  rerolled BOOLEAN DEFAULT false,
  is_current BOOLEAN DEFAULT false, -- Only one current ritual per user
  xp_earned INTEGER DEFAULT 0,
  bytes_earned INTEGER DEFAULT 0,
  PRIMARY KEY(user_id, ritual_id)
);

-- Add fields to users table for ritual system
ALTER TABLE users ADD COLUMN IF NOT EXISTS ux_stage TEXT CHECK (ux_stage IN ('welcome', 'starter', 'core', 'power')) DEFAULT 'welcome';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_reroll_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS archetype TEXT; -- User's primary archetype
ALTER TABLE users ADD COLUMN IF NOT EXISTS ritual_tier TEXT CHECK (ritual_tier IN ('ghost', 'firewall', 'deep-reset')) DEFAULT 'ghost';

-- Indexes for performance
CREATE INDEX idx_user_rituals_user_current ON user_rituals(user_id, is_current) WHERE is_current = true;
CREATE INDEX idx_user_rituals_completed ON user_rituals(user_id, completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX idx_rituals_archetype ON rituals USING GIN(archetype);
CREATE INDEX idx_rituals_difficulty ON rituals(difficulty);
CREATE INDEX idx_rituals_category ON rituals(category);

-- Function to get next ritual for user based on archetype and difficulty
CREATE OR REPLACE FUNCTION get_next_ritual_for_user(p_user_id UUID) 
RETURNS TABLE(
  ritual_id UUID,
  title TEXT,
  description TEXT,
  steps JSONB,
  difficulty INTEGER,
  xp_reward INTEGER,
  byte_reward INTEGER,
  estimated_time TEXT
) AS $$
DECLARE
  user_archetype TEXT;
  user_tier TEXT;
  user_mood INTEGER;
BEGIN
  -- Get user info
  SELECT archetype, ritual_tier 
  INTO user_archetype, user_tier 
  FROM users 
  WHERE id = p_user_id;
  
  -- Get current mood (if available)
  SELECT mood_level INTO user_mood 
  FROM mood_checkins 
  WHERE user_id = p_user_id 
  ORDER BY created_at DESC 
  LIMIT 1;
  
  -- Return ritual based on archetype, excluding already delivered ones
  RETURN QUERY
  SELECT 
    r.id,
    r.title,
    r.description,
    r.steps,
    r.difficulty,
    r.xp_reward,
    r.byte_reward,
    r.estimated_time
  FROM rituals r
  WHERE 
    -- Match archetype or allow universal rituals
    (user_archetype = ANY(r.archetype) OR 'UNIVERSAL' = ANY(r.archetype))
    -- Match tier level
    AND r.tier = user_tier
    -- Exclude already delivered rituals
    AND r.id NOT IN (
      SELECT ritual_id FROM user_rituals WHERE user_id = p_user_id
    )
    -- Soft reset override for low mood
    AND (
      user_mood IS NULL 
      OR user_mood > 3 
      OR (user_mood <= 3 AND r.category = 'soft-reset')
    )
  ORDER BY 
    -- Prioritize soft-reset if mood is low
    CASE WHEN user_mood <= 3 AND r.category = 'soft-reset' THEN 1 ELSE 2 END,
    -- Then by difficulty appropriate to user
    ABS(r.difficulty - LEAST(3, GREATEST(1, COALESCE(user_tier_difficulty(user_tier), 2)))),
    -- Then random
    RANDOM()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Helper function for tier difficulty mapping
CREATE OR REPLACE FUNCTION user_tier_difficulty(tier TEXT) RETURNS INTEGER AS $$
BEGIN
  RETURN CASE 
    WHEN tier = 'ghost' THEN 2
    WHEN tier = 'firewall' THEN 3
    WHEN tier = 'deep-reset' THEN 4
    ELSE 2
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to complete a ritual
CREATE OR REPLACE FUNCTION complete_ritual(
  p_user_id UUID, 
  p_ritual_id UUID
) RETURNS JSONB AS $$
DECLARE
  ritual_xp INTEGER;
  ritual_bytes INTEGER;
  result JSONB;
BEGIN
  -- Get ritual rewards
  SELECT xp_reward, byte_reward 
  INTO ritual_xp, ritual_bytes 
  FROM rituals 
  WHERE id = p_ritual_id;
  
  -- Mark ritual as completed
  UPDATE user_rituals 
  SET 
    completed_at = now(),
    is_current = false,
    xp_earned = ritual_xp,
    bytes_earned = ritual_bytes
  WHERE user_id = p_user_id AND ritual_id = p_ritual_id;
  
  -- Update user totals (assuming you have these columns)
  UPDATE users 
  SET 
    total_xp = COALESCE(total_xp, 0) + ritual_xp,
    total_bytes = COALESCE(total_bytes, 0) + ritual_bytes,
    last_ritual_completed = now()
  WHERE id = p_user_id;
  
  -- Return result
  result := jsonb_build_object(
    'success', true,
    'xp_earned', ritual_xp,
    'bytes_earned', ritual_bytes,
    'completed_at', now()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Add missing columns to users table if they don't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_bytes INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_ritual_completed TIMESTAMPTZ;
