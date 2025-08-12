-- Add unique constraint to username column for username uniqueness guarantee
-- This migration ensures that no two users can have the same username

-- Step 1: Remove any duplicate usernames if they exist (keep the oldest user)
WITH duplicate_usernames AS (
  SELECT username, MIN(created_at) as oldest_created_at
  FROM users 
  WHERE username IS NOT NULL AND username != ''
  GROUP BY username 
  HAVING COUNT(*) > 1
),
users_to_update AS (
  SELECT u.id, u.username, u.created_at
  FROM users u
  INNER JOIN duplicate_usernames d ON u.username = d.username
  WHERE u.created_at > d.oldest_created_at
)
UPDATE users 
SET username = username || '_' || EXTRACT(EPOCH FROM created_at)::text
WHERE id IN (SELECT id FROM users_to_update);

-- Step 2: Add unique constraint to username column
ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE (username);

-- Step 3: Add index for faster lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_username ON users (username) WHERE username IS NOT NULL;
