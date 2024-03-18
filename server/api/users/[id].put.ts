import { eq } from 'drizzle-orm';
import { pbkdf2 } from '~/server/crypto-pbkdf2';
import { users } from '~/server/schema';
import { userSchema } from './index.post';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const schema = userSchema.partial();

export default defineEventHandler(async function (event) {
  const id = parseIdOrThrow(event);

  const data = await readValidatedBody(event, schema.parse);

  if (data.password) data.password = await pbkdf2(data.password);

  const db = drizzle(postgres(import.meta.env.DATABASE_URL));

  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning({ id: users.id });

  if (user) return null;
  else throw createError({ statusCode: 404, statusMessage: 'Not Found' });
});
