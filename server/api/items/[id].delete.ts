import { eq } from 'drizzle-orm';
import { items } from '~/server/schema';

export default defineEventHandler(async function (event) {
  const id = parseIdOrThrow(event);

  const db = getDb(event);

  const [item] = await db
    .delete(items)
    .where(eq(items.id, id))
    .returning({ id: items.id });

  if (item) return null;
  else throw createError({ statusCode: 404, statusMessage: 'Not Found' });
});
