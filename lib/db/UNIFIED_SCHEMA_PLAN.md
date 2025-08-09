# Unified Schema Merge Plan

Purpose: Consolidate `schema.ts` and `minimal-schema.ts` plus new notification + AI tables into a single canonical `unified-schema.ts` without destructive drops.

## Strategy
1. Create `unified-schema.ts` as a superset. Include:
   - Users: All columns from both versions (snake_case + legacy camelCase). Mark legacy duplicates with comment `// TODO: deprecate`.
   - Sessions: Keep one version (minimal + existing identical fields).
   - Ritual & Daily structures: prefer richer minimal-schema daily assignment/completion/state tables; keep legacy ritual prescriptions & ritual_entries for backwards compat.
   - Wall / Gamification: keep as-is from existing `schema.ts`.
   - Analytics: choose minimal-schema `analytics_events` (id SERIAL, event_type, properties jsonb, day_index). Keep legacy `analytics_events` columns (event, timestamp, etc.) temporarily? DECISION: We will NOT duplicate; we migrate old table if it exists to new shape manually later. Mark in migration notes.
   - Notifications: include `notifications`, `push_subscriptions`, planned `notification_schedules`.
   - AI: include `ai_sessions`.
2. Point Drizzle config & runtime to unified schema.
3. Bulk replace imports from `minimal-schema` to `unified-schema`.
4. Generate migration (drizzle-kit generate) producing additive changes (new tables, new columns). Manually inspect + adjust if necessary.
5. Apply migration.
6. Remove old schema files or leave with export stubs re-exporting from unified (non-breaking) for one release.

## New Table: notification_schedules
Columns:
- id text pk (uuid)
- user_id fk -> users.id
- type varchar(50)
- cron_expression text
- is_active boolean default true
- last_sent_at timestamptz
- next_run_at timestamptz
- backoff_seconds integer default 0
- dedupe_window_seconds integer default 0
- created_at timestamptz default now()
- updated_at timestamptz default now()

## Backoff & Dedupe Logic (Service Level)
- When scheduling, check existing unsent notification of same type within dedupe_window; skip if exists.
- After send failure, increment backoff: next attempt now + exponential (base 2) capped at e.g. 6h.

## Follow-up Cleanup (Not in first migration)
- Deprecate legacy camelCase columns (xpPoints, byteBalance, glowUpLevel, subscriptionTier) after code stops referencing.
- Migrate legacy analytics_events shape if data present.

## Safety Notes
- Do NOT drop columns in first pass.
- Tag migration with clear comment header.

---
Pending Implementation Steps:
[ ] Add `unified-schema.ts` file.
[ ] Update `drizzle.config.ts`.
[ ] Update `drizzle.ts` importer.
[ ] Replace imports referencing minimal-schema.
[ ] Add schedule repository + service updates.
[ ] Generate & apply migration.
