import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { items } from '~/server/schema';

export default defineEventHandler(async function (event) {
  const id = parseIdOrThrow(event);

  const db = drizzle(postgres(import.meta.env.DATABASE_URL));

  const [item] = await db
    .delete(items)
    .where(eq(items.id, id))
    .returning({ id: items.id });

  if (item) return null;
  else throw createError({ statusCode: 404, statusMessage: 'Not Found' });
});
