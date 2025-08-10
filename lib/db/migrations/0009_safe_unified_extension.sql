-- SAFE additive migration for unified schema introduction
-- Does NOT drop or rename existing legacy tables/columns.

-- Transaction removed to allow partial replay without aborting entire file on re-run

-- Create new tables if not exist
CREATE TABLE IF NOT EXISTS "daily_ritual_assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"assigned_date" date NOT NULL,
	"ritual_1_id" varchar(100) NOT NULL,
	"ritual_2_id" varchar(100) NOT NULL,
	"allocation_mode" varchar(20) DEFAULT 'guided' NOT NULL,
	"user_weeks_at_assignment" integer DEFAULT 0 NOT NULL,
	"has_rerolled" boolean DEFAULT false NOT NULL,
	"reroll_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "daily_ritual_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"assignment_id" integer NOT NULL,
	"ritual_id" varchar(100) NOT NULL,
	"journal_text" text NOT NULL,
	"mood_rating" integer,
	"dwell_time_seconds" integer DEFAULT 0 NOT NULL,
	"word_count" integer DEFAULT 0 NOT NULL,
	"xp_earned" integer DEFAULT 0 NOT NULL,
	"bytes_earned" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "daily_ritual_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"event_data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"priority" varchar(20) DEFAULT 'normal' NOT NULL,
	"channels" jsonb NOT NULL,
	"metadata" jsonb,
	"delivered_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "push_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone
);

CREATE TABLE IF NOT EXISTS "user_daily_state" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"state_date" date NOT NULL,
	"rituals_completed_today" integer DEFAULT 0 NOT NULL,
	"daily_cap_reached" boolean DEFAULT false NOT NULL,
	"has_rerolled_today" boolean DEFAULT false NOT NULL,
	"streak_days" integer DEFAULT 0 NOT NULL,
	"last_completion_date" date,
	"timezone" varchar(50) DEFAULT 'UTC' NOT NULL,
	"total_weeks_active" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_ritual_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"ritual_id" varchar(100) NOT NULL,
	"last_assigned_date" date NOT NULL,
	"completion_count" integer DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS "notification_schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"cron_expression" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_sent_at" timestamp with time zone,
	"next_run_at" timestamp with time zone,
	"backoff_seconds" integer DEFAULT 0 NOT NULL,
	"dedupe_window_seconds" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Add new user columns if missing
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "archetype" varchar(100);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "archetype_details" jsonb;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "ritual_streak" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "no_contact_streak" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_checkin" timestamp with time zone;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_ritual" timestamp with time zone;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_verified" boolean DEFAULT false NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_status" varchar(50) DEFAULT 'free';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_expires" timestamp with time zone;

-- Analytics events modernization (additive only)
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "event_type" varchar(80);
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "properties" jsonb DEFAULT '{}'::jsonb;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "day_index" integer;
ALTER TABLE "analytics_events" ADD COLUMN IF NOT EXISTS "created_at" timestamp with time zone DEFAULT now();

-- AI sessions table (only if not repurposing an existing one)
CREATE TABLE IF NOT EXISTS "ai_sessions" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "mode" varchar(20) DEFAULT 'chat' NOT NULL,
  "started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "ended_at" timestamp with time zone,
  "token_usage" jsonb,
  "meta" jsonb
);

-- End of migration
