import { eq } from 'drizzle-orm';
import { items } from '~/server/schema';

export default defineEventHandler(async function (event) {
  const id = parseIdOrThrow(event);

  const db = getDb(event);

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
