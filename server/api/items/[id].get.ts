import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { items } from '~/server/schema';

export default defineEventHandler(async function (event) {
  const id = parseIdOrThrow(event);

  const db = drizzle(postgres(import.meta.env.DATABASE_URL));

  const [item] = await db
    .select({
      name: items.name,
      description: items.description,
      price: items.price,
      image: items.image,
    })
    .from(items)
    .where(eq(items.id, id));

  if (item) return item;
  else throw createError({ statusCode: 404, statusMessage: 'Not Found' });
});
