-- CTRL+ALT+BLOCK™ Badge System Database Migration
-- Creates all tables and inserts badge definitions for the new gamification system

BEGIN;

-- =====================================
-- BADGES TABLE (Badge Definitions)
-- =====================================

CREATE TABLE IF NOT EXISTS badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'ritual', 'wall', 'therapy', 'game', 'milestone'
  
  -- Scope & Access
  tier_scope TEXT NOT NULL CHECK (tier_scope IN ('ghost', 'firewall')),
  archetype_scope TEXT CHECK (archetype_scope IN ('DF', 'FB', 'GS', 'SN')), -- NULL for global badges
  
  -- Visual & UI
  art_url TEXT NOT NULL,
  share_template_id TEXT, -- For social sharing cards
  
  -- Rewards & Perks
  discount_percent INTEGER, -- 10, 15, 20, etc.
  discount_cap INTEGER, -- Max value in cents (e.g. 4000 = €40)
  
  -- System
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================
-- USER BADGES TABLE (Ownership)
-- =====================================

CREATE TABLE IF NOT EXISTS user_badges (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  
  -- Progress & State
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  applied_as_profile BOOLEAN NOT NULL DEFAULT false,
  
  -- Source tracking
  source_event TEXT NOT NULL, -- 'check_in_completed', 'ritual_completed', etc.
  
  -- Linked rewards
  discount_code_id TEXT, -- References discount_codes(id)
  
  UNIQUE(user_id, badge_id)
);

-- =====================================
-- BADGE EVENTS TABLE (Audit Trail)
-- =====================================

CREATE TABLE IF NOT EXISTS badge_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'check_in_completed', 'ritual_completed', etc.
  payload_json JSONB NOT NULL, -- Event-specific data
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================
-- DISCOUNT CODES TABLE (Rewards)
-- =====================================

CREATE TABLE IF NOT EXISTS discount_codes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE, -- Generated coupon code
  
  -- Value & Limits
  percent INTEGER NOT NULL, -- 10, 15, 20, etc.
  cap_value INTEGER, -- Max discount in cents
  
  -- Ownership & Usage
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ,
  
  -- System
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================
-- BADGE SETTINGS TABLE (Global Config)
-- =====================================

CREATE TABLE IF NOT EXISTS badge_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  
  -- Badge limits
  max_ghost_badges INTEGER NOT NULL DEFAULT 4,
  max_firewall_badges INTEGER NOT NULL DEFAULT 10,
  
  -- Feature toggles
  auto_profile_for_ghost BOOLEAN NOT NULL DEFAULT true,
  enable_sharing BOOLEAN NOT NULL DEFAULT true,
  require_moderation BOOLEAN NOT NULL DEFAULT false,
  
  -- Check-in system
  daily_checkin_enabled BOOLEAN NOT NULL DEFAULT true,
  streak_multiplier NUMERIC(3,1) NOT NULL DEFAULT 1.0,
  
  -- System
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================
-- INDEXES FOR PERFORMANCE
-- =====================================

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_profile ON user_badges(user_id, applied_as_profile) WHERE applied_as_profile = true;
CREATE INDEX IF NOT EXISTS idx_badge_events_user_id ON badge_events(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_events_type ON badge_events(event_type);
CREATE INDEX IF NOT EXISTS idx_badge_events_created ON badge_events(created_at);
CREATE INDEX IF NOT EXISTS idx_discount_codes_user ON discount_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_badges_tier_archetype ON badges(tier_scope, archetype_scope);

-- =====================================
-- BADGE DEFINITIONS INSERT
-- =====================================

-- Insert global settings
INSERT INTO badge_settings (id) VALUES ('global') ON CONFLICT (id) DO NOTHING;

-- Ghost Tier Badges (Available to all users)
INSERT INTO badges (id, name, description, category, tier_scope, archetype_scope, art_url, discount_percent, discount_cap) VALUES
('G0_Phantom', 'Phantom Protocol', 'First steps into the system - welcome to CTRL+ALT+BLOCK™', 'milestone', 'ghost', NULL, '/badges/g0-phantom.svg', 10, 1000),
('G1_Lurker', 'Digital Lurker', 'Consistent daily presence - the system notices you', 'ritual', 'ghost', NULL, '/badges/g1-lurker.svg', 10, 1500),
('G2_Presence', 'Manifest Presence', 'Regular ritual completion - your influence grows', 'ritual', 'ghost', NULL, '/badges/g2-presence.svg', 15, 2000),
('G3_Manifest', 'Full Manifestation', 'Deep system integration - maximum Ghost tier achievement', 'milestone', 'ghost', NULL, '/badges/g3-manifest.svg', 20, 2500)
ON CONFLICT (id) DO NOTHING;

-- Data Flooder (DF) Archetype Badges
INSERT INTO badges (id, name, description, category, tier_scope, archetype_scope, art_url, discount_percent, discount_cap) VALUES
('F1_DF', 'Stream Stabilized', 'Data flow patterns established - your overflow is controlled', 'ritual', 'firewall', 'DF', '/badges/f1-df.svg', 15, 2000),
('F2_DF', 'Signal Tuner', 'Ritual mastery achieved - fine-tuning the data streams', 'ritual', 'firewall', 'DF', '/badges/f2-df.svg', 20, 3000),
('F3_DF', 'Stream Navigator', 'Wall engagement master - guiding others through the flow', 'wall', 'firewall', 'DF', '/badges/f3-df.svg', 25, 4000),
('F4_DF', 'Data Sage', 'AI therapy integration - wisdom flows through digital streams', 'therapy', 'firewall', 'DF', '/badges/f4-df.svg', 30, 5000)
ON CONFLICT (id) DO NOTHING;

-- Firewall Builder (FB) Archetype Badges  
INSERT INTO badges (id, name, description, category, tier_scope, archetype_scope, art_url, discount_percent, discount_cap) VALUES
('F1_FB', 'Barrier Synchronized', 'Defensive patterns active - your firewall is online', 'ritual', 'firewall', 'FB', '/badges/f1-fb.svg', 15, 2000),
('F2_FB', 'Protocol Tuner', 'Security mastery achieved - fine-tuning protective barriers', 'ritual', 'firewall', 'FB', '/badges/f2-fb.svg', 20, 3000),
('F3_FB', 'Barrier Navigator', 'Wall engagement expert - helping others build defenses', 'wall', 'firewall', 'FB', '/badges/f3-fb.svg', 25, 4000),
('F4_FB', 'Firewall Sage', 'AI therapy breakthrough - barriers protect while healing flows', 'therapy', 'firewall', 'FB', '/badges/f4-fb.svg', 30, 5000)
ON CONFLICT (id) DO NOTHING;

-- Ghost in the Shell (GS) Archetype Badges
INSERT INTO badges (id, name, description, category, tier_scope, archetype_scope, art_url, discount_percent, discount_cap) VALUES
('F1_GS', 'Echo Stabilized', 'Phantom presence confirmed - you exist between the lines', 'ritual', 'firewall', 'GS', '/badges/f1-gs.svg', 15, 2000),
('F2_GS', 'Echo Tuner', 'Invisibility mastery - fine-tuning your spectral influence', 'ritual', 'firewall', 'GS', '/badges/f2-gs.svg', 20, 3000),
('F3_GS', 'Echo Navigator', 'Wall phase-walking - guiding others through digital shadows', 'wall', 'firewall', 'GS', '/badges/f3-gs.svg', 25, 4000),
('F4_GS', 'Ghost Sage', 'AI therapy transcendence - healing through ethereal connection', 'therapy', 'firewall', 'GS', '/badges/f4-gs.svg', 30, 5000)
ON CONFLICT (id) DO NOTHING;

-- Secure Node (SN) Archetype Badges
INSERT INTO badges (id, name, description, category, tier_scope, archetype_scope, art_url, discount_percent, discount_cap) VALUES
('F1_SN', 'Node Synchronized', 'Encrypted pathways active - your connection is secure', 'ritual', 'firewall', 'SN', '/badges/f1-sn.svg', 15, 2000),
('F2_SN', 'Node Tuner', 'Network mastery achieved - fine-tuning secure connections', 'ritual', 'firewall', 'SN', '/badges/f2-sn.svg', 20, 3000),
('F3_SN', 'Node Navigator', 'Wall encryption specialist - securing the community network', 'wall', 'firewall', 'SN', '/badges/f3-sn.svg', 25, 4000),
('F4_SN', 'Secure Sage', 'AI therapy encryption - healing through protected channels', 'therapy', 'firewall', 'SN', '/badges/f4-sn.svg', 30, 5000)
ON CONFLICT (id) DO NOTHING;

-- Global Firewall Badges (X-Series)
INSERT INTO badges (id, name, description, category, tier_scope, archetype_scope, art_url, discount_percent, discount_cap) VALUES
('X1_Firewall', 'Firewall Initiate', 'First steps beyond the Ghost tier - premium access unlocked', 'milestone', 'firewall', NULL, '/badges/x1-firewall.svg', 25, 5000),
('X2_Phoenix', 'Phoenix Protocol', 'Rebirth through streaks - rising from digital ashes', 'milestone', 'firewall', NULL, '/badges/x2-phoenix.svg', 40, 8000),
('X3_Eternal', 'Eternal Node', 'Transcendent achievement - beyond normal limitations', 'milestone', 'firewall', NULL, '/badges/x3-eternal.svg', 60, 12000),
('X4_Legend', 'System Legend', 'Maximum achievement - true mastery of CTRL+ALT+BLOCK™', 'milestone', 'firewall', NULL, '/badges/x4-legend.svg', 100, 20000)
ON CONFLICT (id) DO NOTHING;

COMMIT;
