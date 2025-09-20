/**
 * Ambient module declaration for importing .wasm files.
 * This allows imports like:
 *   import mod from "@takumi-rs/wasm/takumi_wasm_bg.wasm";
 * without TS2307 errors.
 *
 * We intentionally use `any` because the concrete runtime type of the imported
 * value varies by bundler/target (ArrayBuffer, URL string, Response, etc.).
 */
declare module '*.wasm' {
  const wasm: any;
  export default wasm;
}
