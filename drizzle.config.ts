import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './server/schema.ts',
  driver: 'pg',
  dbCredentials: { connectionString: process.env.DATABASE_URL! },
} satisfies Config;
