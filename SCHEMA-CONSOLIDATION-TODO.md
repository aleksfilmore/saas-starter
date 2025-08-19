# Schema Consolidation Plan

## Current Status
- `schema.ts` - Main comprehensive schema
- `minimal-schema.ts` - Auth-focused schema  
- Various SQL files for specific features

## Action Items
1. **Create unified schema** combining both approaches
2. **Migrate legacy columns** (camelCase → snake_case)
3. **Generate single migration** for additive changes
4. **Update all imports** to use unified schema
5. **Remove duplicate schema files**

## Benefits
- Single source of truth for database structure
- Simplified maintenance and development
- Consistent column naming conventions
- Reduced complexity in imports

## Next Steps
1. Create `lib/db/unified-schema.ts`
2. Update `drizzle.config.ts` to point to unified schema
3. Generate migration with `drizzle-kit generate`
4. Apply migration in production
5. Update all code to use unified schema
6. Remove old schema files

Priority: Medium (affects maintainability, not user experience)
