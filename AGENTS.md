# Project instructions

## Commands and checks

- Match CI: Node 22 and pnpm 10.17.0 (`packageManager` in `package.json`); install with `pnpm install --frozen-lockfile`.
- `pnpm dev` runs Wrangler directly. There is no separate frontend build; Wrangler bundles `src/index.tsx` and its imported assets.
- PR CI runs these checks in order:
  ```sh
  pnpm typecheck
  pnpm typecheck:workers
  pnpm test:run
  pnpm test:workers
  pnpm exec wrangler deploy --dry-run --minify
  ```
- Focused tests: `pnpm test:run src/cards/params.test.ts`; `pnpm test:workers test/worker.smoke.worker.test.ts`. The default test config excludes Worker tests.
- Regenerate `worker-configuration.d.ts` with `pnpm cf-typegen` after binding/config changes. Its explicit `wrangler.typegen.env` keeps deployment credentials out of generated types; do not replace it with plain `wrangler types`.
- Deployment uses `pnpm deploy` or the manually dispatched `.github/workflows/cloudflare-deploy.yaml`; PR CI only validates the bundle.

## Hono UI conventions

- Maximize Hono JSX for UI: build reusable `.tsx` components in `src/components/` and compose them through `c.render()` and the shared `jsxRenderer` in `src/index.tsx`. Prefer JSX over HTML strings or imperative DOM construction for UI markup.
- `jsx: "react-jsx"` names the transform, not the framework: the JSX runtime is `hono/jsx`. These pages are server-rendered, without React hydration or a browser component runtime.
- Browser interactions currently live in inline JavaScript emitted by `ClientScript.tsx` and `GreetingCardClientScript.tsx`. Keep DOM IDs/selectors aligned with their JSX; reserve `raw()` for trusted script source, not user-provided markup.
- `/styles.css` serves the string from `src/styles.css.ts`, which composes `src/cards/styles.ts`. Keep greeting-card rules scoped; this stylesheet also serves the OG editor.

## Rendering and test boundaries

- `src/index.tsx` exports the Hono app and initializes shared Takumi WASM/font resources. `/og` uses query parameters; `/cards/render` accepts JSON via POST. Renderers build Takumi node trees, not browser HTML.
- Use `@takumi-rs/wasm` for Worker rendering, not the Node-native core package. Await `renderer.render(node, { width, height, format, fonts })`; copy its bytes into a response-owned buffer, as existing routes do.
- Asset imports are binary data via Wrangler `Data` rules, not static public URLs. New asset types need matching rules in `wrangler.jsonc` and declarations in `src/assets.d.ts`.
- Keep defaults, palettes, dimensions, and limits in the relevant `src/og/config.ts` or `src/cards/config.ts`. Cards preserve blank optional names and complete messages; their PNG responses use `Cache-Control: no-store`, unlike cached OG images.
- `src/**/*.test.{ts,tsx}` runs in Node with WASM/font asset mocks. Rendering success there does not prove a valid PNG: `test/**/*.worker.test.ts` uses `@cloudflare/vitest-plugin` and real Worker/WASM resources.
- Card client tests execute the emitted script in a Node VM with fake DOM objects. Inline script bodies are not TypeScript-checked; browser verification is needed for UI wiring, image decoding, and download changes.
- Runtime code targets WebWorker APIs; `nodejs_compat` is not enabled in `wrangler.jsonc`. Node-only test utilities do not establish that an API works in production.

## Sources of truth

- Trust scripts, configs, CI, and current code over README prose. `README-OG-UI.md` has legacy OG claims (including export/import controls) that the current UI does not implement.
