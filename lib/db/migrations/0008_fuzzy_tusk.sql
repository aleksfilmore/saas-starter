CREATE TABLE IF NOT EXISTS "analytics_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"session_id" text,
	"event" text NOT NULL,
	"properties" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"user_agent" text,
	"ip" text,
	"referer" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conversion_funnels" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"funnel_name" text NOT NULL,
	"stage" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"properties" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "referrals" (
	"id" text PRIMARY KEY NOT NULL,
	"referrer_id" text NOT NULL,
	"referee_id" text,
	"referral_code" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"reward_type" text,
	"reward_amount" integer DEFAULT 0,
	"clicked_at" timestamp with time zone,
	"signed_up_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "referrals_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ritual_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"ritual_code" varchar(64) NOT NULL,
	"ritual_title" varchar(128),
	"performed_at" timestamp with time zone DEFAULT now(),
	"mood" integer,
	"what_i_did" text,
	"how_i_feel" text,
	"tags" varchar(256),
	"source" varchar(16) DEFAULT 'text',
	"time_spent_seconds" integer,
	"text_length" integer,
	"xp_awarded" integer DEFAULT 0,
	"bytes_awarded" integer DEFAULT 0,
	"tokens_used" integer DEFAULT 0,
	"summary_id" text,
	"sentiment" varchar(16),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"event_type" text NOT NULL,
	"plan_id" text,
	"amount" integer,
	"currency" text DEFAULT 'usd',
	"status" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"session_id" text NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"last_activity" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone,
	"device_type" text,
	"browser" text,
	"os" text,
	CONSTRAINT "user_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "weekly_summaries" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"week_start" timestamp NOT NULL,
	"week_end" timestamp NOT NULL,
	"bullets" text,
	"sentiment_avg" integer,
	"next_suggestion" text,
	"entry_count" integer DEFAULT 0,
	"tokens_used" integer DEFAULT 0,
	"generated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
	BEGIN
		ALTER TABLE "ritual_entries" ADD CONSTRAINT "ritual_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
	EXCEPTION WHEN duplicate_object THEN NULL; END;
	BEGIN
		ALTER TABLE "weekly_summaries" ADD CONSTRAINT "weekly_summaries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
	EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;--> statement-breakpoint
DO $$ BEGIN BEGIN CREATE INDEX "ritual_entries_user_id_performed_at_index" ON "ritual_entries" USING btree ("user_id","performed_at"); EXCEPTION WHEN duplicate_table THEN NULL; END; END $$;--> statement-breakpoint
DO $$ BEGIN BEGIN CREATE INDEX "ritual_entries_user_id_ritual_code_index" ON "ritual_entries" USING btree ("user_id","ritual_code"); EXCEPTION WHEN duplicate_table THEN NULL; END; END $$;--> statement-breakpoint
DO $$ BEGIN BEGIN CREATE INDEX "ritual_entries_user_id_created_at_index" ON "ritual_entries" USING btree ("user_id","created_at"); EXCEPTION WHEN duplicate_table THEN NULL; END; END $$;--> statement-breakpoint
DO $$ BEGIN BEGIN CREATE INDEX "weekly_summaries_user_id_week_start_index" ON "weekly_summaries" USING btree ("user_id","week_start"); EXCEPTION WHEN duplicate_table THEN NULL; END; END $$;