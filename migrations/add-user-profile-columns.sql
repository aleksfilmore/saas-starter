-- Migration: Add User Profile Columns
-- This adds all the required columns for the production user system

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS tier varchar(50) NOT NULL DEFAULT 'freemium',
ADD COLUMN IF NOT EXISTS archetype varchar(100),
ADD COLUMN IF NOT EXISTS archetype_details jsonb,
ADD COLUMN IF NOT EXISTS xp integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS bytes integer NOT NULL DEFAULT 100,
ADD COLUMN IF NOT EXISTS level integer NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS ritual_streak integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS no_contact_streak integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_checkin timestamp with time zone,
ADD COLUMN IF NOT EXISTS last_ritual timestamp with time zone,
ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_status varchar(50) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_expires timestamp with time zone,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone NOT NULL DEFAULT now();

-- Create index on tier for performance
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);

-- Create index on archetype for filtering
CREATE INDEX IF NOT EXISTS idx_users_archetype ON users(archetype);

-- Create index on subscription status
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW 
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END
$$;
