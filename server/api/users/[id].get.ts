import { eq } from 'drizzle-orm';
import { users } from '~/server/schema';

export default defineEventHandler(async function (event) {
  const id = parseIdOrThrow(event);

  const [user] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, id));

  if (user) return user;
  else throw createError({ statusCode: 404, statusMessage: 'Not Found' });
});
