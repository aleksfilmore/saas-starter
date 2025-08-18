-- Database Performance Indexes for SaaS Starter
-- Run these indexes to improve query performance

-- Users table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_tier ON users(tier);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_tier_status ON users(tier, status);

-- User rituals indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_rituals_user_id ON user_rituals(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_rituals_date ON user_rituals(date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_rituals_completed ON user_rituals(completed);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_rituals_user_date ON user_rituals(user_id, date);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_rituals_user_completed ON user_rituals(user_id, completed);

-- Wall posts indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_anonymous_posts_created_at ON anonymous_posts(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_anonymous_posts_status ON anonymous_posts(status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_anonymous_posts_user_id ON anonymous_posts(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_anonymous_posts_user_created ON anonymous_posts(user_id, created_at);

-- Wall reactions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wall_post_reactions_post_id ON wall_post_reactions(post_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wall_post_reactions_user_id ON wall_post_reactions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_wall_post_reactions_unique ON wall_post_reactions(post_id, user_id);

-- Achievements indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_achievements_earned_at ON achievements(earned_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_achievements_type ON achievements(type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_achievements_user_type ON achievements(user_id, type);

-- Analytics events indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_user_name ON analytics_events(user_id, event_name);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_name_timestamp ON analytics_events(event_name, timestamp);

-- Subscription events indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_events_user_id ON subscription_events(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_events_stripe_sub_id ON subscription_events(stripe_subscription_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_events_event_type ON subscription_events(event_type);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_events_timestamp ON subscription_events(timestamp);

-- Sessions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Journal entries indexes (if exists)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_journal_entries_user_created ON journal_entries(user_id, created_at);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active_paid ON users(tier, status) WHERE status = 'active' AND tier = 'paid';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_rituals_recent ON user_rituals(user_id, date) WHERE date >= CURRENT_DATE - INTERVAL '30 days';
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_recent ON analytics_events(event_name, timestamp) WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days';
