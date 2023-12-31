import { items } from '~/server/schema';

export default defineEventHandler(async function () {
  return db.select().from(items);
});
