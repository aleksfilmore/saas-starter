CREATE TABLE "daily_ritual_assignments" (
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
--> statement-breakpoint
CREATE TABLE "daily_ritual_completions" (
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
--> statement-breakpoint
CREATE TABLE "daily_ritual_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"event_data" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_schedules" (
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
--> statement-breakpoint
CREATE TABLE "notifications" (
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
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user_daily_state" (
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
--> statement-breakpoint
CREATE TABLE "user_ritual_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"ritual_id" varchar(100) NOT NULL,
	"last_assigned_date" date NOT NULL,
	"completion_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "anonymous_posts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "badges" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "byte_transactions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conversion_funnels" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "daily_check_ins" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "daily_rituals" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "no_contact_breaches" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "no_contact_periods" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "referrals" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ritual_completions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ritual_entries" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "rituals" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "subscription_events" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_badges" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_daily_prescriptions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wall_post_comments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "wall_post_reactions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "weekly_summaries" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "anonymous_posts" CASCADE;--> statement-breakpoint
DROP TABLE "badges" CASCADE;--> statement-breakpoint
DROP TABLE "byte_transactions" CASCADE;--> statement-breakpoint
DROP TABLE "conversion_funnels" CASCADE;--> statement-breakpoint
DROP TABLE "daily_check_ins" CASCADE;--> statement-breakpoint
DROP TABLE "daily_rituals" CASCADE;--> statement-breakpoint
DROP TABLE "no_contact_breaches" CASCADE;--> statement-breakpoint
DROP TABLE "no_contact_periods" CASCADE;--> statement-breakpoint
DROP TABLE "referrals" CASCADE;--> statement-breakpoint
DROP TABLE "ritual_completions" CASCADE;--> statement-breakpoint
DROP TABLE "ritual_entries" CASCADE;--> statement-breakpoint
DROP TABLE "rituals" CASCADE;--> statement-breakpoint
DROP TABLE "subscription_events" CASCADE;--> statement-breakpoint
DROP TABLE "user_badges" CASCADE;--> statement-breakpoint
DROP TABLE "user_daily_prescriptions" CASCADE;--> statement-breakpoint
DROP TABLE "user_sessions" CASCADE;--> statement-breakpoint
DROP TABLE "wall_post_comments" CASCADE;--> statement-breakpoint
DROP TABLE "wall_post_reactions" CASCADE;--> statement-breakpoint
DROP TABLE "weekly_summaries" CASCADE;--> statement-breakpoint
ALTER TABLE "xp_transactions" RENAME TO "ai_sessions";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "ai_sessions" DROP CONSTRAINT "xp_transactions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "analytics_events" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "analytics_events" ALTER COLUMN "properties" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "analytics_events" ALTER COLUMN "properties" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "analytics_events" ALTER COLUMN "properties" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "onboarding_completed" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "tier" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "tier" SET DEFAULT 'freemium';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "subscription_tier" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "xp_points" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "byte_balance" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "glow_up_level" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_admin" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_banned" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD COLUMN "event_type" varchar(80) NOT NULL;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD COLUMN "day_index" integer;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "archetype" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "archetype_details" jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ritual_streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "no_contact_streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_checkin" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_ritual" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_status" varchar(50) DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_expires" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ai_sessions" ADD COLUMN "mode" varchar(20) DEFAULT 'chat' NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_sessions" ADD COLUMN "started_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ai_sessions" ADD COLUMN "ended_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ai_sessions" ADD COLUMN "token_usage" jsonb;--> statement-breakpoint
ALTER TABLE "ai_sessions" ADD COLUMN "meta" jsonb;--> statement-breakpoint
ALTER TABLE "daily_ritual_assignments" ADD CONSTRAINT "daily_ritual_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_ritual_completions" ADD CONSTRAINT "daily_ritual_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_ritual_completions" ADD CONSTRAINT "daily_ritual_completions_assignment_id_daily_ritual_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."daily_ritual_assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_ritual_events" ADD CONSTRAINT "daily_ritual_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_schedules" ADD CONSTRAINT "notification_schedules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_daily_state" ADD CONSTRAINT "user_daily_state_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_ritual_history" ADD CONSTRAINT "user_ritual_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_sessions" ADD CONSTRAINT "ai_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" DROP COLUMN "session_id";--> statement-breakpoint
ALTER TABLE "analytics_events" DROP COLUMN "event";--> statement-breakpoint
ALTER TABLE "analytics_events" DROP COLUMN "timestamp";--> statement-breakpoint
ALTER TABLE "analytics_events" DROP COLUMN "user_agent";--> statement-breakpoint
ALTER TABLE "analytics_events" DROP COLUMN "ip";--> statement-breakpoint
ALTER TABLE "analytics_events" DROP COLUMN "referer";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "reset_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "reset_token_expiry";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "current_protocol";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "protocol_day";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "dashboard_type";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "emotional_archetype";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "codename";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "avatar_style";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "streak";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "streak_days";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "longest_streak";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "no_contact_days";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_no_contact_checkin";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "no_contact_streak_threatened";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "ux_stage";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "ai_quota_used";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "ai_quota_reset_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "ritual_history";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "therapy_history";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "shop_inventory";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "badges";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_ritual_completed";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_login";--> statement-breakpoint
ALTER TABLE "ai_sessions" DROP COLUMN "amount";--> statement-breakpoint
ALTER TABLE "ai_sessions" DROP COLUMN "source";--> statement-breakpoint
ALTER TABLE "ai_sessions" DROP COLUMN "description";--> statement-breakpoint
ALTER TABLE "ai_sessions" DROP COLUMN "related_id";--> statement-breakpoint
ALTER TABLE "ai_sessions" DROP COLUMN "created_at";