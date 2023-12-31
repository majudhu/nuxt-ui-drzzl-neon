import { hash } from '@node-rs/argon2';
import { z } from 'zod';
import { users } from '~/server/schema';

export const userSchema = z.object({ name: z.string(), password: z.string() });

export type UserSchema = z.input<typeof userSchema>;

export default defineEventHandler(async function (event) {
  const data = await readValidatedBody(event, userSchema.parse);

  data.password = await hash(data.password);

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
