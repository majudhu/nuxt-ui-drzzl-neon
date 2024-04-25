import { eq } from 'drizzle-orm';
import { items } from '~/server/schema';
import { itemSchema } from './index.post';

const schema = itemSchema.partial();

export default defineEventHandler(async function (event) {
  const id = parseIdOrThrow(event);

  const data = await readValidatedBody(event, schema.parse);

  const db = getDb(event);

  const [item] = await db
    .update(items)
    .set(data)
    .where(eq(items.id, id))
    .returning({ id: items.id });

  if (item) return null;
  else throw createError({ statusCode: 404, statusMessage: 'Not Found' });
});
