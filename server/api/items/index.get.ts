import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { items } from '~/server/schema';

export default defineEventHandler(async function () {
  const db = drizzle(postgres(import.meta.env.DATABASE_URL));
  return db.select().from(items);
});
