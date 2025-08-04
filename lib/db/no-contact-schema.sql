-- NO-CONTACT TRACKER SCHEMA
-- Implements the 90-day streak system with weekly shield mechanic

-- User streak tracking
CREATE TABLE no_contact_streaks (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_day INTEGER NOT NULL DEFAULT 0 CHECK (current_day >= 0 AND current_day <= 90),
  shield_used_at TIMESTAMPTZ,
  last_interaction_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Static message bank (90 messages)
CREATE TABLE no_contact_messages (
  day INTEGER PRIMARY KEY CHECK (day >= 1 AND day <= 90),
  body TEXT NOT NULL,
  is_milestone BOOLEAN DEFAULT false,
  bytes_reward INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_no_contact_streaks_current_day ON no_contact_streaks(current_day);
CREATE INDEX idx_no_contact_streaks_shield ON no_contact_streaks(shield_used_at) WHERE shield_used_at IS NOT NULL;

-- Function to check if shield is available (once per week)
CREATE OR REPLACE FUNCTION shield_available(p_user_id UUID) RETURNS BOOLEAN AS $$
DECLARE
  last_shield TIMESTAMPTZ;
BEGIN
  SELECT shield_used_at INTO last_shield 
  FROM no_contact_streaks 
  WHERE user_id = p_user_id;
  
  RETURN (last_shield IS NULL OR last_shield < now() - interval '7 days');
END;
$$ LANGUAGE plpgsql;

-- Function to handle slip with optional shield usage
CREATE OR REPLACE FUNCTION handle_streak_slip(
  p_user_id UUID, 
  p_use_shield BOOLEAN DEFAULT false
) RETURNS JSONB AS $$
DECLARE
  can_use_shield BOOLEAN;
  result JSONB;
BEGIN
  -- Check if shield is available
  can_use_shield := shield_available(p_user_id);
  
  IF p_use_shield AND can_use_shield THEN
    -- Use shield - keep streak but mark shield as used
    UPDATE no_contact_streaks 
    SET 
      shield_used_at = now(),
      last_interaction_at = now(),
      updated_at = now()
    WHERE user_id = p_user_id;
    
    result := jsonb_build_object(
      'shield_used', true,
      'streak_preserved', true,
      'message', 'Shield activated! Streak preserved.'
    );
  ELSE
    -- Reset streak
    UPDATE no_contact_streaks 
    SET 
      current_day = 0,
      start_at = now(),
      last_interaction_at = now(),
      updated_at = now()
    WHERE user_id = p_user_id;
    
    -- Insert if not exists
    INSERT INTO no_contact_streaks (user_id, current_day, start_at, last_interaction_at)
    VALUES (p_user_id, 0, now(), now())
    ON CONFLICT (user_id) DO NOTHING;
    
    result := jsonb_build_object(
      'shield_used', false,
      'streak_preserved', false,
      'message', 'Streak reset. Starting fresh.'
    );
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get current streak message
CREATE OR REPLACE FUNCTION get_streak_message(p_user_id UUID) 
RETURNS TABLE(
  day INTEGER,
  body TEXT,
  is_milestone BOOLEAN,
  bytes_reward INTEGER,
  shield_available BOOLEAN
) AS $$
DECLARE
  user_day INTEGER;
BEGIN
  -- Get user's current day
  SELECT COALESCE(current_day, 0) INTO user_day
  FROM no_contact_streaks 
  WHERE user_id = p_user_id;
  
  -- Default to day 1 if no streak found
  IF user_day IS NULL THEN
    user_day := 1;
  ELSIF user_day = 0 THEN
    user_day := 1;
  END IF;
  
  -- Ensure we don't exceed 90
  user_day := LEAST(user_day, 90);
  
  RETURN QUERY
  SELECT 
    m.day,
    m.body,
    m.is_milestone,
    m.bytes_reward,
    shield_available(p_user_id)
  FROM no_contact_messages m
  WHERE m.day = user_day;
END;
$$ LANGUAGE plpgsql;
