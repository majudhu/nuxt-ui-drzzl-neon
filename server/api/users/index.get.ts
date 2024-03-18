import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '~/server/schema';

export default defineEventHandler(function () {
  const db = drizzle(postgres(import.meta.env.DATABASE_URL));

  return db.select({ id: users.id, name: users.name }).from(users);
});
