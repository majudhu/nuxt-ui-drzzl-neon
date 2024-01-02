import { eq } from 'drizzle-orm';
import { users } from '~/server/schema';

export default defineEventHandler(async function (event) {
  const id = event.context.sessions?.h3?.data?.id;

  const [user] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, id));
  return user;
});
