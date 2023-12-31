import { users } from '~/server/schema';

export default defineEventHandler(function () {
  return db.select({ id: users.id, name: users.name }).from(users);
});
