export default defineEventHandler(async function (event) {
  await (await useTypedSession(event)).clear();
  return null;
});
