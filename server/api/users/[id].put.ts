import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { users } from '~/server/schema';
import { userSchema } from './index.post';

const schema = userSchema.partial();

export default defineEventHandler(async function (event) {
  const id = parseIdOrThrow(event);

  const data = await readValidatedBody(event, schema.parse);

  if (data.password) data.password = await hash(data.password);

  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning({ id: users.id });

  if (user) return null;
  else throw createError({ statusCode: 404, statusMessage: 'Not Found' });
});
