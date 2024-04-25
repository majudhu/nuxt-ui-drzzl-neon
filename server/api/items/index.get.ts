import { items } from '~/server/schema';

export default defineEventHandler(async function (event) {
  const db = getDb(event);

  return db.select().from(items);
});
