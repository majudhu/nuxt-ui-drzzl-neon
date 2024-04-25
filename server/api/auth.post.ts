import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { users } from '~/server/schema';
import type { Argon2Wasm } from '~/server/rs_wasm_argon2_bg.wasm.d';

const encoder = new TextEncoder();
let memory8: Uint8Array;

const loginSchema = z.object({ name: z.string(), password: z.string() });

export type LoginSchema = z.input<typeof loginSchema>;

export default defineLazyEventHandler(async function () {
  // @ts-expect-error TODO: https://github.com/nuxt/nuxt/issues/14131
  const wasm: Argon2Wasm = await import('~/server/rs_wasm_argon2_bg.wasm');

  return defineEventHandler(async function (event) {
    const data = await readValidatedBody(event, loginSchema.parse);

    const db = getDb(event);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.name, data.name));

    // https://github.com/KhronosGroup/KTX-Software/issues/371#issuecomment-822299324
    // https://stackoverflow.com/a/54062241
    if (memory8?.byteLength === 0) memory8 = new Uint8Array(wasm.memory.buffer);

    if (
      user &&
      wasm.verify(
        ...passStringToWasm(data.password, wasm),
        ...passStringToWasm(user.password, wasm)
      )
    ) {
      const session = await useTypedSession(event);
      await session.update({ id: user.id, name: user.name });
      return { name: user.name };
    } else throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  });
});

function passStringToWasm(string: string, wasm: Argon2Wasm): [number, number] {
  const len = string.length * 4;
  let ptr = wasm.__wbindgen_malloc(len, 1) >>> 0;
  memory8 ??= new Uint8Array(wasm.memory.buffer);
  const view = memory8.subarray(ptr, ptr + len);
  const { written } = encoder.encodeInto(string, view);
  ptr = wasm.__wbindgen_realloc(ptr, len, written, 1) >>> 0;
  return [ptr, written];
}
