# og-image-rev

Dynamic Open Graph (OG) image generator powered by:
- Cloudflare Workers + Hono
- Takumi (`@takumi-rs/wasm`, `@takumi-rs/helpers`)
- Plus Jakarta Sans (variable font)

This project exposes a single API endpoint to render 1200x630 OG images with configurable title, description, site name, social, and avatar image.

## Quick start (pnpm)

- Install dependencies
  - `pnpm install`
- Run locally (Wrangler dev)
  - `pnpm dev`
- Deploy to Cloudflare Workers
  - `pnpm deploy`
- Generate/sync Worker types
  - `pnpm cf-typegen`

## API

### GET /og

Renders a 1200x630 `image/png`.

Query params:
- `title`: string (default: `Title`)
- `description`: string (default: `Description`)
- `siteName`: string (default: `yehezgun.com`)
- `social`: string (default: `Twitter: @yehezgun`)
- `image`: string (URL). If omitted, defaults to your Cloudinary avatar:
  - `https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png`

Response headers:
- `Content-Type: image/png`
- `Cache-Control: public, max-age=60`

Example (browser):
```
http://127.0.0.1:8787/og?title=Hello%20World&description=Composable%20OG%20images&siteName=yehezgun.com&social=Twitter:%20@yehezgun
```

Example (cURL):
```sh
curl "http://127.0.0.1:8787/og?title=My%20Long%20Title&description=This%20is%20a%20description" --output og.png
```

### GET /favicon.ico

Serves the project’s default favicon from `public/favicon.ico` with:
- `Content-Type: image/x-icon`
- `Cache-Control: public, max-age=86400`

## Layout details

- Uses flex layout for robust wrapping:
  - Left: Title (clamped to 3 lines) and Description (clamped to 2 lines)
  - Right: Avatar inside a gray circular background (not oversized)
  - Footer: Site name (left) and Social (right), both in flex containers to handle long text
- Font family:
  - Plus Jakarta Sans (variable font), loaded into Takumi for consistent weight rendering
- Colors:
  - Background: dark slate
  - Text: light foreground with a softer secondary for description

## Fonts and assets

- Fonts: Plus Jakarta Sans variable font (TTF) is loaded at Worker startup for consistent glyph rendering across weights.
- Default avatar: Cloudinary URL above (can be overridden via `?image=` query).
- Wrangler `Data` rules are configured to allow importing binary/font assets:
  - `**/*.ttf`, `**/*.woff`, `**/*.woff2`, `**/*.ico`, `**/*.svg`

## TypeScript setup

- Absolute imports enabled via `baseUrl` + `paths`
  - `public/*` and `src/*`
- WebWorker lib included so `fetch`/`Response` types work in Workers
- Arbitrary extensions allowed for asset imports (WASM/fonts/icons)
- Ambient declarations for assets exist in `src/assets.d.ts`

## Tech notes

- Takumi WASM is initialized once at startup:
  - `initSync({ module })` with `@takumi-rs/wasm/takumi_wasm_bg.wasm`
- Rendering API is synchronous in the WASM build:
  - `renderer.render(root, 1200, 630, "png")` returns `Uint8Array`
- Output is returned as a Response with a typed `Uint8Array` body
- Compatibility date:
  - This project uses a recent `compatibility_date` (2025-09-20). The Takumi docs verify a minimum of `2025-08-03` for WASM initialization; the current date exceeds that.

## Examples

Minimal default:
```
/og
```

Custom with long text:
```
/og?title=This%20is%20a%20very%20long%20title%20that%20should%20clamp%20nicely&description=Descriptions%20also%20clamp%20to%202%20lines%20for%20consistency
```

Override avatar:
```
/og?image=https://example.com/avatar.png
```

## Development tips

- If you add/rename fonts under `public/fonts`, Wrangler’s `Data` rules will keep imports working.
- For consistent typography across glyphs, prefer a single variable font (already configured).
- The layout uses `flex`, `gap`, and `minWidth: 0` on containers to ensure long text wraps and doesn’t overflow.

## License

MIT
