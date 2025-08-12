import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './actual-schema';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Get the database URL from environment variables
const postgresUrl = process.env.POSTGRES_URL;

if (!postgresUrl) {
  throw new Error('POSTGRES_URL environment variable is required');
}

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('Connecting to database with URL starting with:', postgresUrl.substring(0, 20) + '...');
}

export const client = postgres(postgresUrl, {
  ssl: 'require', // Required for Neon
  max: 10, // Increased for production load
  idle_timeout: 20,
  connect_timeout: 10, // Faster timeout for serverless
  onnotice: () => {}, // Suppress notices
  debug: false,
  prepare: false, // Required for Neon compatibility
});

export const db = drizzle(client, { schema });
