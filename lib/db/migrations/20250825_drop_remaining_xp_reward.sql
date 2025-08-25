-- Drop remaining xp_reward columns from legacy tables now fully migrated to bytes-only
ALTER TABLE IF EXISTS ritual_templates DROP COLUMN IF EXISTS xp_reward;
ALTER TABLE IF EXISTS badges DROP COLUMN IF EXISTS xp_reward;
-- Document: bytes-only economy migration finalization (2025-08-25)