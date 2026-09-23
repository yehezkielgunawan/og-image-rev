import { Hono } from "hono";
import { initSync, Renderer } from "@takumi-rs/wasm";
import wasmModule from "@takumi-rs/wasm/auto";
import { jsxRenderer } from "hono/jsx-renderer";
import { OGImageGenerator } from "./components/OGImageGenerator";
import { ClientScript } from "./components/ClientScript";
import { cssStyles } from "./styles.css.js";
import { fetchImage } from "./og/image";
import { parseOgParams } from "./og/params";
import { renderOgImage } from "./og/render";

// Initialize Takumi WASM
initSync({ module: wasmModule });

// Initialize a single renderer instance for the worker
const renderer = new Renderer();

// Load Plus Jakarta Sans variable font (single file to avoid glyph mixing)
import plusJakartaVar from "public/fonts/Inter,Plus_Jakarta_Sans/Plus_Jakarta_Sans/PlusJakartaSans-VariableFont_wght.ttf";
import faviconIco from "public/favicon.ico";
import iconSvg from "public/yehez-icon.svg";

const plusJakartaFont = new Uint8Array(plusJakartaVar as ArrayBuffer);

const app = new Hono();

// Set up JSX renderer
app.use(
  "*",
  jsxRenderer(
    ({ children }) => {
      return (
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>
              OG Image Generator - Create Beautiful Open Graph Images
            </title>
            <meta
              name="description"
              content="Create beautiful Open Graph images for your website with our easy-to-use generator. Customize title, description, and branding for perfect social media previews."
            />
            <meta name="author" content="Yehezkiel Gunawan" />
            <meta
              name="keywords"
              content="og image generator, open graph, social media, meta tags, seo, twitter cards"
            />

            {/* Favicon and Icons */}
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="icon" type="image/svg+xml" href="/icon.svg" />
            <link rel="apple-touch-icon" href="/icon.svg" />

            {/* Theme and PWA */}
            <meta name="theme-color" content="#0f172a" />
            <meta name="color-scheme" content="dark light" />

            {/* Open Graph / Social Media */}
            <meta property="og:type" content="website" />
            <meta
              property="og:title"
              content="OG Image Generator - Create Beautiful Open Graph Images"
            />
            <meta
              property="og:description"
              content="Create beautiful Open Graph images for your website with our easy-to-use generator. Customize title, description, and branding for perfect social media previews."
            />
            <meta
              property="og:image"
              content="/og?title=OG%20Image%20Generator&description=Create%20beautiful%20Open%20Graph%20images%20for%20your%20website"
            />
            <meta
              property="og:url"
              content="https://og-image-rev.yehezkielgunawan.workers.dev/"
            />
            <meta property="og:site_name" content="OG Image Generator" />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@yehezgun" />
            <meta
              name="twitter:title"
              content="OG Image Generator - Create Beautiful Open Graph Images"
            />
            <meta
              name="twitter:description"
              content="Create beautiful Open Graph images for your website with our easy-to-use generator. Customize title, description, and branding for perfect social media previews."
            />
            <meta
              name="twitter:image"
              content="/og?title=OG%20Image%20Generator&description=Create%20beautiful%20Open%20Graph%20images%20for%20your%20website"
            />

            {/* Robots and SEO */}
            <meta name="robots" content="index, follow" />
            <link
              rel="canonical"
              href="https://og-image-rev.yehezkielgunawan.workers.dev/"
            />

            <link rel="stylesheet" href="/styles.css" />
          </head>
          <body>{children}</body>
        </html>
      );
    },
    {
      docType: true,
    },
  ),
);

// Main UI route
app.get("/", (c) => {
  return c.render(
    <div>
      <OGImageGenerator />
      <ClientScript />
    </div>,
  );
});

// Serve CSS file
app.get("/styles.css", async (c) => {
  return new Response(cssStyles, {
    headers: {
      "Content-Type": "text/css",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

// Health check
app.get("/health", (c) => c.text("OK"));

// Serve favicon
app.get(
  "/favicon.ico",
  () =>
    new Response(faviconIco as any, {
      headers: {
        "Content-Type": "image/x-icon",
        "Cache-Control": "public, max-age=86400",
      },
    }),
);

// Serve SVG icon
app.get(
  "/icon.svg",
  () =>
    new Response(iconSvg as any, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    }),
);

// Handle CORS preflight for /og endpoint
app.options("/og", (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
});

app.get("/og", async (c) => {
  const parsed = parseOgParams(new URL(c.req.url).searchParams);
  if (!parsed.ok) {
    return c.json({ error: parsed.error }, 400);
  }

  const avatar = await fetchImage(parsed.value.image);

  try {
    const png = await renderOgImage(
      parsed.value,
      avatar,
      renderer,
      plusJakartaFont,
    );

    const body = new Uint8Array(png.byteLength);
    body.set(png);

    return new Response(body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control":
          "public, max-age=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "X-Content-Type-Options": "nosniff",
        "Content-Length": body.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        message: "og image render failed",
        error: error instanceof Error ? error.message : String(error),
      }),
    );

    return c.json(
      { error: "Unable to render image" },
      500,
      { "Cache-Control": "no-store" },
    );
  }
});

export default app;
