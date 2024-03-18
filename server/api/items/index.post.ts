import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { z } from 'zod';
import { items } from '~/server/schema';

export const itemSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string(),
  price: z
    .number()
    .positive()
    .transform((v) => v.toString()),
});

export type ItemSchema = z.input<typeof itemSchema>;

export default defineEventHandler(async function (event) {
  const data = await readValidatedBody(event, itemSchema.parse);

  const db = drizzle(postgres(import.meta.env.DATABASE_URL));

  const [item] = await db
    .insert(items)
    .values(data)
    .returning({ id: items.id });

  return item;
});
