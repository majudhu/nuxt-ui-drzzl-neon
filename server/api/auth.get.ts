import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '~/server/schema';

export default defineEventHandler(async function (event) {
  const id = event.context.sessions?.h3?.data?.id;

  const db = drizzle(postgres(import.meta.env.DATABASE_URL));

  const [user] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, id));
  return user;
});
