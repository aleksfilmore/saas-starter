CREATE TABLE "daily_rituals" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"target_frequency" text DEFAULT 'daily' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ritual_completions" (
	"id" text PRIMARY KEY NOT NULL,
	"ritual_id" text NOT NULL,
	"completed_at" timestamp with time zone NOT NULL,
	"notes" text,
	"mood" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily_rituals" ADD CONSTRAINT "daily_rituals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ritual_completions" ADD CONSTRAINT "ritual_completions_ritual_id_daily_rituals_id_fk" FOREIGN KEY ("ritual_id") REFERENCES "public"."daily_rituals"("id") ON DELETE no action ON UPDATE no action;