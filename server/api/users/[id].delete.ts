import { eq } from 'drizzle-orm';
import { users } from '~/server/schema';

export default defineEventHandler(async function (event) {
  const id = parseIdOrThrow(event);

  const [user] = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning({ id: users.id });

  if (user) return null;
  else throw createError({ statusCode: 404, statusMessage: 'Not Found' });
});
