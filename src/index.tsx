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
import { createCardRoutes } from "./cards/routes";
import { renderCardImage } from "./cards/render";
import { GreetingCardGenerator } from "./components/GreetingCardGenerator";
import { GreetingCardClientScript } from "./components/GreetingCardClientScript";
import { GeneratorNavigation } from "./components/GeneratorNavigation";

// Initialize Takumi WASM
initSync({ module: wasmModule });

// Initialize a single renderer instance for the worker
const renderer = new Renderer();

// Load Plus Jakarta Sans variable font (single file to avoid glyph mixing)
import plusJakartaVar from "public/fonts/Inter,Plus_Jakarta_Sans/Plus_Jakarta_Sans/PlusJakartaSans-VariableFont_wght.ttf";
import faviconIco from "public/favicon.ico";
import iconSvg from "public/studio-logo.svg";

const plusJakartaFont = new Uint8Array(plusJakartaVar as ArrayBuffer);

const app = new Hono();
app.route(
  "/cards",
  createCardRoutes((input) => renderCardImage(input, renderer, plusJakartaFont)),
);

// Set up JSX renderer
app.use(
  "*",
  jsxRenderer(
    ({ children }, c) => {
      const isCards = c.req.path === "/cards";
      const title = isCards ? "Greeting Card Studio - Make a Note Worth Keeping" : "OG Image Generator - Create Beautiful Open Graph Images";
      const description = isCards
        ? "Create a personalized greeting card for birthdays, thank-you notes, congratulations, or just because. Choose a design and download a PNG."
        : "Create beautiful Open Graph images for your website with our easy-to-use generator. Customize title, description, and branding for perfect social media previews.";
      const pageUrl = `https://og-image-rev.yehezkielgunawan.workers.dev${isCards ? "/cards" : "/"}`;
      const socialImage = isCards ? "/og?title=Greeting%20Card%20Studio&description=A%20little%20card.%20A%20lot%20of%20meaning." : "/og?title=OG%20Image%20Generator&description=Create%20beautiful%20Open%20Graph%20images%20for%20your%20website";
      return (
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>{title}</title>
            <meta
              name="description"
              content={description}
            />
            <meta name="author" content="Yehezkiel Gunawan" />
            <meta
              name="keywords"
              content="og image generator, open graph, greeting cards, birthday cards, thank-you cards"
            />

            {/* Favicon and Icons */}
            <link rel="icon" type="image/x-icon" href="/favicon.ico" />
            <link rel="icon" type="image/svg+xml" href="/icon.svg" />
            <link rel="apple-touch-icon" href="/icon.svg" />

            {/* Theme and PWA */}
            <meta name="theme-color" content={isCards ? "#f7f3ec" : "#0f172a"} />
            <meta name="color-scheme" content="dark light" />

            {/* Open Graph / Social Media */}
            <meta property="og:type" content="website" />
            <meta
              property="og:title"
              content={title}
            />
            <meta
              property="og:description"
              content={description}
            />
            <meta
              property="og:image"
              content={socialImage}
            />
            <meta
              property="og:url"
              content={pageUrl}
            />
            <meta property="og:site_name" content="Yehez Image Studio" />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@yehezgun" />
            <meta
              name="twitter:title"
              content={title}
            />
            <meta
              name="twitter:description"
              content={description}
            />
            <meta
              name="twitter:image"
              content={socialImage}
            />

            {/* Robots and SEO */}
            <meta name="robots" content="index, follow" />
            <link
              rel="canonical"
              href={pageUrl}
            />

            <link rel="stylesheet" href="/styles.css" />
          </head>
          <body class={isCards ? "card-page" : undefined}>{children}</body>
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
      <GeneratorNavigation active="og" />
      <OGImageGenerator />
      <ClientScript />
    </div>,
  );
});

app.get("/cards", (c) => {
  return c.render(
    <div>
      <GeneratorNavigation active="cards" />
      <GreetingCardGenerator />
      <GreetingCardClientScript />
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
