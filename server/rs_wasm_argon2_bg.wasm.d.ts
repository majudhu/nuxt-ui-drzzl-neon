export interface Argon2Wasm {
  memory: WebAssembly.Memory;
  hash(a: number, b: number, c: number, d: number, e: number): void;
  verify(a: number, b: number, c: number, d: number): number;
  __wbindgen_add_to_stack_pointer(a: number): number;
  __wbindgen_malloc(a: number, b: number): number;
  __wbindgen_realloc(a: number, b: number, c: number, d: number): number;
  __wbindgen_free(a: number, b: number, c: number): void;
}
