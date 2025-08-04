CREATE TABLE "byte_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"source" text NOT NULL,
	"description" text NOT NULL,
	"related_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wall_post_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"parent_comment_id" text,
	"bytes_earned" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wall_post_reactions" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"user_id" text NOT NULL,
	"reaction_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "xp_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"source" text NOT NULL,
	"description" text NOT NULL,
	"related_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_audit_log" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ai_letters" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "anonymous_post_hearts" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "admin_audit_log" CASCADE;--> statement-breakpoint
DROP TABLE "ai_letters" CASCADE;--> statement-breakpoint
DROP TABLE "anonymous_post_hearts" CASCADE;--> statement-breakpoint
ALTER TABLE "no_contact_periods" ALTER COLUMN "max_streak_shields_per_week" SET DEFAULT 2;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "glitch_title" text;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "glitch_category" text DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "glitch_overlay" text;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "resonate_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "same_loop_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "dragged_me_too_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "stone_cold_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "cleansed_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "comment_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "bytes_earned" integer DEFAULT 25 NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "is_anonymous" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "is_featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "is_oracle_post" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "is_viral_awarded" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "anonymous_posts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "badges" ADD COLUMN "tier" text DEFAULT 'bronze' NOT NULL;--> statement-breakpoint
ALTER TABLE "badges" ADD COLUMN "rarity" text DEFAULT 'common' NOT NULL;--> statement-breakpoint
ALTER TABLE "no_contact_periods" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "ritual_completions" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "byte_transactions" ADD CONSTRAINT "byte_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wall_post_comments" ADD CONSTRAINT "wall_post_comments_post_id_anonymous_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."anonymous_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wall_post_comments" ADD CONSTRAINT "wall_post_comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wall_post_reactions" ADD CONSTRAINT "wall_post_reactions_post_id_anonymous_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."anonymous_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wall_post_reactions" ADD CONSTRAINT "wall_post_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "xp_transactions" ADD CONSTRAINT "xp_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ritual_completions" ADD CONSTRAINT "ritual_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" DROP COLUMN "metadata";