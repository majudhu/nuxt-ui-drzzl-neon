import { eq } from 'drizzle-orm';
import { items } from '~/server/schema';
import { itemSchema } from './index.post';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const schema = itemSchema.partial();

export default defineEventHandler(async function (event) {
  const id = parseIdOrThrow(event);

  const data = await readValidatedBody(event, schema.parse);

  const db = drizzle(postgres(import.meta.env.DATABASE_URL));

  const [item] = await db
    .update(items)
    .set(data)
    .where(eq(items.id, id))
    .returning({ id: items.id });

  if (item) return null;
  else throw createError({ statusCode: 404, statusMessage: 'Not Found' });
});
