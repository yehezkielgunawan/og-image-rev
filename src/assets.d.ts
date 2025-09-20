/**
 * Ambient module declarations for font asset imports.
 *
 * In Cloudflare Workers with Wrangler "Data" rules, importing .ttf/.woff/.woff2
 * yields the binary contents. We type them as ArrayBuffer so they can be passed
 * directly to `new Uint8Array(...)` for Takumi font loading APIs.
 */

declare module "*.ttf" {
  const data: ArrayBuffer;
  export default data;
}

declare module "*.woff" {
  const data: ArrayBuffer;
  export default data;
}

declare module "*.woff2" {
  const data: ArrayBuffer;
  export default data;
}

declare module "*.ico" {
  const data: ArrayBuffer;
  export default data;
}

declare module "*.svg" {
  const data: ArrayBuffer;
  export default data;
}
