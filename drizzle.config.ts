import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './server/schema.ts',
  driver: 'pg',
  dbCredentials: { connectionString: import.meta.env.DATABASE_URL! },
} satisfies Config;
