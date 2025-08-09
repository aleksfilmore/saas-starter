-- Daily Rituals Database Schema (Firewall Mode for Paid Users)
-- This schema supports the core daily ritual allocation, completion tracking, and streak management

-- Daily Ritual Assignments Table
CREATE TABLE IF NOT EXISTS daily_ritual_assignments (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL,
    ritual_1_id VARCHAR(100) NOT NULL, -- Links to PAID_RITUALS_DATABASE
    ritual_2_id VARCHAR(100) NOT NULL,
    allocation_mode VARCHAR(20) DEFAULT 'guided' CHECK (allocation_mode IN ('guided', 'random')),
    user_weeks_at_assignment INTEGER DEFAULT 0, -- For guided progression
    has_rerolled BOOLEAN DEFAULT FALSE,
    reroll_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, assigned_date)
);

-- Daily Ritual Completions Table  
CREATE TABLE IF NOT EXISTS daily_ritual_completions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assignment_id INTEGER NOT NULL REFERENCES daily_ritual_assignments(id) ON DELETE CASCADE,
    ritual_id VARCHAR(100) NOT NULL,
    journal_text TEXT NOT NULL, -- Minimum 140 chars for rewards
    mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 7),
    dwell_time_seconds INTEGER DEFAULT 0, -- Minimum 20s for anti-abuse
    word_count INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    bytes_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, assignment_id, ritual_id) -- Prevent duplicate completions
);

-- User Daily State Tracking
CREATE TABLE IF NOT EXISTS user_daily_state (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    state_date DATE NOT NULL,
    rituals_completed_today INTEGER DEFAULT 0,
    daily_cap_reached BOOLEAN DEFAULT FALSE,
    has_rerolled_today BOOLEAN DEFAULT FALSE,
    streak_days INTEGER DEFAULT 0,
    last_completion_date DATE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    total_weeks_active INTEGER DEFAULT 0, -- For progression system
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, state_date)
);

-- Ritual History (for 30-day no-repeat tracking)
CREATE TABLE IF NOT EXISTS user_ritual_history (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ritual_id VARCHAR(100) NOT NULL,
    last_assigned_date DATE NOT NULL,
    completion_count INTEGER DEFAULT 0,
    
    UNIQUE(user_id, ritual_id)
);

-- Analytics Events for Daily Rituals
CREATE TABLE IF NOT EXISTS daily_ritual_events (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- assigned, completed, rerolled, streak_broken, etc.
    event_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_daily_ritual_assignments_user_date ON daily_ritual_assignments(user_id, assigned_date);
CREATE INDEX IF NOT EXISTS idx_daily_ritual_completions_user_date ON daily_ritual_completions(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_daily_ritual_completions_assignment ON daily_ritual_completions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_state_user_date ON user_daily_state(user_id, state_date);
CREATE INDEX IF NOT EXISTS idx_user_ritual_history_user ON user_ritual_history(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_ritual_events_user_type ON daily_ritual_events(user_id, event_type);

-- Daily Ritual Completions Table
CREATE TABLE daily_ritual_completions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id INTEGER NOT NULL REFERENCES daily_ritual_assignments(id) ON DELETE CASCADE,
    ritual_id VARCHAR(100) NOT NULL,
    journal_text TEXT NOT NULL, -- Minimum 140 chars for rewards
    mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 7),
    dwell_time_seconds INTEGER DEFAULT 0, -- Minimum 20s for anti-abuse
    word_count INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,
    bytes_earned INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, assignment_id, ritual_id), -- Prevent duplicate completions
    INDEX(user_id, completed_at),
    INDEX(assignment_id)
);

-- User Daily State Tracking
CREATE TABLE user_daily_state (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    current_date DATE NOT NULL,
    rituals_completed_today INTEGER DEFAULT 0,
    daily_cap_reached BOOLEAN DEFAULT FALSE,
    has_rerolled_today BOOLEAN DEFAULT FALSE,
    streak_days INTEGER DEFAULT 0,
    last_completion_date DATE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    total_weeks_active INTEGER DEFAULT 0, -- For progression system
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, current_date),
    INDEX(user_id),
    INDEX(current_date)
);

-- Ritual History (for 30-day no-repeat tracking)
CREATE TABLE user_ritual_history (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ritual_id VARCHAR(100) NOT NULL,
    last_assigned_date DATE NOT NULL,
    completion_count INTEGER DEFAULT 0,
    
    UNIQUE(user_id, ritual_id),
    INDEX(user_id, last_assigned_date),
    INDEX(ritual_id)
);

-- Badge/Achievement Tracking for Cult Missions
CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL,
    badge_name VARCHAR(100) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}', -- For additional badge data
    
    UNIQUE(user_id, badge_type, badge_name),
    INDEX(user_id),
    INDEX(badge_type)
);

-- Analytics Events for Daily Rituals
CREATE TABLE daily_ritual_events (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    INDEX(user_id, event_type),
    INDEX(created_at),
    INDEX(event_type)
);

-- Daily Ritual Configuration (for feature flags and A/B testing)
CREATE TABLE daily_ritual_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration
INSERT INTO daily_ritual_config (config_key, config_value) VALUES
('allocation_mode', '"guided"'),
('daily_ritual_cap', '2'),
('min_journal_chars', '140'),
('min_dwell_time_seconds', '20'),
('no_repeat_days', '30'),
('streak_bonus_threshold', '{"day_3": 3, "day_7": 5}'),
('category_progression_weeks', '{"weeks_1_2": {"grief-cycle": 30, "petty-purge": 30, "soft-reset": 20, "reframe-loop": 20}, "weeks_3_4": {"grief-cycle": 15, "petty-purge": 15, "soft-reset": 10, "reframe-loop": 25, "glow-up-forge": 25, "ghost-cleanse": 10}, "weeks_5_8": {"grief-cycle": 10, "petty-purge": 10, "soft-reset": 5, "reframe-loop": 15, "glow-up-forge": 20, "ghost-cleanse": 20, "public-face": 15, "cult-missions": 5}, "weeks_9_plus": {"grief-cycle": 5, "petty-purge": 5, "soft-reset": 10, "reframe-loop": 10, "glow-up-forge": 20, "ghost-cleanse": 20, "public-face": 20, "cult-missions": 10}}'),
('reset_schedule', '"midnight_user_timezone"');

-- Functions for Daily Ritual Management

-- Function to get user's current week progression
CREATE OR REPLACE FUNCTION get_user_progression_weeks(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    weeks_active INTEGER;
BEGIN
    SELECT total_weeks_active INTO weeks_active
    FROM user_daily_state 
    WHERE user_id = user_uuid 
    ORDER BY updated_at DESC 
    LIMIT 1;
    
    RETURN COALESCE(weeks_active, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to check if ritual was used recently (no-repeat enforcement)
CREATE OR REPLACE FUNCTION is_ritual_recently_used(user_uuid UUID, ritual_code VARCHAR(100), days_threshold INTEGER DEFAULT 30)
RETURNS BOOLEAN AS $$
DECLARE
    last_used DATE;
BEGIN
    SELECT last_assigned_date INTO last_used
    FROM user_ritual_history 
    WHERE user_id = user_uuid AND ritual_id = ritual_code;
    
    IF last_used IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN (CURRENT_DATE - last_used) < days_threshold;
END;
$$ LANGUAGE plpgsql;

-- Function to update user streak
CREATE OR REPLACE FUNCTION update_user_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    current_streak INTEGER;
    last_completion DATE;
    today DATE := CURRENT_DATE;
BEGIN
    SELECT streak_days, last_completion_date 
    INTO current_streak, last_completion
    FROM user_daily_state 
    WHERE user_id = user_uuid 
    ORDER BY updated_at DESC 
    LIMIT 1;
    
    IF last_completion IS NULL THEN
        -- First ever completion
        current_streak := 1;
    ELSIF last_completion = today THEN
        -- Already completed today, no change
        RETURN current_streak;
    ELSIF last_completion = (today - INTERVAL '1 day')::DATE THEN
        -- Consecutive day
        current_streak := current_streak + 1;
    ELSE
        -- Streak broken
        current_streak := 1;
    END IF;
    
    -- Update user daily state
    INSERT INTO user_daily_state (user_id, current_date, streak_days, last_completion_date)
    VALUES (user_uuid, today, current_streak, today)
    ON CONFLICT (user_id, current_date) 
    DO UPDATE SET 
        streak_days = current_streak,
        last_completion_date = today,
        updated_at = NOW();
    
    RETURN current_streak;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies for Security
ALTER TABLE daily_ritual_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_ritual_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ritual_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_ritual_events ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can access own ritual assignments" ON daily_ritual_assignments
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own ritual completions" ON daily_ritual_completions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own daily state" ON user_daily_state
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own ritual history" ON user_ritual_history
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own badges" ON user_badges
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own events" ON daily_ritual_events
    FOR ALL USING (auth.uid() = user_id);

-- Config table is read-only for all authenticated users
CREATE POLICY "Authenticated users can read config" ON daily_ritual_config
    FOR SELECT USING (auth.role() = 'authenticated');
