import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '~/server/schema';

export default defineEventHandler(async function (event) {
  const id = parseIdOrThrow(event);

  const db = drizzle(postgres(import.meta.env.DATABASE_URL));

  const [user] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, id));

  if (user) return user;
  else throw createError({ statusCode: 404, statusMessage: 'Not Found' });
});
