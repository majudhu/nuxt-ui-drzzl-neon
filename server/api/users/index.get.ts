import { users } from '~/server/schema';

export default defineEventHandler(function (event) {
  const db = getDb(event);

  return db.select({ id: users.id, name: users.name }).from(users);
});
