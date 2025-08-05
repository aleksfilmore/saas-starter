CREATE TABLE "rituals" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"intensity" integer DEFAULT 1 NOT NULL,
	"duration" integer DEFAULT 10 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"is_reroll" boolean DEFAULT false NOT NULL,
	"xp_reward" integer DEFAULT 50 NOT NULL,
	"bytes_reward" integer DEFAULT 25 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_token_expiry" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tier" text DEFAULT 'freemium' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_protocol" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "protocol_day" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "dashboard_type" text DEFAULT 'freemium' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emotional_archetype" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "codename" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_style" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "xp" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bytes" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "level" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "streak_days" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "longest_streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "no_contact_days" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ux_stage" text DEFAULT 'newcomer';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ai_quota_used" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ai_quota_reset_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ritual_history" text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "therapy_history" text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "shop_inventory" text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "badges" text DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_ritual_completed" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_login" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "rituals" ADD CONSTRAINT "rituals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;