import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { users } from '~/server/schema';
import { pbkdf2Verify } from '../crypto-pbkdf2';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const loginSchema = z.object({ name: z.string(), password: z.string() });

export type LoginSchema = z.input<typeof loginSchema>;

export default defineEventHandler(async function (event) {
  const data = await readValidatedBody(event, loginSchema.parse);

  const db = drizzle(postgres(import.meta.env.DATABASE_URL));

  const [user] = await db.select().from(users).where(eq(users.name, data.name));

  if (user && (await pbkdf2Verify(user.password, data.password))) {
    const session = await useTypedSession(event);
    await session.update({ id: user.id, name: user.name });
    return { name: user.name };
  } else throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
});
