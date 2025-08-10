DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_no_contact_checkin'
	) THEN
		ALTER TABLE "users" ADD COLUMN "last_no_contact_checkin" timestamp with time zone;
	END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='no_contact_streak_threatened'
	) THEN
		ALTER TABLE "users" ADD COLUMN "no_contact_streak_threatened" boolean DEFAULT false NOT NULL;
	END IF;
END $$;