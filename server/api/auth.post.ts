import { verify } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { users } from '~/server/schema';

const loginSchema = z.object({ name: z.string(), password: z.string() });

export type LoginSchema = z.input<typeof loginSchema>;

export default defineEventHandler(async function (event) {
  const data = await readValidatedBody(event, loginSchema.parse);

  const [user] = await db.select().from(users).where(eq(users.name, data.name));

  if (user && (await verify(user.password, data.password))) {
    const session = await useTypedSession(event);
    await session.update({ id: user.id, name: user.name });
    return { name: user.name };
  } else throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
});
