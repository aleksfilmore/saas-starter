import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema-central';
import { config } from 'dotenv';

// Load environment variables: .env then .env.local (local overrides)
try { config(); } catch {}
try { config({ path: '.env.local' }); } catch {}

// Safe environment variable access
const getEnvVar = (key: string, fallback: string = '') => {
  const value = process.env[key];
  return (value && value !== 'undefined') ? value : fallback;
};

// Get the database URL from environment variables (prefer POSTGRES_URL but fall back gracefully)
// Added DATABASE_URL_UNPOOLED to cover environments providing only an unpooled URL
const postgresUrl = getEnvVar('POSTGRES_URL')
  || getEnvVar('DATABASE_URL')
  || getEnvVar('NETLIFY_DATABASE_URL')
  || getEnvVar('NETLIFY_DATABASE_URL_UNPOOLED')
  || getEnvVar('DATABASE_URL_UNPOOLED')
  || '';

// Check if we're in a build context where database connection shouldn't be established
// Consider it build time only when explicitly in Next.js production build phase.
// Avoid treating a missing POSTGRES_URL as build-time; runtime should fail fast if no DB URL.
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

if (!postgresUrl && !isBuildTime) {
  throw new Error('POSTGRES_URL (or fallback DATABASE_URL / NETLIFY_DATABASE_URL) is required');
}

// Log sanitized connection info once (dev + prod) for diagnostics
if (postgresUrl) {
  try {
    const source = getEnvVar('POSTGRES_URL') ? 'POSTGRES_URL'
      : (getEnvVar('DATABASE_URL') ? 'DATABASE_URL'
      : (getEnvVar('NETLIFY_DATABASE_URL') ? 'NETLIFY_DATABASE_URL'
      : (getEnvVar('NETLIFY_DATABASE_URL_UNPOOLED') ? 'NETLIFY_DATABASE_URL_UNPOOLED'
      : (getEnvVar('DATABASE_URL_UNPOOLED') ? 'DATABASE_URL_UNPOOLED' : 'UNKNOWN'))));
    const parts = postgresUrl.replace('postgres://', '').split('@');
    const hostPart = parts[1] ? parts[1].split('/')[0] : 'unknown-host';
    const dbName = parts[1] ? parts[1].split('/')[1]?.split('?')[0] : 'unknown-db';
    console.log(`[DB] Using ${source} host=${hostPart} db=${dbName} (env NODE_ENV=${process.env.NODE_ENV})`);
  } catch {
    console.log('[DB] Using database (sanitization failed)');
  }
}

// Create a mock client for build time to prevent connection attempts
const createClient = () => {
  // Simple mock client used for build-time or when the DB URL is missing/invalid in development
  const makeMockClient = () => {
    console.log('🏗️ Using mock database client (no valid POSTGRES_URL)');
    const transparent = (v: any) => v;
    const mockClient = {
      query: () => Promise.resolve([]),
      begin: () => Promise.resolve({ 
        query: () => Promise.resolve([]), 
        commit: () => Promise.resolve(), 
        rollback: () => Promise.resolve() 
      }),
      // `unsafe` is used by postgres-js / drizzle to execute raw queries in tests.
      // Provide a minimal implementation that returns an object with `values()` and `execute()`.
      unsafe: (_query: string, _params?: any) => ({
        values: async () => [],
        execute: async () => ({ rows: [] }),
      }),
      end: () => Promise.resolve(),
      // Provide parser arrays/objects expected by the Postgres driver and drizzle
      parsers: new Array(10000).fill(transparent),
      types: {
        builtins: {},
        getTypeParser: () => transparent,
        setTypeParser: () => {},
      },
      connection: {
        parsers: new Array(10000).fill(transparent),
      },
      // drizzle expects client.options.parsers and client.options.serializers
      options: {
        parsers: Object.create(null),
        serializers: Object.create(null),
      },
  connect: () => Promise.resolve(),
      listen: () => Promise.resolve(),
      notify: () => Promise.resolve(),
      unlisten: () => Promise.resolve(),
      parameters: {},
      escapeIdentifier: (str: string) => `"${str}"`,
      escapeLiteral: (str: string) => `'${str.replace(/'/g, "''")}'`,
    } as any;
    mockClient.client = mockClient;
    return mockClient;
  };

  // If explicitly in Next's production build phase, return a mock client to avoid network calls.
  if (isBuildTime) {
    return makeMockClient();
  }

  // At runtime (dev/test/prod) require a valid POSTGRES_URL. Fail fast if missing.
  if (!postgresUrl) {
    throw new Error('POSTGRES_URL is required at runtime. Set POSTGRES_URL in your environment.');
  }

  // Validate the URL and attempt to create a real postgres client. If the URL is invalid
  // we'll fall back to the mock client in non-production environments to avoid crashing the dev server.
  try {
    // Basic URL validation
    // This will throw on malformed inputs like the one seen in the logs (ERR_INVALID_URL)
    // Note: postgres() accepts connection strings, so constructing URL is just a validation step.
    new URL(postgresUrl);
  } catch (err) {
    const isProd = process.env.NODE_ENV === 'production' || process.env.NEXT_PHASE === 'phase-production-build';
    console.error('[DB] Invalid POSTGRES_URL:', String(err));
    if (isProd) {
      // In production we want to fail fast
      throw err;
    }
    // In development use mock client to keep the dev server healthy
    return makeMockClient();
  }

  try {
    return postgres(postgresUrl, {
      ssl: 'require', // Required for Neon
      max: 10, // Increased for production load
      idle_timeout: 20,
      connect_timeout: 10, // Faster timeout for serverless
      onnotice: () => {}, // Suppress notices
      debug: false,
      prepare: false, // Required for Neon compatibility
    });
  } catch (err) {
    console.error('[DB] Failed to create Postgres client:', err);
    // Fallback to mock client in development
    if (process.env.NODE_ENV !== 'production') {
      return makeMockClient();
    }
    throw err;
  }
};

export const client = createClient();
export const db = drizzle(client, { schema });
