-- Add email notifications preference column to users table
ALTER TABLE users ADD COLUMN email_notifications BOOLEAN NOT NULL DEFAULT true;
