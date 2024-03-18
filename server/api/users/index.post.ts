import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { z } from 'zod';
import { pbkdf2 } from '~/server/crypto-pbkdf2';
import { users } from '~/server/schema';

export const userSchema = z.object({ name: z.string(), password: z.string() });

export type UserSchema = z.input<typeof userSchema>;

export default defineEventHandler(async function (event) {
  const data = await readValidatedBody(event, userSchema.parse);

  data.password = await pbkdf2(data.password);

  const db = drizzle(postgres(import.meta.env.DATABASE_URL));

  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoNothing()
    .returning({ id: users.id });

  if (user) return user;
  else
    throw createError({
      statusCode: 400,
      statusMessage: 'User name already exists',
    });
});
