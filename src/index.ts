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

// Load Plus Jakarta Sans variable font (single file to avoid glyph mixing)
import plusJakartaVar from "public/fonts/Inter,Plus_Jakarta_Sans/Plus_Jakarta_Sans/PlusJakartaSans-VariableFont_wght.ttf";
import faviconIco from "public/favicon.ico";

renderer.loadFont(new Uint8Array(plusJakartaVar as ArrayBuffer));

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

  // Default image (Cloudinary) with optional override via ?image=
  const defaultImageUrl =
    "https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png";
  const imageUrl = (c.req.query("image") ?? defaultImageUrl).trim();

  // Fetch the avatar image and convert to data URI (required for WASM)
  const avatarDataUri = await fetchAsDataUri(imageUrl);

  // Build the layout (1200x630)
  const WIDTH = 1200;
  const HEIGHT = 630;

  // Colors
  const bgPrimary = "#0f172a"; // slate-900-ish
  const fgPrimary = "#f8fafc"; // slate-50-ish
  const fgSecondary = "#cbd5e1"; // slate-300-ish

  const PADDING = 64;

  // Flex-based composition:
  // - Column root with padding and space-between
  // - Row main area: text (flex column) on left, image on right
  // - Footer row: site name left, social right
  const root = container({
    style: {
      width: WIDTH,
      height: HEIGHT,
      backgroundColor: bgPrimary,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: PADDING,
    },
    children: [
      // Main row: text on the left, image on the right
      container({
        style: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 48,
          flexGrow: 1,
          minHeight: 0,
        },
        children: [
          // Text column
          container({
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 24,
              flexGrow: 1,
              minWidth: 0, // allow content to shrink correctly
            },
            children: [
              // Title
              text(title, {
                color: fgPrimary,
                fontSize: 72,
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 700,
                lineHeight: 1.1,
                maxWidth: 720,
                lineClamp: 3,
                textOverflow: "ellipsis",
              }),

              // Description
              text(description, {
                color: fgSecondary,
                fontSize: 36,
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 400,
                lineHeight: 1.4,
                maxWidth: 720,
                lineClamp: 3,
                textOverflow: "ellipsis",
              }),
            ],
          }),

          // Avatar on the right
          ...(avatarDataUri
            ? [
                container({
                  style: {
                    width: 260,
                    height: 260,
                    borderRadius: percentage(50),
                    backgroundColor: "#334155",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  },
                  children: [
                    imgNode({
                      src: avatarDataUri,
                      width: 200,
                      height: 200,
                      style: {
                        borderRadius: percentage(50),
                        objectFit: "cover",
                      },
                    }),
                  ],
                }),
              ]
            : []),
        ],
      }),

      // Footer: site name (left) and social (right)
      container({
        style: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 24,
        },
        children: [
          container({
            style: {
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
              minWidth: 0,
            },
            children: [
              text(siteName, {
                color: fgPrimary,
                fontSize: 28,
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 700,
                overflowWrap: "anywhere",
              }),
            ],
          }),
          container({
            style: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              flexGrow: 1,
              minWidth: 0,
            },
            children: [
              text(social, {
                color: fgPrimary,
                fontSize: 28,
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 400,
                textAlign: "right",
                overflowWrap: "anywhere",
              }),
            ],
          }),
        ],
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

export default app;
