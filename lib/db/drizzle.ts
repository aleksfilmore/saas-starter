import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema-central';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

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
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                   process.env.NODE_ENV === undefined ||
                   !postgresUrl;

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
  if (isBuildTime || !postgresUrl) {
    console.log('🏗️ Build time detected, using mock database client');
    
    // Simple mock client that should work with both direct access and webpack alias
    const mockClient = {
      query: () => Promise.resolve([]),
      begin: () => Promise.resolve({ 
        query: () => Promise.resolve([]), 
        commit: () => Promise.resolve(), 
        rollback: () => Promise.resolve() 
      }),
      end: () => Promise.resolve(),
      parsers: new Array(10000).fill((val: any) => val),
      types: {
        builtins: {},
        getTypeParser: () => (val: any) => val,
        setTypeParser: () => {},
      },
      connection: {
        parsers: new Array(10000).fill((val: any) => val),
      },
      options: {},
      connect: () => Promise.resolve(),
      listen: () => Promise.resolve(),
      notify: () => Promise.resolve(),
      unlisten: () => Promise.resolve(),
      parameters: {},
      escapeIdentifier: (str: string) => `"${str}"`,
      escapeLiteral: (str: string) => `'${str.replace(/'/g, "''")}'`,
    } as any;

    // Add self-referencing client property for code that accesses client.client
    mockClient.client = mockClient;
    
    return mockClient;
  }

  return postgres(postgresUrl, {
    ssl: 'require', // Required for Neon
    max: 10, // Increased for production load
    idle_timeout: 20,
    connect_timeout: 10, // Faster timeout for serverless
    onnotice: () => {}, // Suppress notices
    debug: false,
    prepare: false, // Required for Neon compatibility
  });
};

export const client = createClient();
export const db = drizzle(client, { schema });
