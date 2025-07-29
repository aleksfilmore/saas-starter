import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

// Temporarily handle missing database URL for development
const postgresUrl = process.env.POSTGRES_URL || 'postgresql://localhost:5432/dev_fallback';

if (!process.env.POSTGRES_URL) {
  console.warn('⚠️  POSTGRES_URL environment variable is not set. Using fallback for development.');
}

export const client = postgres(postgresUrl, {
  // Add connection options to handle development environment
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  // Don't fail on connection errors in development
  onnotice: () => {},
});

export const db = drizzle(client, { schema });
