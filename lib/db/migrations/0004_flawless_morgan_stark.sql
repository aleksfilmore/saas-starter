CREATE TABLE IF NOT EXISTS "ai_letters" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"letter_type" text NOT NULL,
	"recipient" text NOT NULL,
	"emotion" text NOT NULL,
	"scenario" text NOT NULL,
	"generated_content" text NOT NULL,
	"is_private" boolean DEFAULT true NOT NULL,
	"was_sent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "anonymous_post_hearts" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "anonymous_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer,
	"content" text NOT NULL,
	"category" text DEFAULT 'general' NOT NULL,
	"hearts" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_check_ins" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"period_id" text NOT NULL,
	"check_in_date" timestamp with time zone NOT NULL,
	"did_text_trash" boolean DEFAULT false NOT NULL,
	"mood" integer NOT NULL,
	"had_intrusive_thoughts" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
	-- Guard: only attempt to add columns if no_contact_periods table exists
	IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='no_contact_periods') THEN
		IF NOT EXISTS (
			SELECT 1 FROM information_schema.columns WHERE table_name='no_contact_periods' AND column_name='streak_shields_used'
		) THEN
			ALTER TABLE "no_contact_periods" ADD COLUMN "streak_shields_used" integer DEFAULT 0 NOT NULL;
		END IF;
		IF NOT EXISTS (
			SELECT 1 FROM information_schema.columns WHERE table_name='no_contact_periods' AND column_name='max_streak_shields_per_week'
		) THEN
			ALTER TABLE "no_contact_periods" ADD COLUMN "max_streak_shields_per_week" integer DEFAULT 1 NOT NULL;
		END IF;
	END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
	BEGIN
		-- Only add FK if types align (prevent 42804)
		IF (
			SELECT data_type FROM information_schema.columns WHERE table_name='ai_letters' AND column_name='user_id'
		) = (
			SELECT data_type FROM information_schema.columns WHERE table_name='users' AND column_name='id'
		) THEN
			ALTER TABLE "ai_letters" ADD CONSTRAINT "ai_letters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
		END IF;
	EXCEPTION WHEN duplicate_object THEN NULL; END;
	BEGIN
		ALTER TABLE "anonymous_post_hearts" ADD CONSTRAINT "anonymous_post_hearts_post_id_anonymous_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."anonymous_posts"("id") ON DELETE no action ON UPDATE no action;
	EXCEPTION WHEN duplicate_object THEN NULL; END;
	BEGIN
		IF (
			SELECT data_type FROM information_schema.columns WHERE table_name='anonymous_post_hearts' AND column_name='user_id'
		) = (
			SELECT data_type FROM information_schema.columns WHERE table_name='users' AND column_name='id'
		) THEN
			ALTER TABLE "anonymous_post_hearts" ADD CONSTRAINT "anonymous_post_hearts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
		END IF;
	EXCEPTION WHEN duplicate_object THEN NULL; END;
	BEGIN
		IF (
			SELECT data_type FROM information_schema.columns WHERE table_name='anonymous_posts' AND column_name='user_id'
		) = (
			SELECT data_type FROM information_schema.columns WHERE table_name='users' AND column_name='id'
		) THEN
			ALTER TABLE "anonymous_posts" ADD CONSTRAINT "anonymous_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
		END IF;
	EXCEPTION WHEN duplicate_object THEN NULL; END;
	BEGIN
		IF (
			SELECT data_type FROM information_schema.columns WHERE table_name='daily_check_ins' AND column_name='user_id'
		) = (
			SELECT data_type FROM information_schema.columns WHERE table_name='users' AND column_name='id'
		) THEN
			ALTER TABLE "daily_check_ins" ADD CONSTRAINT "daily_check_ins_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
		END IF;
	EXCEPTION WHEN duplicate_object THEN NULL; END;
	BEGIN
		-- Only add FK to no_contact_periods if table exists
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='no_contact_periods') THEN
			BEGIN
				ALTER TABLE "daily_check_ins" ADD CONSTRAINT "daily_check_ins_period_id_no_contact_periods_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."no_contact_periods"("id") ON DELETE no action ON UPDATE no action;
			EXCEPTION WHEN duplicate_object THEN NULL; END;
		END IF;
	END;
END $$;