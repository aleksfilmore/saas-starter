CREATE TABLE IF NOT EXISTS "admin_audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"admin_user_id" text NOT NULL,
	"action" text NOT NULL,
	"target_user_id" text,
	"target_resource_id" text,
	"old_value" text,
	"new_value" text,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "badges" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"icon_url" text NOT NULL,
	"category" text NOT NULL,
	"xp_reward" integer DEFAULT 0 NOT NULL,
	"byte_reward" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "badges_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_badges" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"badge_id" text NOT NULL,
	"earned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" text
);
--> statement-breakpoint
DO $$ BEGIN
	-- Phase 1: if users.id still integer (or anything not text), drop dependent FKs then convert users.id to text
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='id' AND data_type!='text') THEN
		-- Drop known FKs referencing users.id (guard each table existence)
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='ai_letters') THEN
			ALTER TABLE ai_letters DROP CONSTRAINT IF EXISTS ai_letters_user_id_users_id_fk;
		END IF;
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='anonymous_post_hearts') THEN
			ALTER TABLE anonymous_post_hearts DROP CONSTRAINT IF EXISTS anonymous_post_hearts_user_id_users_id_fk;
		END IF;
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='anonymous_posts') THEN
			ALTER TABLE anonymous_posts DROP CONSTRAINT IF EXISTS anonymous_posts_user_id_users_id_fk;
		END IF;
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='daily_check_ins') THEN
			ALTER TABLE daily_check_ins DROP CONSTRAINT IF EXISTS daily_check_ins_user_id_users_id_fk;
		END IF;
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='daily_rituals') THEN
			ALTER TABLE daily_rituals DROP CONSTRAINT IF EXISTS daily_rituals_user_id_users_id_fk;
		END IF;
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='user_daily_prescriptions') THEN
			ALTER TABLE user_daily_prescriptions DROP CONSTRAINT IF EXISTS user_daily_prescriptions_user_id_users_id_fk;
		END IF;
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='activity_logs') THEN
			ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_user_id_users_id_fk;
		END IF;
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='invitations') THEN
			ALTER TABLE invitations DROP CONSTRAINT IF EXISTS invitations_invited_by_users_id_fk;
		END IF;
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='team_members') THEN
			ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_user_id_users_id_fk;
		END IF;
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='user_badges') THEN
			ALTER TABLE user_badges DROP CONSTRAINT IF EXISTS user_badges_user_id_users_id_fk;
		END IF;
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='admin_audit_log') THEN
			ALTER TABLE admin_audit_log DROP CONSTRAINT IF EXISTS admin_audit_log_admin_user_id_users_id_fk;
			ALTER TABLE admin_audit_log DROP CONSTRAINT IF EXISTS admin_audit_log_target_user_id_users_id_fk;
		END IF;
		-- Convert users.id
		ALTER TABLE users ALTER COLUMN id TYPE text USING id::text;
	END IF;

	-- Phase 2: convert referencing columns now that users.id is text
	-- Helper procedure style via repeated IF EXISTS checks
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ai_letters' AND column_name='user_id' AND data_type!='text') THEN
		ALTER TABLE ai_letters ALTER COLUMN user_id TYPE text USING user_id::text;
	END IF;
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_post_hearts' AND column_name='user_id' AND data_type!='text') THEN
		ALTER TABLE anonymous_post_hearts ALTER COLUMN user_id TYPE text USING user_id::text;
	END IF;
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='user_id' AND data_type!='text') THEN
		ALTER TABLE anonymous_posts ALTER COLUMN user_id TYPE text USING user_id::text;
	END IF;
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_check_ins' AND column_name='user_id' AND data_type!='text') THEN
		ALTER TABLE daily_check_ins ALTER COLUMN user_id TYPE text USING user_id::text;
	END IF;
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='daily_rituals' AND column_name='user_id' AND data_type!='text') THEN
		ALTER TABLE daily_rituals ALTER COLUMN user_id TYPE text USING user_id::text;
	END IF;
	IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='no_contact_periods') THEN
		IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='no_contact_periods' AND column_name='user_id' AND data_type!='text') THEN
			ALTER TABLE no_contact_periods ALTER COLUMN user_id TYPE text USING user_id::text;
		END IF;
	END IF;
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sessions' AND column_name='user_id' AND data_type!='text') THEN
		ALTER TABLE sessions ALTER COLUMN user_id TYPE text USING user_id::text;
	END IF;
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_daily_prescriptions' AND column_name='user_id' AND data_type!='text') THEN
		ALTER TABLE user_daily_prescriptions ALTER COLUMN user_id TYPE text USING user_id::text;
	END IF;

	-- Phase 3: timestamps adjustments
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='created_at') THEN
		ALTER TABLE users ALTER COLUMN created_at SET DATA TYPE timestamp with time zone;
		ALTER TABLE users ALTER COLUMN created_at SET DEFAULT now();
	END IF;
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='updated_at') THEN
		ALTER TABLE users ALTER COLUMN updated_at SET DATA TYPE timestamp with time zone;
		ALTER TABLE users ALTER COLUMN updated_at SET DEFAULT now();
	END IF;

	-- Phase 4: add new columns if missing
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='username') THEN
		ALTER TABLE users ADD COLUMN username text;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar') THEN
		ALTER TABLE users ADD COLUMN avatar text;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='onboarding_completed') THEN
		ALTER TABLE users ADD COLUMN onboarding_completed boolean DEFAULT false NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='subscription_tier') THEN
		ALTER TABLE users ADD COLUMN subscription_tier text DEFAULT 'ghost_mode' NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='xp_points') THEN
		ALTER TABLE users ADD COLUMN xp_points integer DEFAULT 0 NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='byte_balance') THEN
		ALTER TABLE users ADD COLUMN byte_balance integer DEFAULT 100 NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='glow_up_level') THEN
		ALTER TABLE users ADD COLUMN glow_up_level integer DEFAULT 1 NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_admin') THEN
		ALTER TABLE users ADD COLUMN is_admin boolean DEFAULT false NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='is_banned') THEN
		ALTER TABLE users ADD COLUMN is_banned boolean DEFAULT false NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_active_at') THEN
		ALTER TABLE users ADD COLUMN last_active_at timestamp with time zone;
	END IF;

	-- Phase 5: recreate FKs (guarded)
	BEGIN EXECUTE 'ALTER TABLE admin_audit_log ADD CONSTRAINT admin_audit_log_admin_user_id_users_id_fk FOREIGN KEY (admin_user_id) REFERENCES users(id)'; EXCEPTION WHEN duplicate_object THEN NULL; END;
	BEGIN EXECUTE 'ALTER TABLE admin_audit_log ADD CONSTRAINT admin_audit_log_target_user_id_users_id_fk FOREIGN KEY (target_user_id) REFERENCES users(id)'; EXCEPTION WHEN duplicate_object THEN NULL; END;
	BEGIN EXECUTE 'ALTER TABLE user_badges ADD CONSTRAINT user_badges_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id)'; EXCEPTION WHEN duplicate_object THEN NULL; END;
	BEGIN EXECUTE 'ALTER TABLE user_badges ADD CONSTRAINT user_badges_badge_id_badges_id_fk FOREIGN KEY (badge_id) REFERENCES badges(id)'; EXCEPTION WHEN duplicate_object THEN NULL; END;

	-- Phase 6: drop legacy columns if present
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='name') THEN
		ALTER TABLE users DROP COLUMN name;
	END IF;
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
		ALTER TABLE users DROP COLUMN role;
	END IF;
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='deleted_at') THEN
		ALTER TABLE users DROP COLUMN deleted_at;
	END IF;

	-- Unique constraint
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='users_username_unique') THEN
		ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE(username);
	END IF;
END $$;--> statement-breakpoint