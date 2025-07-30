import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './minimal-schema';

// Get the database URL from environment variables
const postgresUrl = process.env.POSTGRES_URL;

if (!postgresUrl) {
  throw new Error('POSTGRES_URL environment variable is required');
}

console.log('Connecting to database with URL starting with:', postgresUrl.substring(0, 20) + '...');

export const client = postgres(postgresUrl, {
  ssl: 'require', // Required for Neon
  max: 2, // Increased from 1 to allow better connection handling
  idle_timeout: 20,
  connect_timeout: 15, // Increased timeout
  onnotice: () => {}, // Suppress notices
  debug: false, // Set to true for more detailed logging if needed
  prepare: false, // May help with Neon compatibility
});

export const db = drizzle(client, { schema });
