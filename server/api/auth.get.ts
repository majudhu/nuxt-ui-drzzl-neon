import { eq } from 'drizzle-orm';
import { users } from '~/server/schema';

export default defineEventHandler(async function (event) {
  const { data } = await useTypedSession(event);

  if (!data.id) return null;

  const db = getDb(event);

  const [user] = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, data.id));
  return user ?? null;
});
