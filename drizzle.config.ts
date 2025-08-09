import type { Config } from 'drizzle-kit';
import { config as loadEnv } from 'dotenv';

// Load environment (support .env.local first then fallback)
loadEnv({ path: '.env.local' });
loadEnv();

export default {
  schema: './lib/db/unified-schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL || '',
  },
} satisfies Config;
