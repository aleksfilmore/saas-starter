CREATE TABLE IF NOT EXISTS "user_daily_prescriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"prescribed_date" timestamp with time zone NOT NULL,
	"ritual_key" text NOT NULL,
	"shuffles_used" integer DEFAULT 0 NOT NULL,
	"is_completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"completion_notes" text,
	"completion_mood" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
	BEGIN
		ALTER TABLE "user_daily_prescriptions" ADD CONSTRAINT "user_daily_prescriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
	EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;