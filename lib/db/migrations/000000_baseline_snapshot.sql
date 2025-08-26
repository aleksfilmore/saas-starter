-- Baseline snapshot (auto-generated)
-- Generated at 2025-08-26T07:38:43.575Z
-- Idempotent guards included so it can be re-applied safely.

BEGIN;

DO $$ BEGIN
  CREATE TYPE "analytics_event_source" AS ENUM ('checkin', 'no_contact', 'ritual', 'ritual_complete', 'wall_interact', 'ai_chat', 'wall_post', 'unknown');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Table: _manual_migrations
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='_manual_migrations') THEN
    EXECUTE 'CREATE TABLE "_manual_migrations" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "_manual_migrations" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''_manual_migrations_id_seq''::regclass) NOT NULL;
ALTER TABLE "_manual_migrations" ADD COLUMN IF NOT EXISTS "filename" text NOT NULL;
ALTER TABLE "_manual_migrations" ADD COLUMN IF NOT EXISTS "applied_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='_manual_migrations' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "_manual_migrations" DROP COLUMN placeholder'; END IF; END $$;

-- Table: achievement_milestones
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='achievement_milestones') THEN
    EXECUTE 'CREATE TABLE "achievement_milestones" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "achievement_milestones" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''achievement_milestones_id_seq''::regclass) NOT NULL;
ALTER TABLE "achievement_milestones" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "achievement_milestones" ADD COLUMN IF NOT EXISTS "milestone_type" text NOT NULL;
ALTER TABLE "achievement_milestones" ADD COLUMN IF NOT EXISTS "milestone_value" integer NOT NULL;
ALTER TABLE "achievement_milestones" ADD COLUMN IF NOT EXISTS "achieved_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='achievement_milestones' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "achievement_milestones" DROP COLUMN placeholder'; END IF; END $$;

-- Table: achievement_progress
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='achievement_progress') THEN
    EXECUTE 'CREATE TABLE "achievement_progress" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "achievement_progress" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "achievement_progress" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "achievement_progress" ADD COLUMN IF NOT EXISTS "achievement_id" text NOT NULL;
ALTER TABLE "achievement_progress" ADD COLUMN IF NOT EXISTS "current_value" integer DEFAULT 0 NOT NULL;
ALTER TABLE "achievement_progress" ADD COLUMN IF NOT EXISTS "target_value" integer NOT NULL;
ALTER TABLE "achievement_progress" ADD COLUMN IF NOT EXISTS "progress_percentage" float4 DEFAULT 0 NOT NULL;
ALTER TABLE "achievement_progress" ADD COLUMN IF NOT EXISTS "last_updated" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "achievement_progress" ADD COLUMN IF NOT EXISTS "first_progress_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "achievement_progress" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='achievement_progress' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "achievement_progress" DROP COLUMN placeholder'; END IF; END $$;

-- Table: activity_logs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='activity_logs') THEN
    EXECUTE 'CREATE TABLE "activity_logs" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "activity_logs" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''activity_logs_id_seq''::regclass) NOT NULL;
ALTER TABLE "activity_logs" ADD COLUMN IF NOT EXISTS "team_id" integer NOT NULL;
ALTER TABLE "activity_logs" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "activity_logs" ADD COLUMN IF NOT EXISTS "action" text NOT NULL;
ALTER TABLE "activity_logs" ADD COLUMN IF NOT EXISTS "timestamp" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "activity_logs" ADD COLUMN IF NOT EXISTS "ip_address" varchar;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activity_logs' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "activity_logs" DROP COLUMN placeholder'; END IF; END $$;

-- Table: admin_audit_log
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='admin_audit_log') THEN
    EXECUTE 'CREATE TABLE "admin_audit_log" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "admin_audit_log" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "admin_audit_log" ADD COLUMN IF NOT EXISTS "admin_user_id" text NOT NULL;
ALTER TABLE "admin_audit_log" ADD COLUMN IF NOT EXISTS "action" text NOT NULL;
ALTER TABLE "admin_audit_log" ADD COLUMN IF NOT EXISTS "target_user_id" text;
ALTER TABLE "admin_audit_log" ADD COLUMN IF NOT EXISTS "target_resource_id" text;
ALTER TABLE "admin_audit_log" ADD COLUMN IF NOT EXISTS "old_value" text;
ALTER TABLE "admin_audit_log" ADD COLUMN IF NOT EXISTS "new_value" text;
ALTER TABLE "admin_audit_log" ADD COLUMN IF NOT EXISTS "reason" text;
ALTER TABLE "admin_audit_log" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_audit_log' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "admin_audit_log" DROP COLUMN placeholder'; END IF; END $$;

-- Table: ai_letters
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ai_letters') THEN
    EXECUTE 'CREATE TABLE "ai_letters" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "ai_letters" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "ai_letters" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "ai_letters" ADD COLUMN IF NOT EXISTS "letter_type" text NOT NULL;
ALTER TABLE "ai_letters" ADD COLUMN IF NOT EXISTS "recipient" text NOT NULL;
ALTER TABLE "ai_letters" ADD COLUMN IF NOT EXISTS "emotion" text NOT NULL;
ALTER TABLE "ai_letters" ADD COLUMN IF NOT EXISTS "scenario" text NOT NULL;
ALTER TABLE "ai_letters" ADD COLUMN IF NOT EXISTS "generated_content" text NOT NULL;
ALTER TABLE "ai_letters" ADD COLUMN IF NOT EXISTS "is_private" boolean DEFAULT true NOT NULL;
ALTER TABLE "ai_letters" ADD COLUMN IF NOT EXISTS "was_sent" boolean DEFAULT false NOT NULL;
ALTER TABLE "ai_letters" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_letters' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "ai_letters" DROP COLUMN placeholder'; END IF; END $$;

-- Table: ai_therapy_message_purchases
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ai_therapy_message_purchases') THEN
    EXECUTE 'CREATE TABLE "ai_therapy_message_purchases" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "ai_therapy_message_purchases" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "ai_therapy_message_purchases" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "ai_therapy_message_purchases" ADD COLUMN IF NOT EXISTS "messages_granted" integer NOT NULL;
ALTER TABLE "ai_therapy_message_purchases" ADD COLUMN IF NOT EXISTS "messages_used" integer DEFAULT 0 NOT NULL;
ALTER TABLE "ai_therapy_message_purchases" ADD COLUMN IF NOT EXISTS "expires_at" timestamptz NOT NULL;
ALTER TABLE "ai_therapy_message_purchases" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_therapy_message_purchases' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "ai_therapy_message_purchases" DROP COLUMN placeholder'; END IF; END $$;

-- Table: analytics_events
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='analytics_events') THEN
    EXECUTE 'CREATE TABLE "analytics_events" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "session_id" text;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "event" text NOT NULL;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "timestamp" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "user_agent" text;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "ip" text;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "referer" text;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "source" analytics_event_source DEFAULT ''unknown''::analytics_event_source NOT NULL;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "properties" jsonb;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='analytics_events' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "analytics_events" DROP COLUMN placeholder'; END IF; END $$;

-- Table: anonymous_post_hearts
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='anonymous_post_hearts') THEN
    EXECUTE 'CREATE TABLE "anonymous_post_hearts" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "anonymous_post_hearts" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "anonymous_post_hearts" ADD COLUMN IF NOT EXISTS "post_id" text NOT NULL;
ALTER TABLE "anonymous_post_hearts" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "anonymous_post_hearts" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_post_hearts' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "anonymous_post_hearts" DROP COLUMN placeholder'; END IF; END $$;

-- Table: anonymous_posts
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='anonymous_posts') THEN
    EXECUTE 'CREATE TABLE "anonymous_posts" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "content" text NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "category" text DEFAULT ''general''::text NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "hearts" integer DEFAULT 0 NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "glitch_title" text;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "glitch_category" text DEFAULT ''general''::text NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "glitch_overlay" text;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "resonate_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "same_loop_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "dragged_me_too_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "stone_cold_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "cleansed_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "comment_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "bytes_earned" integer DEFAULT 25 NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "is_anonymous" boolean DEFAULT true NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "is_featured" boolean DEFAULT false NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "is_oracle_post" boolean DEFAULT false NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "is_viral_awarded" boolean DEFAULT false NOT NULL;
ALTER TABLE "anonymous_posts" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "anonymous_posts" DROP COLUMN placeholder'; END IF; END $$;

-- Table: api_usage
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='api_usage') THEN
    EXECUTE 'CREATE TABLE "api_usage" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "api_usage" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "api_usage" ADD COLUMN IF NOT EXISTS "service" text NOT NULL;
ALTER TABLE "api_usage" ADD COLUMN IF NOT EXISTS "endpoint" text;
ALTER TABLE "api_usage" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "api_usage" ADD COLUMN IF NOT EXISTS "tokens_used" integer;
ALTER TABLE "api_usage" ADD COLUMN IF NOT EXISTS "cost_cents" integer;
ALTER TABLE "api_usage" ADD COLUMN IF NOT EXISTS "request_data" text;
ALTER TABLE "api_usage" ADD COLUMN IF NOT EXISTS "response_data" text;
ALTER TABLE "api_usage" ADD COLUMN IF NOT EXISTS "status" text;
ALTER TABLE "api_usage" ADD COLUMN IF NOT EXISTS "error_message" text;
ALTER TABLE "api_usage" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_usage' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "api_usage" DROP COLUMN placeholder'; END IF; END $$;

-- Table: audit_logs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='audit_logs') THEN
    EXECUTE 'CREATE TABLE "audit_logs" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "action" text NOT NULL;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "data" text;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "ip" text;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "user_agent" text;
ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_logs' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "audit_logs" DROP COLUMN placeholder'; END IF; END $$;

-- Table: badge_collections
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='badge_collections') THEN
    EXECUTE 'CREATE TABLE "badge_collections" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "badge_collections" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "badge_collections" ADD COLUMN IF NOT EXISTS "name" text NOT NULL;
ALTER TABLE "badge_collections" ADD COLUMN IF NOT EXISTS "description" text NOT NULL;
ALTER TABLE "badge_collections" ADD COLUMN IF NOT EXISTS "icon_url" text NOT NULL;
ALTER TABLE "badge_collections" ADD COLUMN IF NOT EXISTS "required_badges" _text NOT NULL;
ALTER TABLE "badge_collections" ADD COLUMN IF NOT EXISTS "collection_reward_xp" integer DEFAULT 0;
ALTER TABLE "badge_collections" ADD COLUMN IF NOT EXISTS "collection_reward_bytes" integer DEFAULT 0;
ALTER TABLE "badge_collections" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "badge_collections" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='badge_collections' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "badge_collections" DROP COLUMN placeholder'; END IF; END $$;

-- Table: badge_events
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='badge_events') THEN
    EXECUTE 'CREATE TABLE "badge_events" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "badge_events" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "badge_events" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "badge_events" ADD COLUMN IF NOT EXISTS "event_type" text NOT NULL;
ALTER TABLE "badge_events" ADD COLUMN IF NOT EXISTS "payload_json" jsonb NOT NULL;
ALTER TABLE "badge_events" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='badge_events' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "badge_events" DROP COLUMN placeholder'; END IF; END $$;

-- Table: badge_settings
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='badge_settings') THEN
    EXECUTE 'CREATE TABLE "badge_settings" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "badge_settings" ADD COLUMN IF NOT EXISTS "id" text DEFAULT ''global''::text NOT NULL;
ALTER TABLE "badge_settings" ADD COLUMN IF NOT EXISTS "max_ghost_badges" integer DEFAULT 4 NOT NULL;
ALTER TABLE "badge_settings" ADD COLUMN IF NOT EXISTS "max_firewall_badges" integer DEFAULT 10 NOT NULL;
ALTER TABLE "badge_settings" ADD COLUMN IF NOT EXISTS "auto_profile_for_ghost" boolean DEFAULT true NOT NULL;
ALTER TABLE "badge_settings" ADD COLUMN IF NOT EXISTS "enable_sharing" boolean DEFAULT true NOT NULL;
ALTER TABLE "badge_settings" ADD COLUMN IF NOT EXISTS "require_moderation" boolean DEFAULT false NOT NULL;
ALTER TABLE "badge_settings" ADD COLUMN IF NOT EXISTS "daily_checkin_enabled" boolean DEFAULT true NOT NULL;
ALTER TABLE "badge_settings" ADD COLUMN IF NOT EXISTS "streak_multiplier" numeric DEFAULT 1.0 NOT NULL;
ALTER TABLE "badge_settings" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='badge_settings' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "badge_settings" DROP COLUMN placeholder'; END IF; END $$;

-- Table: badges
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='badges') THEN
    EXECUTE 'CREATE TABLE "badges" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "name" text NOT NULL;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "description" text NOT NULL;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "icon_url" text NOT NULL;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "category" text NOT NULL;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "byte_reward" integer DEFAULT 0 NOT NULL;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "tier_scope" text NOT NULL;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "archetype_scope" text;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "art_url" text;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "discount_percent" integer;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "discount_cap" integer;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "code" text DEFAULT ''''::text NOT NULL;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "share_template_id" text;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "rarity" text DEFAULT ''common''::text NOT NULL;
ALTER TABLE "badges" ADD COLUMN IF NOT EXISTS "kind" text DEFAULT ''progression''::text NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='badges' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "badges" DROP COLUMN placeholder'; END IF; END $$;

-- Table: blog_posts
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='blog_posts') THEN
    EXECUTE 'CREATE TABLE "blog_posts" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "slug" text NOT NULL;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "title" text NOT NULL;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "excerpt" text;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "content" text NOT NULL;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "author_id" text NOT NULL;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "status" text DEFAULT ''draft''::text NOT NULL;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "featured_image" text;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "meta_title" text;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "meta_description" text;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "tags" _text;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "category" text;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "reading_time" integer;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "published_at" timestamptz;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blog_posts' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "blog_posts" DROP COLUMN placeholder'; END IF; END $$;

-- Table: byte_earning_rules
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='byte_earning_rules') THEN
    EXECUTE 'CREATE TABLE "byte_earning_rules" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "byte_earning_rules" ADD COLUMN IF NOT EXISTS "id" text DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE "byte_earning_rules" ADD COLUMN IF NOT EXISTS "activity" text NOT NULL;
ALTER TABLE "byte_earning_rules" ADD COLUMN IF NOT EXISTS "byte_reward" integer NOT NULL;
ALTER TABLE "byte_earning_rules" ADD COLUMN IF NOT EXISTS "daily_limit" integer;
ALTER TABLE "byte_earning_rules" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "byte_earning_rules" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "byte_earning_rules" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE "byte_earning_rules" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='byte_earning_rules' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "byte_earning_rules" DROP COLUMN placeholder'; END IF; END $$;

-- Table: conversion_funnels
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='conversion_funnels') THEN
    EXECUTE 'CREATE TABLE "conversion_funnels" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "conversion_funnels" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "conversion_funnels" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "conversion_funnels" ADD COLUMN IF NOT EXISTS "funnel_name" text NOT NULL;
ALTER TABLE "conversion_funnels" ADD COLUMN IF NOT EXISTS "stage" text NOT NULL;
ALTER TABLE "conversion_funnels" ADD COLUMN IF NOT EXISTS "timestamp" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "conversion_funnels" ADD COLUMN IF NOT EXISTS "properties" text;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='conversion_funnels' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "conversion_funnels" DROP COLUMN placeholder'; END IF; END $$;

-- Table: daily_check_ins
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_check_ins') THEN
    EXECUTE 'CREATE TABLE "daily_check_ins" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "daily_check_ins" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "daily_check_ins" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "daily_check_ins" ADD COLUMN IF NOT EXISTS "period_id" text NOT NULL;
ALTER TABLE "daily_check_ins" ADD COLUMN IF NOT EXISTS "check_in_date" timestamptz NOT NULL;
ALTER TABLE "daily_check_ins" ADD COLUMN IF NOT EXISTS "did_text_trash" boolean DEFAULT false NOT NULL;
ALTER TABLE "daily_check_ins" ADD COLUMN IF NOT EXISTS "mood" integer NOT NULL;
ALTER TABLE "daily_check_ins" ADD COLUMN IF NOT EXISTS "had_intrusive_thoughts" boolean DEFAULT false NOT NULL;
ALTER TABLE "daily_check_ins" ADD COLUMN IF NOT EXISTS "notes" text;
ALTER TABLE "daily_check_ins" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_check_ins' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "daily_check_ins" DROP COLUMN placeholder'; END IF; END $$;

-- Table: daily_insights
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_insights') THEN
    EXECUTE 'CREATE TABLE "daily_insights" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "daily_insights" ADD COLUMN IF NOT EXISTS "id" integer NOT NULL;
ALTER TABLE "daily_insights" ADD COLUMN IF NOT EXISTS "text" text NOT NULL;
ALTER TABLE "daily_insights" ADD COLUMN IF NOT EXISTS "category" varchar NOT NULL;
ALTER TABLE "daily_insights" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_insights' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "daily_insights" DROP COLUMN placeholder'; END IF; END $$;

-- Table: daily_mood_logs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_mood_logs') THEN
    EXECUTE 'CREATE TABLE "daily_mood_logs" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "daily_mood_logs" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "daily_mood_logs" ADD COLUMN IF NOT EXISTS "log_date" date NOT NULL;
ALTER TABLE "daily_mood_logs" ADD COLUMN IF NOT EXISTS "mood" integer NOT NULL;
ALTER TABLE "daily_mood_logs" ADD COLUMN IF NOT EXISTS "notes" text;
ALTER TABLE "daily_mood_logs" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "daily_mood_logs" ADD COLUMN IF NOT EXISTS "mood_data" jsonb;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_mood_logs' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "daily_mood_logs" DROP COLUMN placeholder'; END IF; END $$;

-- Table: daily_ritual_assignments
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_ritual_assignments') THEN
    EXECUTE 'CREATE TABLE "daily_ritual_assignments" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''daily_ritual_assignments_id_seq''::regclass) NOT NULL;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "ritual_id" varchar;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "assignment_date" date DEFAULT CURRENT_DATE NOT NULL;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "is_completed" boolean DEFAULT false NOT NULL;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "ritual_1_id" text;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "ritual_2_id" text;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "allocation_mode" text DEFAULT ''guided''::text;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "user_weeks_at_assignment" integer DEFAULT 0;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "has_rerolled" boolean DEFAULT false;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "reroll_used_at" timestamptz;
ALTER TABLE "daily_ritual_assignments" ADD COLUMN IF NOT EXISTS "assigned_date" timestamptz;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_assignments' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "daily_ritual_assignments" DROP COLUMN placeholder'; END IF; END $$;

-- Table: daily_ritual_completions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_ritual_completions') THEN
    EXECUTE 'CREATE TABLE "daily_ritual_completions" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "daily_ritual_completions" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''daily_ritual_completions_id_seq''::regclass) NOT NULL;
ALTER TABLE "daily_ritual_completions" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "daily_ritual_completions" ADD COLUMN IF NOT EXISTS "assignment_id" integer;
ALTER TABLE "daily_ritual_completions" ADD COLUMN IF NOT EXISTS "ritual_id" varchar NOT NULL;
ALTER TABLE "daily_ritual_completions" ADD COLUMN IF NOT EXISTS "journal_text" text NOT NULL;
ALTER TABLE "daily_ritual_completions" ADD COLUMN IF NOT EXISTS "mood_rating" integer;
ALTER TABLE "daily_ritual_completions" ADD COLUMN IF NOT EXISTS "dwell_time_seconds" integer DEFAULT 0 NOT NULL;
ALTER TABLE "daily_ritual_completions" ADD COLUMN IF NOT EXISTS "word_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "daily_ritual_completions" ADD COLUMN IF NOT EXISTS "bytes_earned" integer DEFAULT 0 NOT NULL;
ALTER TABLE "daily_ritual_completions" ADD COLUMN IF NOT EXISTS "completed_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_completions' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "daily_ritual_completions" DROP COLUMN placeholder'; END IF; END $$;

-- Table: daily_ritual_events
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_ritual_events') THEN
    EXECUTE 'CREATE TABLE "daily_ritual_events" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "daily_ritual_events" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''daily_ritual_events_id_seq''::regclass) NOT NULL;
ALTER TABLE "daily_ritual_events" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "daily_ritual_events" ADD COLUMN IF NOT EXISTS "event_type" text NOT NULL;
ALTER TABLE "daily_ritual_events" ADD COLUMN IF NOT EXISTS "event_data" json;
ALTER TABLE "daily_ritual_events" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_ritual_events' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "daily_ritual_events" DROP COLUMN placeholder'; END IF; END $$;

-- Table: daily_rituals
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='daily_rituals') THEN
    EXECUTE 'CREATE TABLE "daily_rituals" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "daily_rituals" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "daily_rituals" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "daily_rituals" ADD COLUMN IF NOT EXISTS "title" text NOT NULL;
ALTER TABLE "daily_rituals" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "daily_rituals" ADD COLUMN IF NOT EXISTS "category" text NOT NULL;
ALTER TABLE "daily_rituals" ADD COLUMN IF NOT EXISTS "target_frequency" text DEFAULT ''daily''::text NOT NULL;
ALTER TABLE "daily_rituals" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
ALTER TABLE "daily_rituals" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_rituals' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "daily_rituals" DROP COLUMN placeholder'; END IF; END $$;

-- Table: digital_product_access
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='digital_product_access') THEN
    EXECUTE 'CREATE TABLE "digital_product_access" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "digital_product_access" ADD COLUMN IF NOT EXISTS "id" text DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE "digital_product_access" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "digital_product_access" ADD COLUMN IF NOT EXISTS "product_id" text NOT NULL;
ALTER TABLE "digital_product_access" ADD COLUMN IF NOT EXISTS "access_type" text NOT NULL;
ALTER TABLE "digital_product_access" ADD COLUMN IF NOT EXISTS "order_id" text;
ALTER TABLE "digital_product_access" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "digital_product_access" ADD COLUMN IF NOT EXISTS "expires_at" timestamptz;
ALTER TABLE "digital_product_access" ADD COLUMN IF NOT EXISTS "first_accessed_at" timestamptz;
ALTER TABLE "digital_product_access" ADD COLUMN IF NOT EXISTS "last_accessed_at" timestamptz;
ALTER TABLE "digital_product_access" ADD COLUMN IF NOT EXISTS "access_count" integer DEFAULT 0;
ALTER TABLE "digital_product_access" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='digital_product_access' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "digital_product_access" DROP COLUMN placeholder'; END IF; END $$;

-- Table: discount_codes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='discount_codes') THEN
    EXECUTE 'CREATE TABLE "discount_codes" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "discount_codes" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "discount_codes" ADD COLUMN IF NOT EXISTS "code" text NOT NULL;
ALTER TABLE "discount_codes" ADD COLUMN IF NOT EXISTS "percent" integer NOT NULL;
ALTER TABLE "discount_codes" ADD COLUMN IF NOT EXISTS "cap_value" integer;
ALTER TABLE "discount_codes" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "discount_codes" ADD COLUMN IF NOT EXISTS "badge_id" text NOT NULL;
ALTER TABLE "discount_codes" ADD COLUMN IF NOT EXISTS "redeemed_at" timestamptz;
ALTER TABLE "discount_codes" ADD COLUMN IF NOT EXISTS "expires_at" timestamptz NOT NULL;
ALTER TABLE "discount_codes" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='discount_codes' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "discount_codes" DROP COLUMN placeholder'; END IF; END $$;

-- Table: game_badge_conditions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='game_badge_conditions') THEN
    EXECUTE 'CREATE TABLE "game_badge_conditions" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "game_badge_conditions" ADD COLUMN IF NOT EXISTS "badge_id" text NOT NULL;
ALTER TABLE "game_badge_conditions" ADD COLUMN IF NOT EXISTS "ritual_categories" integer NOT NULL;
ALTER TABLE "game_badge_conditions" ADD COLUMN IF NOT EXISTS "min_streak" integer NOT NULL;
ALTER TABLE "game_badge_conditions" ADD COLUMN IF NOT EXISTS "firewall_badges" integer NOT NULL;
ALTER TABLE "game_badge_conditions" ADD COLUMN IF NOT EXISTS "total_rituals" integer NOT NULL;
ALTER TABLE "game_badge_conditions" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='game_badge_conditions' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "game_badge_conditions" DROP COLUMN placeholder'; END IF; END $$;

-- Table: ghost_daily_assignments
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ghost_daily_assignments') THEN
    EXECUTE 'CREATE TABLE "ghost_daily_assignments" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "ghost_daily_assignments" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''ghost_daily_assignments_id_seq''::regclass) NOT NULL;
ALTER TABLE "ghost_daily_assignments" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "ghost_daily_assignments" ADD COLUMN IF NOT EXISTS "assigned_date" text NOT NULL;
ALTER TABLE "ghost_daily_assignments" ADD COLUMN IF NOT EXISTS "timezone" text DEFAULT ''UTC''::text NOT NULL;
ALTER TABLE "ghost_daily_assignments" ADD COLUMN IF NOT EXISTS "ritual_id" text NOT NULL;
ALTER TABLE "ghost_daily_assignments" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ghost_daily_assignments' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "ghost_daily_assignments" DROP COLUMN placeholder'; END IF; END $$;

-- Table: invitations
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='invitations') THEN
    EXECUTE 'CREATE TABLE "invitations" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''invitations_id_seq''::regclass) NOT NULL;
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "team_id" integer NOT NULL;
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "email" varchar NOT NULL;
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "role" varchar NOT NULL;
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "invited_by" text NOT NULL;
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "invited_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "invitations" ADD COLUMN IF NOT EXISTS "status" varchar DEFAULT ''pending''::character varying NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='invitations' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "invitations" DROP COLUMN placeholder'; END IF; END $$;

-- Table: moderation_logs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='moderation_logs') THEN
    EXECUTE 'CREATE TABLE "moderation_logs" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "moderation_logs" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "moderation_logs" ADD COLUMN IF NOT EXISTS "post_id" text NOT NULL;
ALTER TABLE "moderation_logs" ADD COLUMN IF NOT EXISTS "action" text NOT NULL;
ALTER TABLE "moderation_logs" ADD COLUMN IF NOT EXISTS "moderator_id" text;
ALTER TABLE "moderation_logs" ADD COLUMN IF NOT EXISTS "reason" text;
ALTER TABLE "moderation_logs" ADD COLUMN IF NOT EXISTS "previous_content" text;
ALTER TABLE "moderation_logs" ADD COLUMN IF NOT EXISTS "new_content" text;
ALTER TABLE "moderation_logs" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='moderation_logs' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "moderation_logs" DROP COLUMN placeholder'; END IF; END $$;

-- Table: moderation_queue
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='moderation_queue') THEN
    EXECUTE 'CREATE TABLE "moderation_queue" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "post_id" text NOT NULL;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "content" text NOT NULL;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "flag_reason" text NOT NULL;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "severity" text NOT NULL;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "status" text DEFAULT ''pending''::text NOT NULL;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "suggested_action" text NOT NULL;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "detected_issues" text;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "moderator_id" text;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "moderator_notes" text;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "moderated_at" timestamptz;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "moderation_queue" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='moderation_queue' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "moderation_queue" DROP COLUMN placeholder'; END IF; END $$;

-- Table: no_contact_messages
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='no_contact_messages') THEN
    EXECUTE 'CREATE TABLE "no_contact_messages" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "no_contact_messages" ADD COLUMN IF NOT EXISTS "day" integer NOT NULL;
ALTER TABLE "no_contact_messages" ADD COLUMN IF NOT EXISTS "body" text NOT NULL;
ALTER TABLE "no_contact_messages" ADD COLUMN IF NOT EXISTS "is_milestone" boolean DEFAULT false;
ALTER TABLE "no_contact_messages" ADD COLUMN IF NOT EXISTS "bytes_reward" integer DEFAULT 0;
ALTER TABLE "no_contact_messages" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='no_contact_messages' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "no_contact_messages" DROP COLUMN placeholder'; END IF; END $$;

-- Table: notifications
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='notifications') THEN
    EXECUTE 'CREATE TABLE "notifications" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''notifications_id_seq''::regclass) NOT NULL;
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "type" text NOT NULL;
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "title" text;
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "message" text;
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "is_read" boolean DEFAULT false NOT NULL;
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "action_url" text;
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "action_text" text;
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "read" boolean;
ALTER TABLE "notifications" ADD COLUMN IF NOT EXISTS "read_at" timestamptz;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "notifications" DROP COLUMN placeholder'; END IF; END $$;

-- Table: referrals
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='referrals') THEN
    EXECUTE 'CREATE TABLE "referrals" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "referrals" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "referrals" ADD COLUMN IF NOT EXISTS "referrer_id" text NOT NULL;
ALTER TABLE "referrals" ADD COLUMN IF NOT EXISTS "referee_id" text;
ALTER TABLE "referrals" ADD COLUMN IF NOT EXISTS "referral_code" text NOT NULL;
ALTER TABLE "referrals" ADD COLUMN IF NOT EXISTS "status" text DEFAULT ''pending''::text NOT NULL;
ALTER TABLE "referrals" ADD COLUMN IF NOT EXISTS "reward_type" text;
ALTER TABLE "referrals" ADD COLUMN IF NOT EXISTS "reward_amount" integer DEFAULT 0;
ALTER TABLE "referrals" ADD COLUMN IF NOT EXISTS "clicked_at" timestamptz;
ALTER TABLE "referrals" ADD COLUMN IF NOT EXISTS "signed_up_at" timestamptz;
ALTER TABLE "referrals" ADD COLUMN IF NOT EXISTS "completed_at" timestamptz;
ALTER TABLE "referrals" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='referrals' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "referrals" DROP COLUMN placeholder'; END IF; END $$;

-- Table: ritual_completions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ritual_completions') THEN
    EXECUTE 'CREATE TABLE "ritual_completions" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "ritual_completions" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "ritual_completions" ADD COLUMN IF NOT EXISTS "ritual_id" text NOT NULL;
ALTER TABLE "ritual_completions" ADD COLUMN IF NOT EXISTS "completed_at" timestamptz NOT NULL;
ALTER TABLE "ritual_completions" ADD COLUMN IF NOT EXISTS "notes" text;
ALTER TABLE "ritual_completions" ADD COLUMN IF NOT EXISTS "mood" integer;
ALTER TABLE "ritual_completions" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ritual_completions' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "ritual_completions" DROP COLUMN placeholder'; END IF; END $$;

-- Table: ritual_entries
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ritual_entries') THEN
    EXECUTE 'CREATE TABLE "ritual_entries" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "ritual_code" varchar NOT NULL;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "ritual_title" varchar;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "performed_at" timestamptz DEFAULT now();
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "mood" integer;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "what_i_did" text;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "how_i_feel" text;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "tags" varchar;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "source" varchar DEFAULT ''text''::character varying;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "time_spent_seconds" integer;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "text_length" integer;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "xp_awarded" integer DEFAULT 0;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "bytes_awarded" integer DEFAULT 0;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "tokens_used" integer DEFAULT 0;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "summary_id" text;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "sentiment" varchar;
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now();
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();
ALTER TABLE "ritual_entries" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ritual_entries' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "ritual_entries" DROP COLUMN placeholder'; END IF; END $$;

-- Table: ritual_library
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='ritual_library') THEN
    EXECUTE 'CREATE TABLE "ritual_library" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "title" text NOT NULL;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "category" text NOT NULL;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "duration" text;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "difficulty" text;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "journal_prompt" text;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "lesson" text;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "steps" text;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "archetype" text;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "tier_requirement" text;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "is_premium" boolean DEFAULT false;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "xp_reward" integer DEFAULT 15;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "action_type" text DEFAULT ''reflect''::text;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "estimated_time" text DEFAULT ''10 minutes''::text;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "tags" _text DEFAULT ARRAY[]::text[];
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "media_refs" jsonb DEFAULT ''{}''::jsonb;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "is_milestone" boolean DEFAULT false;
ALTER TABLE "ritual_library" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ritual_library' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "ritual_library" DROP COLUMN placeholder'; END IF; END $$;

-- Table: rituals
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='rituals') THEN
    EXECUTE 'CREATE TABLE "rituals" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "title" text NOT NULL;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "category" text NOT NULL;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "intensity" integer DEFAULT 1 NOT NULL;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "duration" integer DEFAULT 10 NOT NULL;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "is_completed" boolean DEFAULT false NOT NULL;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "completed_at" timestamptz;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "is_reroll" boolean DEFAULT false NOT NULL;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "xp_reward" integer DEFAULT 50 NOT NULL;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "bytes_reward" integer DEFAULT 25 NOT NULL;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "archetype" varchar;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "difficulty" varchar;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "steps" jsonb;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "emotional_tone" text;
ALTER TABLE "rituals" ADD COLUMN IF NOT EXISTS "tier" text;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rituals' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "rituals" DROP COLUMN placeholder'; END IF; END $$;

-- Table: sessions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='sessions') THEN
    EXECUTE 'CREATE TABLE "sessions" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "sessions" ADD COLUMN IF NOT EXISTS "expires_at" timestamptz NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sessions' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "sessions" DROP COLUMN placeholder'; END IF; END $$;

-- Table: shop_order_items
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='shop_order_items') THEN
    EXECUTE 'CREATE TABLE "shop_order_items" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "id" text DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "order_id" text NOT NULL;
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "product_id" text NOT NULL;
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "quantity" integer DEFAULT 1 NOT NULL;
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "variant" text;
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "byte_price_per_item" integer;
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "cash_price_per_item" integer;
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "status" text DEFAULT ''pending''::text NOT NULL;
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "printify_order_id" text;
ALTER TABLE "shop_order_items" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shop_order_items' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "shop_order_items" DROP COLUMN placeholder'; END IF; END $$;

-- Table: shop_orders
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='shop_orders') THEN
    EXECUTE 'CREATE TABLE "shop_orders" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "id" text DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "order_number" text NOT NULL;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "status" text DEFAULT ''pending''::text NOT NULL;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "payment_method" text NOT NULL;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "total_bytes" integer DEFAULT 0;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "total_cash" integer DEFAULT 0;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipping_name" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipping_email" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipping_address_1" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipping_address_2" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipping_city" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipping_state" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipping_zip" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipping_country" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "stripe_session_id" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "stripe_payment_intent_id" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "tracking_number" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "shipped_at" timestamptz;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "delivered_at" timestamptz;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "notes" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "metadata" text;
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE "shop_orders" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shop_orders' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "shop_orders" DROP COLUMN placeholder'; END IF; END $$;

-- Table: shop_products
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='shop_products') THEN
    EXECUTE 'CREATE TABLE "shop_products" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "name" text NOT NULL;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "category" text NOT NULL;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "type" text NOT NULL;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "byte_price" integer;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "cash_price" integer;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "variants" text;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "digital_content" text;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "printify_product_id" text;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "is_digital" boolean DEFAULT false;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "requires_shipping" boolean DEFAULT false;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "tags" text;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "images" text;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0;
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE "shop_products" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shop_products' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "shop_products" DROP COLUMN placeholder'; END IF; END $$;

-- Table: streak_bonuses
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='streak_bonuses') THEN
    EXECUTE 'CREATE TABLE "streak_bonuses" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "streak_bonuses" ADD COLUMN IF NOT EXISTS "id" text DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE "streak_bonuses" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "streak_bonuses" ADD COLUMN IF NOT EXISTS "streak_days" integer NOT NULL;
ALTER TABLE "streak_bonuses" ADD COLUMN IF NOT EXISTS "bonus_bytes" integer NOT NULL;
ALTER TABLE "streak_bonuses" ADD COLUMN IF NOT EXISTS "activity_type" text NOT NULL;
ALTER TABLE "streak_bonuses" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='streak_bonuses' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "streak_bonuses" DROP COLUMN placeholder'; END IF; END $$;

-- Table: subscription_events
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='subscription_events') THEN
    EXECUTE 'CREATE TABLE "subscription_events" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "subscription_events" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "subscription_events" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "subscription_events" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;
ALTER TABLE "subscription_events" ADD COLUMN IF NOT EXISTS "stripe_subscription_id" text;
ALTER TABLE "subscription_events" ADD COLUMN IF NOT EXISTS "event_type" text NOT NULL;
ALTER TABLE "subscription_events" ADD COLUMN IF NOT EXISTS "plan_id" text;
ALTER TABLE "subscription_events" ADD COLUMN IF NOT EXISTS "amount" integer;
ALTER TABLE "subscription_events" ADD COLUMN IF NOT EXISTS "currency" text DEFAULT ''usd''::text;
ALTER TABLE "subscription_events" ADD COLUMN IF NOT EXISTS "status" text;
ALTER TABLE "subscription_events" ADD COLUMN IF NOT EXISTS "timestamp" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "subscription_events" ADD COLUMN IF NOT EXISTS "metadata" text;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscription_events' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "subscription_events" DROP COLUMN placeholder'; END IF; END $$;

-- Table: team_members
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='team_members') THEN
    EXECUTE 'CREATE TABLE "team_members" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''team_members_id_seq''::regclass) NOT NULL;
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "team_id" integer NOT NULL;
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "role" varchar NOT NULL;
ALTER TABLE "team_members" ADD COLUMN IF NOT EXISTS "joined_at" timestamp DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team_members' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "team_members" DROP COLUMN placeholder'; END IF; END $$;

-- Table: teams
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='teams') THEN
    EXECUTE 'CREATE TABLE "teams" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''teams_id_seq''::regclass) NOT NULL;
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "name" varchar NOT NULL;
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "stripe_customer_id" text;
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "stripe_subscription_id" text;
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "stripe_product_id" text;
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "plan_name" varchar;
ALTER TABLE "teams" ADD COLUMN IF NOT EXISTS "subscription_status" varchar;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teams' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "teams" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_achievements
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_achievements') THEN
    EXECUTE 'CREATE TABLE "user_achievements" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_achievements" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "user_achievements" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_achievements" ADD COLUMN IF NOT EXISTS "achievement_id" text NOT NULL;
ALTER TABLE "user_achievements" ADD COLUMN IF NOT EXISTS "awarded_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "user_achievements" ADD COLUMN IF NOT EXISTS "byte_reward" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user_achievements" ADD COLUMN IF NOT EXISTS "metadata" json;
ALTER TABLE "user_achievements" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_achievements' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_achievements" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_badge_collections
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_badge_collections') THEN
    EXECUTE 'CREATE TABLE "user_badge_collections" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_badge_collections" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''user_badge_collections_id_seq''::regclass) NOT NULL;
ALTER TABLE "user_badge_collections" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_badge_collections" ADD COLUMN IF NOT EXISTS "collection_id" text NOT NULL;
ALTER TABLE "user_badge_collections" ADD COLUMN IF NOT EXISTS "completed_at" timestamptz DEFAULT now();
ALTER TABLE "user_badge_collections" ADD COLUMN IF NOT EXISTS "xp_awarded" integer DEFAULT 0;
ALTER TABLE "user_badge_collections" ADD COLUMN IF NOT EXISTS "bytes_awarded" integer DEFAULT 0;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_badge_collections' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_badge_collections" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_badges
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_badges') THEN
    EXECUTE 'CREATE TABLE "user_badges" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_badges" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "user_badges" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_badges" ADD COLUMN IF NOT EXISTS "badge_id" text NOT NULL;
ALTER TABLE "user_badges" ADD COLUMN IF NOT EXISTS "earned_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "user_badges" ADD COLUMN IF NOT EXISTS "metadata" text;
ALTER TABLE "user_badges" ADD COLUMN IF NOT EXISTS "source_event" text DEFAULT ''manual''::text NOT NULL;
ALTER TABLE "user_badges" ADD COLUMN IF NOT EXISTS "applied_as_profile" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_badges" ADD COLUMN IF NOT EXISTS "discount_code_id" text;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_badges' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_badges" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_byte_history
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_byte_history') THEN
    EXECUTE 'CREATE TABLE "user_byte_history" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_byte_history" ADD COLUMN IF NOT EXISTS "id" text DEFAULT gen_random_uuid() NOT NULL;
ALTER TABLE "user_byte_history" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_byte_history" ADD COLUMN IF NOT EXISTS "activity_type" text NOT NULL;
ALTER TABLE "user_byte_history" ADD COLUMN IF NOT EXISTS "byte_change" integer NOT NULL;
ALTER TABLE "user_byte_history" ADD COLUMN IF NOT EXISTS "balance_after" integer NOT NULL;
ALTER TABLE "user_byte_history" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "user_byte_history" ADD COLUMN IF NOT EXISTS "metadata" text;
ALTER TABLE "user_byte_history" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_byte_history' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_byte_history" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_daily_actions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_daily_actions') THEN
    EXECUTE 'CREATE TABLE "user_daily_actions" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_daily_actions" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_daily_actions" ADD COLUMN IF NOT EXISTS "action_date" date NOT NULL;
ALTER TABLE "user_daily_actions" ADD COLUMN IF NOT EXISTS "checkin" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_daily_actions" ADD COLUMN IF NOT EXISTS "no_contact" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_daily_actions" ADD COLUMN IF NOT EXISTS "ritual" boolean DEFAULT false NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_daily_actions' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_daily_actions" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_daily_prescriptions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_daily_prescriptions') THEN
    EXECUTE 'CREATE TABLE "user_daily_prescriptions" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_daily_prescriptions" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "user_daily_prescriptions" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_daily_prescriptions" ADD COLUMN IF NOT EXISTS "prescribed_date" timestamptz NOT NULL;
ALTER TABLE "user_daily_prescriptions" ADD COLUMN IF NOT EXISTS "ritual_key" text NOT NULL;
ALTER TABLE "user_daily_prescriptions" ADD COLUMN IF NOT EXISTS "shuffles_used" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user_daily_prescriptions" ADD COLUMN IF NOT EXISTS "is_completed" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_daily_prescriptions" ADD COLUMN IF NOT EXISTS "completed_at" timestamptz;
ALTER TABLE "user_daily_prescriptions" ADD COLUMN IF NOT EXISTS "completion_notes" text;
ALTER TABLE "user_daily_prescriptions" ADD COLUMN IF NOT EXISTS "completion_mood" integer;
ALTER TABLE "user_daily_prescriptions" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_daily_prescriptions' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_daily_prescriptions" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_daily_state
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_daily_state') THEN
    EXECUTE 'CREATE TABLE "user_daily_state" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''user_daily_state_id_seq''::regclass) NOT NULL;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "state_date" date NOT NULL;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "rituals_completed_today" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "daily_cap_reached" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "has_rerolled_today" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "streak_days" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "last_completion_date" date;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "timezone" text DEFAULT ''UTC''::text NOT NULL;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "total_weeks_active" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "user_daily_state" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_daily_state' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_daily_state" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_multipliers
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_multipliers') THEN
    EXECUTE 'CREATE TABLE "user_multipliers" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_multipliers" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "user_multipliers" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_multipliers" ADD COLUMN IF NOT EXISTS "multiplier_id" text NOT NULL;
ALTER TABLE "user_multipliers" ADD COLUMN IF NOT EXISTS "multiplier" float4 NOT NULL;
ALTER TABLE "user_multipliers" ADD COLUMN IF NOT EXISTS "activated_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "user_multipliers" ADD COLUMN IF NOT EXISTS "expires_at" timestamptz NOT NULL;
ALTER TABLE "user_multipliers" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
ALTER TABLE "user_multipliers" ADD COLUMN IF NOT EXISTS "source_achievement_id" text;
ALTER TABLE "user_multipliers" ADD COLUMN IF NOT EXISTS "usage_count" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user_multipliers" ADD COLUMN IF NOT EXISTS "total_bytes_multiplied" integer DEFAULT 0 NOT NULL;
ALTER TABLE "user_multipliers" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_multipliers' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_multipliers" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_profile_badges
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_profile_badges') THEN
    EXECUTE 'CREATE TABLE "user_profile_badges" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_profile_badges" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_profile_badges" ADD COLUMN IF NOT EXISTS "displayed_badge_id" text;
ALTER TABLE "user_profile_badges" ADD COLUMN IF NOT EXISTS "auto_apply_latest" boolean DEFAULT false NOT NULL;
ALTER TABLE "user_profile_badges" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now();
ALTER TABLE "user_profile_badges" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profile_badges' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_profile_badges" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_ritual_assignments
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_ritual_assignments') THEN
    EXECUTE 'CREATE TABLE "user_ritual_assignments" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_ritual_assignments" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''user_ritual_assignments_id_seq''::regclass) NOT NULL;
ALTER TABLE "user_ritual_assignments" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_ritual_assignments" ADD COLUMN IF NOT EXISTS "ritual_key" varchar NOT NULL;
ALTER TABLE "user_ritual_assignments" ADD COLUMN IF NOT EXISTS "assigned_at" timestamptz DEFAULT now();
ALTER TABLE "user_ritual_assignments" ADD COLUMN IF NOT EXISTS "completed_at" timestamptz;
ALTER TABLE "user_ritual_assignments" ADD COLUMN IF NOT EXISTS "rerolled" boolean DEFAULT false;
ALTER TABLE "user_ritual_assignments" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_ritual_assignments' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_ritual_assignments" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_ritual_history
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_ritual_history') THEN
    EXECUTE 'CREATE TABLE "user_ritual_history" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_ritual_history" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''user_ritual_history_id_seq''::regclass) NOT NULL;
ALTER TABLE "user_ritual_history" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_ritual_history" ADD COLUMN IF NOT EXISTS "ritual_id" text NOT NULL;
ALTER TABLE "user_ritual_history" ADD COLUMN IF NOT EXISTS "last_assigned_date" date NOT NULL;
ALTER TABLE "user_ritual_history" ADD COLUMN IF NOT EXISTS "completion_count" integer DEFAULT 0 NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_ritual_history' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_ritual_history" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_ritual_swaps
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_ritual_swaps') THEN
    EXECUTE 'CREATE TABLE "user_ritual_swaps" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_ritual_swaps" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''user_ritual_swaps_id_seq''::regclass) NOT NULL;
ALTER TABLE "user_ritual_swaps" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_ritual_swaps" ADD COLUMN IF NOT EXISTS "swap_date" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "user_ritual_swaps" ADD COLUMN IF NOT EXISTS "reason" text;
ALTER TABLE "user_ritual_swaps" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_ritual_swaps' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_ritual_swaps" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_rituals
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_rituals') THEN
    EXECUTE 'CREATE TABLE "user_rituals" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_rituals" ADD COLUMN IF NOT EXISTS "id" integer DEFAULT nextval(''user_rituals_id_seq''::regclass) NOT NULL;
ALTER TABLE "user_rituals" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_rituals" ADD COLUMN IF NOT EXISTS "ritual_id" text NOT NULL;
ALTER TABLE "user_rituals" ADD COLUMN IF NOT EXISTS "assigned_date" date DEFAULT CURRENT_DATE NOT NULL;
ALTER TABLE "user_rituals" ADD COLUMN IF NOT EXISTS "completed_at" timestamptz;
ALTER TABLE "user_rituals" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now();
ALTER TABLE "user_rituals" ADD COLUMN IF NOT EXISTS "delivered_at" timestamptz DEFAULT now();
ALTER TABLE "user_rituals" ADD COLUMN IF NOT EXISTS "is_current" boolean DEFAULT false;
ALTER TABLE "user_rituals" ADD COLUMN IF NOT EXISTS "rerolled" boolean DEFAULT false;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_rituals' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_rituals" DROP COLUMN placeholder'; END IF; END $$;

-- Table: user_sessions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='user_sessions') THEN
    EXECUTE 'CREATE TABLE "user_sessions" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "user_sessions" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "user_sessions" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "user_sessions" ADD COLUMN IF NOT EXISTS "session_id" text NOT NULL;
ALTER TABLE "user_sessions" ADD COLUMN IF NOT EXISTS "start_time" timestamptz NOT NULL;
ALTER TABLE "user_sessions" ADD COLUMN IF NOT EXISTS "last_activity" timestamptz NOT NULL;
ALTER TABLE "user_sessions" ADD COLUMN IF NOT EXISTS "end_time" timestamptz;
ALTER TABLE "user_sessions" ADD COLUMN IF NOT EXISTS "device_type" text;
ALTER TABLE "user_sessions" ADD COLUMN IF NOT EXISTS "browser" text;
ALTER TABLE "user_sessions" ADD COLUMN IF NOT EXISTS "os" text;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_sessions' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "user_sessions" DROP COLUMN placeholder'; END IF; END $$;

-- Table: users
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='users') THEN
    EXECUTE 'CREATE TABLE "users" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "id" text DEFAULT nextval(''users_id_seq''::regclass) NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email" varchar NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" text NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "username" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboarding_completed" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_tier" text DEFAULT ''ghost_mode''::text NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "glow_up_level" integer DEFAULT 1 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_admin" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_banned" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_active_at" timestamptz;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token_expiry" timestamptz;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tier" text DEFAULT ''freemium''::text NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "status" text DEFAULT ''active''::text NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "current_protocol" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "protocol_day" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "dashboard_type" text DEFAULT ''freemium''::text NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emotional_archetype" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "codename" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatar_style" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bytes" integer DEFAULT 100 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "streak" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "streak_days" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "longest_streak" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "no_contact_days" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ux_stage" text DEFAULT ''newcomer''::text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ai_quota_used" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ai_quota_reset_at" timestamptz;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ritual_history" text DEFAULT ''[]''::text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "therapy_history" text DEFAULT ''[]''::text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "shop_inventory" text DEFAULT ''[]''::text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "badges" text DEFAULT ''[]''::text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_ritual_completed" timestamptz;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_login" timestamptz;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_no_contact_checkin" timestamptz;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "no_contact_streak_threatened" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_reroll_at" timestamptz;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "archetype" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ritual_tier" text DEFAULT ''ghost''::text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "total_xp" integer DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "total_bytes" integer DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "archetype_details" jsonb;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ritual_streak" integer DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "no_contact_streak" integer DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_checkin" timestamptz;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_ritual" timestamptz;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_status" varchar DEFAULT ''free''::character varying;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_expires" timestamptz;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_verified" boolean DEFAULT false;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profile_badge_id" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_opt_in" boolean DEFAULT true NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "timezone" text DEFAULT ''UTC''::text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "selected_badge_id" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_notifications" boolean DEFAULT true;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verified" boolean DEFAULT false;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verification_token" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "email_verification_sent_at" timestamptz;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "users" DROP COLUMN placeholder'; END IF; END $$;

-- Table: voice_therapy_credits
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='voice_therapy_credits') THEN
    EXECUTE 'CREATE TABLE "voice_therapy_credits" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "voice_therapy_credits" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "voice_therapy_credits" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "voice_therapy_credits" ADD COLUMN IF NOT EXISTS "minutes_purchased" integer NOT NULL;
ALTER TABLE "voice_therapy_credits" ADD COLUMN IF NOT EXISTS "minutes_remaining" integer NOT NULL;
ALTER TABLE "voice_therapy_credits" ADD COLUMN IF NOT EXISTS "purchase_date" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "voice_therapy_credits" ADD COLUMN IF NOT EXISTS "expiry_date" timestamptz NOT NULL;
ALTER TABLE "voice_therapy_credits" ADD COLUMN IF NOT EXISTS "stripe_session_id" text;
ALTER TABLE "voice_therapy_credits" ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
ALTER TABLE "voice_therapy_credits" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "voice_therapy_credits" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='voice_therapy_credits' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "voice_therapy_credits" DROP COLUMN placeholder'; END IF; END $$;

-- Table: voice_therapy_sessions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='voice_therapy_sessions') THEN
    EXECUTE 'CREATE TABLE "voice_therapy_sessions" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "voice_therapy_sessions" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "voice_therapy_sessions" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "voice_therapy_sessions" ADD COLUMN IF NOT EXISTS "credit_id" text NOT NULL;
ALTER TABLE "voice_therapy_sessions" ADD COLUMN IF NOT EXISTS "minutes_used" integer NOT NULL;
ALTER TABLE "voice_therapy_sessions" ADD COLUMN IF NOT EXISTS "session_start" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "voice_therapy_sessions" ADD COLUMN IF NOT EXISTS "session_end" timestamptz;
ALTER TABLE "voice_therapy_sessions" ADD COLUMN IF NOT EXISTS "persona" text;
ALTER TABLE "voice_therapy_sessions" ADD COLUMN IF NOT EXISTS "summary" text;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='voice_therapy_sessions' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "voice_therapy_sessions" DROP COLUMN placeholder'; END IF; END $$;

-- Table: wall_post_reactions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='wall_post_reactions') THEN
    EXECUTE 'CREATE TABLE "wall_post_reactions" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "wall_post_reactions" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "wall_post_reactions" ADD COLUMN IF NOT EXISTS "post_id" text NOT NULL;
ALTER TABLE "wall_post_reactions" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "wall_post_reactions" ADD COLUMN IF NOT EXISTS "reaction_type" text NOT NULL;
ALTER TABLE "wall_post_reactions" ADD COLUMN IF NOT EXISTS "created_at" timestamptz DEFAULT now() NOT NULL;
ALTER TABLE "wall_post_reactions" ADD COLUMN IF NOT EXISTS "updated_at" timestamptz DEFAULT now() NOT NULL;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='wall_post_reactions' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "wall_post_reactions" DROP COLUMN placeholder'; END IF; END $$;

-- Table: weekly_summaries
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='weekly_summaries') THEN
    EXECUTE 'CREATE TABLE "weekly_summaries" (placeholder int)';
  END IF;
END $$;
ALTER TABLE "weekly_summaries" ADD COLUMN IF NOT EXISTS "id" text NOT NULL;
ALTER TABLE "weekly_summaries" ADD COLUMN IF NOT EXISTS "user_id" text NOT NULL;
ALTER TABLE "weekly_summaries" ADD COLUMN IF NOT EXISTS "week_start" timestamp NOT NULL;
ALTER TABLE "weekly_summaries" ADD COLUMN IF NOT EXISTS "week_end" timestamp NOT NULL;
ALTER TABLE "weekly_summaries" ADD COLUMN IF NOT EXISTS "bullets" text;
ALTER TABLE "weekly_summaries" ADD COLUMN IF NOT EXISTS "sentiment_avg" integer;
ALTER TABLE "weekly_summaries" ADD COLUMN IF NOT EXISTS "next_suggestion" text;
ALTER TABLE "weekly_summaries" ADD COLUMN IF NOT EXISTS "entry_count" integer DEFAULT 0;
ALTER TABLE "weekly_summaries" ADD COLUMN IF NOT EXISTS "tokens_used" integer DEFAULT 0;
ALTER TABLE "weekly_summaries" ADD COLUMN IF NOT EXISTS "generated_at" timestamp DEFAULT now();
ALTER TABLE "weekly_summaries" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now();
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='weekly_summaries' AND column_name='placeholder') THEN EXECUTE 'ALTER TABLE "weekly_summaries" DROP COLUMN placeholder'; END IF; END $$;

CREATE UNIQUE INDEX _manual_migrations_filename_key ON public._manual_migrations USING btree (filename);
CREATE UNIQUE INDEX achievement_milestones_user_id_milestone_type_milestone_val_key ON public.achievement_milestones USING btree (user_id, milestone_type, milestone_value);
CREATE UNIQUE INDEX achievement_progress_user_id_achievement_id_key ON public.achievement_progress USING btree (user_id, achievement_id);
CREATE INDEX IF NOT EXISTS idx_achievement_progress_achievement ON public.achievement_progress USING btree (achievement_id);
CREATE INDEX IF NOT EXISTS idx_achievement_progress_updated ON public.achievement_progress USING btree (last_updated);
CREATE INDEX IF NOT EXISTS idx_achievement_progress_user_id ON public.achievement_progress USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_ai_therapy_message_purchases_user_active ON public.ai_therapy_message_purchases USING btree (user_id, expires_at);
CREATE INDEX IF NOT EXISTS analytics_events_event_source_time_idx ON public.analytics_events USING btree (event, source, "timestamp" DESC);
CREATE INDEX IF NOT EXISTS analytics_events_source_idx ON public.analytics_events USING btree (source);
CREATE INDEX IF NOT EXISTS idx_anonymous_posts_glitch_category ON public.anonymous_posts USING btree (glitch_category);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON public.api_usage USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_service ON public.api_usage USING btree (service);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON public.audit_logs USING btree (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_badge_events_user_id ON public.badge_events USING btree (user_id);
CREATE UNIQUE INDEX badges_name_unique ON public.badges USING btree (name);
CREATE UNIQUE INDEX blog_posts_slug_key ON public.blog_posts USING btree (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts USING btree (category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts USING btree (published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts USING btree (status);
CREATE UNIQUE INDEX byte_earning_rules_activity_key ON public.byte_earning_rules USING btree (activity);
CREATE UNIQUE INDEX daily_insights_text_key ON public.daily_insights USING btree (text);
CREATE INDEX IF NOT EXISTS idx_daily_mood_logs_log_date ON public.daily_mood_logs USING btree (log_date);
CREATE INDEX IF NOT EXISTS idx_daily_ritual_assignments_user_assigned ON public.daily_ritual_assignments USING btree (user_id, assigned_date);
CREATE INDEX IF NOT EXISTS idx_daily_ritual_assignments_user_date ON public.daily_ritual_assignments USING btree (user_id, assignment_date);
CREATE INDEX IF NOT EXISTS idx_daily_ritual_completions_user_completed ON public.daily_ritual_completions USING btree (user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_daily_ritual_completions_user_date ON public.daily_ritual_completions USING btree (user_id, completed_at);
CREATE UNIQUE INDEX discount_codes_code_key ON public.discount_codes USING btree (code);
CREATE UNIQUE INDEX ghost_daily_assignments_user_id_assigned_date_key ON public.ghost_daily_assignments USING btree (user_id, assigned_date);
CREATE INDEX IF NOT EXISTS idx_ghost_daily_assignments_user_date ON public.ghost_daily_assignments USING btree (user_id, assigned_date);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_action ON public.moderation_logs USING btree (action);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_post_id ON public.moderation_logs USING btree (post_id);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_created_at ON public.moderation_queue USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_severity ON public.moderation_queue USING btree (severity);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON public.moderation_queue USING btree (status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications USING btree (user_id) WHERE (read = false);
CREATE UNIQUE INDEX referrals_referral_code_unique ON public.referrals USING btree (referral_code);
CREATE INDEX IF NOT EXISTS ritual_entries_user_code_idx ON public.ritual_entries USING btree (user_id, ritual_code);
CREATE INDEX IF NOT EXISTS ritual_entries_user_id_created_at_index ON public.ritual_entries USING btree (user_id, created_at);
CREATE INDEX IF NOT EXISTS ritual_entries_user_id_performed_at_index ON public.ritual_entries USING btree (user_id, performed_at);
CREATE INDEX IF NOT EXISTS ritual_entries_user_id_ritual_code_index ON public.ritual_entries USING btree (user_id, ritual_code);
CREATE INDEX IF NOT EXISTS ritual_entries_user_performed_idx ON public.ritual_entries USING btree (user_id, performed_at);
CREATE INDEX IF NOT EXISTS idx_ritual_library_category ON public.ritual_library USING btree (category);
CREATE INDEX IF NOT EXISTS idx_ritual_library_is_active ON public.ritual_library USING btree (is_active);
CREATE INDEX IF NOT EXISTS idx_rituals_category ON public.rituals USING btree (category);
CREATE UNIQUE INDEX shop_orders_order_number_key ON public.shop_orders USING btree (order_number);
CREATE UNIQUE INDEX teams_stripe_customer_id_unique ON public.teams USING btree (stripe_customer_id);
CREATE UNIQUE INDEX teams_stripe_subscription_id_unique ON public.teams USING btree (stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements USING btree (achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_awarded_at ON public.user_achievements USING btree (awarded_at);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements USING btree (user_id);
CREATE UNIQUE INDEX user_achievements_user_id_achievement_id_key ON public.user_achievements USING btree (user_id, achievement_id);
CREATE UNIQUE INDEX user_badge_collections_user_id_collection_id_key ON public.user_badge_collections USING btree (user_id, collection_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges USING btree (badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_state_user_date ON public.user_daily_state USING btree (user_id, state_date);
CREATE INDEX IF NOT EXISTS idx_user_multipliers_active ON public.user_multipliers USING btree (is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_user_multipliers_expires ON public.user_multipliers USING btree (expires_at);
CREATE INDEX IF NOT EXISTS idx_user_multipliers_user_id ON public.user_multipliers USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_user_ritual_assignments_user_date ON public.user_ritual_assignments USING btree (user_id, assigned_at, rerolled);
CREATE INDEX IF NOT EXISTS idx_user_rituals_completed ON public.user_rituals USING btree (user_id, completed_at) WHERE (completed_at IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_user_rituals_user_current ON public.user_rituals USING btree (user_id, is_current) WHERE (is_current = true);
CREATE UNIQUE INDEX user_sessions_session_id_unique ON public.user_sessions USING btree (session_id);
CREATE UNIQUE INDEX users_email_unique ON public.users USING btree (email);
CREATE UNIQUE INDEX users_username_unique ON public.users USING btree (username);
CREATE INDEX IF NOT EXISTS idx_voice_therapy_credits_active ON public.voice_therapy_credits USING btree (user_id, is_active, expiry_date);
CREATE INDEX IF NOT EXISTS idx_voice_therapy_credits_user_id ON public.voice_therapy_credits USING btree (user_id);
CREATE UNIQUE INDEX uniq_voice_therapy_credits_stripe_session ON public.voice_therapy_credits USING btree (stripe_session_id) WHERE (stripe_session_id IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_voice_therapy_sessions_credit_id ON public.voice_therapy_sessions USING btree (credit_id);
CREATE INDEX IF NOT EXISTS idx_voice_therapy_sessions_user_id ON public.voice_therapy_sessions USING btree (user_id);
CREATE INDEX IF NOT EXISTS weekly_summaries_user_id_week_start_index ON public.weekly_summaries USING btree (user_id, week_start);

COMMIT;
