ALTER TABLE "users" ADD COLUMN "last_no_contact_checkin" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "no_contact_streak_threatened" boolean DEFAULT false NOT NULL;