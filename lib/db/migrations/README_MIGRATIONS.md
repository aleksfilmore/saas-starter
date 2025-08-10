# Migrations Notes

This project previously contained duplicate / experimental migrations (e.g. multiple `0009_*.sql` variants and a destructive historical refactor). Those have been pruned.

Immutable history was already mutated for resilience; from this point forward:

1. Treat remaining numbered migrations as a frozen baseline.
2. Use *forward-only* additive migrations for any further schema changes / normalizations.
3. Avoid retroactively editing old migration files again (hash drift + replay churn risk).
4. If a fresh environment needs bootstrapping, run the current chain then apply new migrations.

If you ever need to re-baseline (e.g. to squash), create a high-numbered snapshot migration (e.g. `1000_baseline.sql`) that reflects the live schema at that moment and then deprecate earlier files in version control (never silently delete on a deployed branch without also resetting the migrations table).

## Removed Files
- `0009_military_deathbird.sql` (destructive) -> replaced by forward-safe approach.
- `0009_safe_unified_extension.sql` (duplicate additive) -> consolidated.

## Next Steps
- Ensure database has recorded migrations up through `0012_normalize_user_foreign_keys.sql`.
- Add new migrations starting at `0013_...` as needed.
