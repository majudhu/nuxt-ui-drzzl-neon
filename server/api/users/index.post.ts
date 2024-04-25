import { z } from 'zod';
import { users } from '~/server/schema';
import type { Argon2Wasm } from '~/server/rs_wasm_argon2_bg.wasm.d';

const decoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
const encoder = new TextEncoder();
let memory8: Uint8Array;
let memory32: Int32Array;

export const userSchema = z.object({ name: z.string(), password: z.string() });

export type UserSchema = z.input<typeof userSchema>;

export default defineLazyEventHandler(async function () {
  // @ts-expect-error TODO: https://github.com/nuxt/nuxt/issues/14131
  const wasm: Argon2Wasm = await import('~/server/rs_wasm_argon2_bg.wasm');
  return defineEventHandler(async function (event) {
    const data = await readValidatedBody(event, userSchema.parse);

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    wasm.hash(
      retptr,
      ...passStringToWasm(data.password, wasm),
      ...passArray8ToWasm(salt, wasm)
    );
    // https://github.com/KhronosGroup/KTX-Software/issues/371#issuecomment-822299324
    // https://stackoverflow.com/a/54062241
    if (memory8.byteLength === 0) memory8 = new Uint8Array(wasm.memory.buffer);

    memory32 ??= new Int32Array(wasm.memory.buffer);
    const ptr = memory32[retptr / 4 + 0] >>> 0;
    const len = memory32[retptr / 4 + 1];
    data.password = decoder.decode(memory8.subarray(ptr, ptr + len));
    wasm.__wbindgen_free(ptr, len, 1);

    const db = getDb(event);

    const [user] = await db
      .insert(users)
      .values(data)
      .onConflictDoNothing()
      .returning({ id: users.id });

    if (user) return user;
    else
      throw createError({
        statusCode: 400,
        statusMessage: 'User name already exists',
      });
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

function passArray8ToWasm(
  array: Uint8Array,
  wasm: Argon2Wasm
): [number, number] {
  const len = array.length;
  let ptr = wasm.__wbindgen_malloc(len, 1) >>> 0;
  memory8 ??= new Uint8Array(wasm.memory.buffer);
  memory8.set(array, ptr);
  return [ptr, len];
}
