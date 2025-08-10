// Main database exports
// NOTE: Temporary dual export: legacy code still imports from './schema'. New code should migrate to './unified-schema'.
export { db, client } from './drizzle';
export * from './schema'; // legacy
// Export unified schema under a namespace to avoid symbol collisions
import * as Unified from './unified-schema';
export { Unified };
