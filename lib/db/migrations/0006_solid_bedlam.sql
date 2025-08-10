CREATE TABLE IF NOT EXISTS "rituals" (
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
-- Backfill user_id column if table pre-existed without it (prevents FK add failure 42703)
DO $$ BEGIN
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='rituals')
	AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rituals' AND column_name='user_id') THEN
	ALTER TABLE "rituals" ADD COLUMN "user_id" text;
END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='reset_token') THEN ALTER TABLE "users" ADD COLUMN "reset_token" text; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='reset_token_expiry') THEN ALTER TABLE "users" ADD COLUMN "reset_token_expiry" timestamp with time zone; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='tier') THEN ALTER TABLE "users" ADD COLUMN "tier" text DEFAULT 'freemium' NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='status') THEN ALTER TABLE "users" ADD COLUMN "status" text DEFAULT 'active' NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='current_protocol') THEN ALTER TABLE "users" ADD COLUMN "current_protocol" text; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='protocol_day') THEN ALTER TABLE "users" ADD COLUMN "protocol_day" integer DEFAULT 0 NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='dashboard_type') THEN ALTER TABLE "users" ADD COLUMN "dashboard_type" text DEFAULT 'freemium' NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='emotional_archetype') THEN ALTER TABLE "users" ADD COLUMN "emotional_archetype" text; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='codename') THEN ALTER TABLE "users" ADD COLUMN "codename" text; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar_style') THEN ALTER TABLE "users" ADD COLUMN "avatar_style" text; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='xp') THEN ALTER TABLE "users" ADD COLUMN "xp" integer DEFAULT 0 NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='bytes') THEN ALTER TABLE "users" ADD COLUMN "bytes" integer DEFAULT 100 NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='level') THEN ALTER TABLE "users" ADD COLUMN "level" integer DEFAULT 1 NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='streak') THEN ALTER TABLE "users" ADD COLUMN "streak" integer DEFAULT 0 NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='streak_days') THEN ALTER TABLE "users" ADD COLUMN "streak_days" integer DEFAULT 0 NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='longest_streak') THEN ALTER TABLE "users" ADD COLUMN "longest_streak" integer DEFAULT 0 NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='no_contact_days') THEN ALTER TABLE "users" ADD COLUMN "no_contact_days" integer DEFAULT 0 NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='ux_stage') THEN ALTER TABLE "users" ADD COLUMN "ux_stage" text DEFAULT 'newcomer'; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='ai_quota_used') THEN ALTER TABLE "users" ADD COLUMN "ai_quota_used" integer DEFAULT 0 NOT NULL; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='ai_quota_reset_at') THEN ALTER TABLE "users" ADD COLUMN "ai_quota_reset_at" timestamp with time zone; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='ritual_history') THEN ALTER TABLE "users" ADD COLUMN "ritual_history" text DEFAULT '[]'; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='therapy_history') THEN ALTER TABLE "users" ADD COLUMN "therapy_history" text DEFAULT '[]'; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='shop_inventory') THEN ALTER TABLE "users" ADD COLUMN "shop_inventory" text DEFAULT '[]'; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='badges') THEN ALTER TABLE "users" ADD COLUMN "badges" text DEFAULT '[]'; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_ritual_completed') THEN ALTER TABLE "users" ADD COLUMN "last_ritual_completed" timestamp with time zone; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_login') THEN ALTER TABLE "users" ADD COLUMN "last_login" timestamp with time zone; END IF; END $$;--> statement-breakpoint
DO $$ BEGIN BEGIN ALTER TABLE "rituals" ADD CONSTRAINT "rituals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action; EXCEPTION WHEN duplicate_object THEN NULL; END; END $$;