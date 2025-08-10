-- Idempotent guards: only attempt legacy integer coercions if users.id still integer-like
DO $$ BEGIN
	IF (
		SELECT data_type FROM information_schema.columns WHERE table_name='users' AND column_name='id'
	) != 'text' THEN
		-- Only run these if columns are not already text; avoids failed casts now that schema uses text IDs
		IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='no_contact_periods') THEN
			IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='no_contact_periods' AND column_name='user_id' AND data_type!='text') THEN
				ALTER TABLE "no_contact_periods" ALTER COLUMN "user_id" SET DATA TYPE integer USING user_id::integer;
			END IF;
		END IF;
		IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sessions' AND column_name='user_id' AND data_type!='text') THEN
			ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE integer USING user_id::integer;
		END IF;
		-- Users.id legacy normalization skipped: 'serial' keyword not valid in ALTER TYPE context on Neon; keep existing type.
		-- (Previously attempted: ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE serial;)
		-- If needed we could ensure integer here, but unified schema uses text going forward.
	END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
	-- email type normalization
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='email') THEN
		-- Only alter if type differs
		IF (SELECT data_type FROM information_schema.columns WHERE table_name='users' AND column_name='email') <> 'character varying' THEN
			ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);
		END IF;
	END IF;

	-- Add columns if missing
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='name') THEN
		ALTER TABLE "users" ADD COLUMN "name" varchar(100);
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_hash') THEN
		ALTER TABLE "users" ADD COLUMN "password_hash" text NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
		ALTER TABLE "users" ADD COLUMN "role" varchar(20) DEFAULT 'member' NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='created_at') THEN
		ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='updated_at') THEN
		ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='deleted_at') THEN
		ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp;
	END IF;
	-- Drop legacy hashed_password only if it still exists
	IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='hashed_password') THEN
		ALTER TABLE "users" DROP COLUMN "hashed_password";
	END IF;
END $$;--> statement-breakpoint