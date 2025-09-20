import { Hono } from "hono";
import { initSync, Renderer } from "@takumi-rs/wasm";
import module from "@takumi-rs/wasm/takumi_wasm_bg.wasm";
import {
  container,
  text,
  image as imgNode,
  percentage,
} from "@takumi-rs/helpers";

// Initialize Takumi WASM
initSync({ module });

// Initialize a single renderer instance for the worker
const renderer = new Renderer();

// Load Plus Jakarta Sans fonts (Regular and Bold)
import plusJakartaRegular from "public/fonts/Inter,Plus_Jakarta_Sans/Plus_Jakarta_Sans/static/PlusJakartaSans-Regular.ttf";
import plusJakartaBold from "public/fonts/Inter,Plus_Jakarta_Sans/Plus_Jakarta_Sans/static/PlusJakartaSans-Bold.ttf";
import faviconIco from "public/favicon.ico";
import yehezIconSvg from "public/yehez-icon.svg";

renderer.loadFont(new Uint8Array(plusJakartaRegular as ArrayBuffer));

renderer.loadFont(new Uint8Array(plusJakartaBold as ArrayBuffer));

const app = new Hono();

app.get("/", (c) => c.text("OK"));
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

app.get("/og", async (c) => {
  // Query parameters
  const title = (c.req.query("title") ?? "").trim() || "Title";
  const description =
    (c.req.query("description") ?? "").trim() || "Description";
  const siteName = (c.req.query("siteName") ?? "").trim() || "yehezgun.com";
  const social = (c.req.query("social") ?? "").trim() || "Twitter: @yehezgun";
  const imageUrl = (c.req.query("image") ?? "").trim();

  // Optionally fetch the avatar image and convert to data URI; fallback to default yehez icon
  const avatarDataUri = imageUrl
    ? await fetchAsDataUri(imageUrl)
    : toDataUriFromImported(yehezIconSvg, "image/svg+xml");

  // Build the layout (1200x630)
  const WIDTH = 1200;
  const HEIGHT = 630;

  // Colors
  const bgPrimary = "#0f172a"; // slate-900-ish
  const bgSecondary = "#334155"; // slate-700-ish for circle background
  const fgPrimary = "#f8fafc"; // slate-50-ish
  const fgSecondary = "#cbd5e1"; // slate-300-ish

  const PADDING = 64;

  // Main composition:
  // - Dark background
  // - Left: Title, Description
  // - Bottom-left: Site name
  // - Right: Circle background + optional avatar image (masked circle)
  // - Bottom-right: Social handle
  const root = container({
    style: {
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: bgPrimary,
    },
    children: [
      // Right-side circle background
      container({
        style: {
          position: "absolute",
          left: WIDTH - (PADDING + 300),
          top: PADDING + 20,
          width: 300,
          height: 300,
          backgroundColor: bgSecondary,
          borderRadius: percentage(50),
        },
      }),

      // Optional avatar image (circular)
      ...(avatarDataUri
        ? [
            imgNode({
              src: avatarDataUri,
              width: 240,
              height: 240,
              style: {
                position: "absolute",
                left: WIDTH - (PADDING + 270),
                top: PADDING + 50,
                borderRadius: percentage(50),
              },
            }),
          ]
        : []),

      // Title
      text(title, {
        position: "absolute",
        left: PADDING,
        top: PADDING + 40,
        color: fgPrimary,
        fontSize: 72,
        fontFamily: "Plus Jakarta Sans",
        fontWeight: 700,
        lineHeight: 1.1,
        maxWidth: 620,
      }),

      // Description
      text(description, {
        position: "absolute",
        left: PADDING,
        top: PADDING + 160,
        color: fgSecondary,
        fontSize: 36,
        fontFamily: "Plus Jakarta Sans",
        fontWeight: 400,
        lineHeight: 1.4,
        maxWidth: 620,
      }),

      // Site Name (bottom-left)
      text(siteName, {
        position: "absolute",
        left: PADDING,
        top: HEIGHT - PADDING,
        color: fgPrimary,
        fontSize: 28,
        fontFamily: "Plus Jakarta Sans",
        fontWeight: 700,
      }),

      // Social (bottom-right)
      text(social, {
        position: "absolute",
        left: WIDTH - (PADDING + 360),
        top: HEIGHT - PADDING,
        color: fgPrimary,
        fontSize: 28,
        fontFamily: "Plus Jakarta Sans",
        fontWeight: 400,
        maxWidth: 340,
        textAlign: "right",
      }),
    ],
  });

  // Render image (PNG)
  const png = renderer.render(root, WIDTH, HEIGHT, "png");

  // Ensure Response body uses ArrayBuffer-backed Uint8Array
  const body = new Uint8Array(png.byteLength);
  body.set(png);

  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=60",
    },
  });
});

// Helper: fetch URL and convert to data URI for Takumi WASM
async function fetchAsDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const contentType =
      res.headers.get("content-type")?.split(";")[0] || "image/png";
    const buf = await res.arrayBuffer();
    const base64 = arrayBufferToBase64(buf);

    return `data:${contentType};base64,${base64}`;
  } catch {
    return null;
  }
}

function arrayBufferToBase64(buf: ArrayBufferLike): string {
  let binary = "";
  const bytes = new Uint8Array(buf);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  // @ts-ignore btoa is available in Workers runtime
  return btoa(binary);
}

function toDataUriFromImported(asset: any, mime: string): string | null {
  try {
    if (typeof asset === "string") {
      if (asset.startsWith("data:")) return asset;
      // Treat as raw SVG string content when mime is svg
      if (mime.includes("svg")) {
        return `data:${mime};utf8,${encodeURIComponent(asset)}`;
      }
      return null;
    }
    if (asset instanceof ArrayBuffer) {
      const base64 = arrayBufferToBase64(asset);
      return `data:${mime};base64,${base64}`;
    }
    if (asset && typeof asset === "object" && "byteLength" in asset) {
      const src = new Uint8Array(asset as ArrayBufferLike);
      const copy = new Uint8Array(src.byteLength);
      copy.set(src);
      const base64 = arrayBufferToBase64(copy.buffer);
      return `data:${mime};base64,${base64}`;
    }
    return null;
  } catch {
    return null;
  }
}

export default app;
