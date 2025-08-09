BEGIN;
-- Adjusted simplified migration focused only on restoring wall_post_reactions.
-- Original broad additive changes were moved elsewhere; this file now strictly
-- ensures the reactions table exists. This form avoids DO $$ blocks so naive
-- semicolon-based split runners can execute it safely.

BEGIN;

CREATE TABLE IF NOT EXISTS "wall_post_reactions" (
  "id" text PRIMARY KEY NOT NULL,
  "post_id" text NOT NULL,
  "user_id" text NOT NULL,
  "reaction_type" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Constraints: may already exist; if so these statements will error. If you need
-- idempotency run scripts/restore-wall-post-reactions.js instead (preferred).
-- Comment out if your environment re-runs migrations.
ALTER TABLE "wall_post_reactions" ADD CONSTRAINT "wall_post_reactions_post_id_anonymous_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "anonymous_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "wall_post_reactions" ADD CONSTRAINT "wall_post_reactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT;
COMMIT;
