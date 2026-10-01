# og-image-rev

Open Graph images and personalized digital greeting cards, powered by:
- Cloudflare Workers + Hono
- Takumi (`@takumi-rs/wasm`, `@takumi-rs/helpers`)
- Plus Jakarta Sans (variable font)

The web app offers two editors: Open Graph images at `/`, and **Greeting Card Studio** at `/cards`. Both generate PNGs using the same Worker and WASM renderer.

## Greeting Card Studio

Open `/cards`, choose an occasion, template, color palette, and format, then personalize your heading, message, recipient, and sender. Preview changes automatically and download the finished PNG.

- **Occasions:** Birthday, Thank You, Congratulations, and General Greeting (shown as “Just because”).
- **Templates:** Minimal, Celebratory, and Elegant.
- **Palettes:** Rose & cream, Blue & mist, and Ink & paper.
- **Formats:** Square (1080×1080) and portrait (1080×1350).
- **Text:** Heading up to 80 characters; message up to 400 characters and 12 explicit lines; optional recipient and sender up to 60 characters each.
- **Personalization:** Changing an occasion updates suggested wording only when it still matches the previous suggestion. Changing a design keeps your text.
- **Preview:** Text updates are debounced by 400 ms. Downloads are disabled while the preview is outdated or invalid; failed updates keep the last successful preview visible.
- **Export:** Downloads use the same PNG as the current preview. Cards are rendered on demand and are not saved in a database.

The bundled Plus Jakarta Sans font supports Latin text, including common accented names such as José, Zoë, and Renée. Emoji and non-Latin script coverage are not guaranteed; decorations use shapes rather than emoji fonts.

## Quick start (pnpm)

- Install dependencies
  - `pnpm install`
- Run locally (Wrangler dev)
  - `pnpm dev`
- Deploy to Cloudflare Workers
  - `pnpm deploy`
- Generate/sync Worker types
  - `pnpm cf-typegen`

## Testing

- Run tests in watch mode
  - `pnpm test`
- Run tests once (CI)
  - `pnpm test:run`
- Test the real Worker and WASM renderer
  - `pnpm test:workers`
- Check application and Worker test types
  - `pnpm typecheck`
  - `pnpm typecheck:workers`

Notes:
- Unit tests run in Node with WASM/font mocks; Worker tests exercise real WASM PNG output and verify card dimensions.
- Coverage includes OG routes, card validation and rendering, card API errors/body limits, and browser-script behavior such as stale response handling and blob URL cleanup.

## API

### POST /cards/render

Accepts `Content-Type: application/json` and returns an `image/png`. All eight fields below must be provided; optional names should be empty strings when unused.

```json
{
  "occasion": "birthday",
  "template": "minimal",
  "theme": "warm",
  "size": "square",
  "heading": "Happy birthday!",
  "recipient": "Alex",
  "message": "Wishing you a wonderful day.\nHere's to the year ahead!",
  "sender": "Sam"
}
```

Allowed values:
- `occasion`: `birthday`, `thank-you`, `congratulations`, `general`.
- `template`: `minimal`, `celebratory`, `elegant`.
- `theme`: `warm`, `cool`, `neutral`.
- `size`: `square`, `portrait`.

Text limits match the editor above. Surrounding whitespace is trimmed, message line breaks are preserved, and the font size adapts to the amount of text. The server does not truncate card messages.

```sh
curl "http://127.0.0.1:8787/cards/render" \
  -H "Content-Type: application/json" \
  --data '{"occasion":"thank-you","template":"elegant","theme":"cool","size":"portrait","heading":"Thank you!","recipient":"Alex","message":"Your kindness means so much.","sender":"Sam"}' \
  --output greeting-card.png
```

Responses:
- `200`: PNG bytes; `Cache-Control: no-store` and `X-Content-Type-Options: nosniff`.
- `400`: Invalid JSON or card fields, with `{ "error": "...", "field": "..." }` for field validation errors.
- `413`: Request exceeds 16 KB, including streamed bodies without a declared length.
- `415`: Content type is not `application/json`.
- `500`: `{ "error": "Unable to render card. Please try again." }`.

The card endpoint is intended for the same-origin editor and does not expose cross-origin CORS access. It does not fetch external photos or assets.

### GET /og

Renders a 1200x630 `image/png`.

Query params:
- `title`: string (default: `Title`)
- `description`: string (default: `Description`)
- `siteName`: string (default: `yehezgun.com`)
- `social`: string (default: `Twitter: @yehezgun`)
- `cta`: optional call-to-action text (default: empty)
- `image`: string (URL). If omitted, defaults to your Cloudinary avatar:
  - `https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png`

Response headers:
- `Content-Type: image/png`
- `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`

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
- Rendering uses `await renderer.render(root, { width, height, format: "png", fonts })` to produce PNG bytes.
- Output is returned as a Response with a typed `Uint8Array` body
- Compatibility date:
   - This project uses `compatibility_date: "2026-09-23"`.

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
