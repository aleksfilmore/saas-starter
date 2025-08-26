# Database Migration Down / Cleanup Strategy

This document describes a pragmatic rollback approach now that a baseline snapshot and manual migrations are in play.

## 1. Baseline Philosophy
The generated `000000_baseline_snapshot.sql` reflects the current live schema. Treat it as an authoritative starting point for **new environments only**. Do not edit it retroactively. Future changes happen via forward migrations (timestamped files).

## 2. Rollback Categories
| Scenario | Approach |
|----------|----------|
| Simple column/table just added (no data dependency) | Create a `*_down_*.sql` migration that drops the object (idempotent guards) and run manually if needed. |
| Column added & populated (backfill) | New down file: (a) drop dependent indexes/constraints, (b) optional data archival (COPY to temp table), (c) drop column. |
| Enum value added | Postgres cannot remove enum value easily; mark value deprecated in code instead of rollback. |
| Data transform (e.g. text->jsonb) | Maintain a reversible shadow column during forward migration; down uses shadow to restore original then drops new column. Future transforms should follow this pattern. |
| Critical failure immediately after deploy | Fast path: restore from managed provider PITR (Point‑In‑Time Restore) snapshot; re‑point app. |
| Accidental destructive migration applied | Use PITR or manual restore of dumped table (see Section 6). |

## 3. Forward Migration Authoring Guidelines
1. ALWAYS add `BEGIN; ... COMMIT;` for multi‑step transforms.
2. Make operations idempotent where feasible ( `ADD COLUMN IF NOT EXISTS`, guard DO blocks for enums ).
3. For destructive changes, add a preflight SELECT counting rows to a NOTICE (safe log).
4. Prefer additive changes; deprecate before dropping.

## 4. Down Migration Authoring Pattern
Example skeleton:
```sql
-- 20250901_down_drop_example_feature.sql
BEGIN;
-- 1. Optional: archive data
-- CREATE TABLE IF NOT EXISTS _archive_example AS SELECT * FROM example; -- one‑time snapshot
-- 2. Drop dependent indexes / fkeys
-- DROP INDEX IF EXISTS example_x_idx;
-- 3. Drop column/table
-- ALTER TABLE example DROP COLUMN IF EXISTS new_col;
COMMIT;
```
Place alongside forward migrations; manual runner skips files containing `_down_` unless explicitly executed.

## 5. Manual Runner Usage
```bash
npm run db:migrate:manual
```
The manual script records filenames in `_manual_migrations`; to rollback you must run down files manually:
```bash
psql $POSTGRES_URL -f lib/db/migrations/20250901_down_drop_example_feature.sql
```
(Or temporarily adjust the runner to include a whitelist.)

## 6. Ad‑Hoc Table / Column Backup
Before risky ops:
```sql
CREATE TABLE IF NOT EXISTS _backup_users_20250901 AS SELECT * FROM users;
```
Or dump:
```bash
pg_dump --data-only --table=users $POSTGRES_URL > users_20250901.sql
```

## 7. Journal Bootstrapping (Drizzle)
1. Ensure baseline & all forward migrations are applied.
2. Generate journal scaffold:
```bash
npm run db:journal:generate
```
3. (Optional) Spin up temp DB, apply baseline + forwards using drizzle to capture authentic hashes, then copy those hash values into `meta/_journal.json` replacing `null`.
4. Once hashes match drizzle’s expectations you can resume `drizzle-kit migrate` for new migrations.

## 8. Verification Checklist After Any Migration
- Schema diff: `SELECT ... FROM information_schema.columns` compare expected vs actual.
- Index presence: `\d+ table_name` (psql) or query pg_indexes.
- Query plan check for new indexes: `EXPLAIN ANALYZE` relevant analytic query.
- Application smoke tests: bytes awarding, analytics tracking, admin dashboard tabs.

## 9. Emergency Rollback Playbook
1. Detect issue (errors, performance regression, data corruption).
2. Disable user‑facing feature flag or route if possible.
3. If reversible via down migration: apply down file.
4. If not reversible and within provider PITR window: restore clone at pre‑deployment timestamp; validate; swap connection string.
5. Post‑mortem: add reversible pattern to future migrations; update tests.

## 10. Testing Migrations Locally
```bash
# Fresh container / local Postgres
psql $POSTGRES_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
node scripts/apply-sql-migrations.js
# Optionally run baseline to ensure idempotence
psql $POSTGRES_URL -f lib/db/migrations/000000_baseline_snapshot.sql
```
Expect no errors second run.

---
Maintainer: Add new sections as processes evolve. Keep this doc in sync with tooling changes.
