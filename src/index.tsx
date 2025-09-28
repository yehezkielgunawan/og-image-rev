import { Hono } from "hono";
import { initSync, Renderer } from "@takumi-rs/wasm";
import module from "@takumi-rs/wasm/takumi_wasm_bg.wasm";
import {
  container,
  text,
  image as imgNode,
  percentage,
} from "@takumi-rs/helpers";
import { jsxRenderer } from "hono/jsx-renderer";
import { OGImageGenerator } from "./components/OGImageGenerator";
import { cssStyles } from "./styles.css.js";

// Initialize Takumi WASM
initSync({ module });

// Initialize a single renderer instance for the worker
const renderer = new Renderer();

// Load Plus Jakarta Sans variable font (single file to avoid glyph mixing)
import plusJakartaVar from "public/fonts/Inter,Plus_Jakarta_Sans/Plus_Jakarta_Sans/PlusJakartaSans-VariableFont_wght.ttf";
import faviconIco from "public/favicon.ico";
import iconSvg from "public/yehez-icon.svg";

renderer.loadFont(new Uint8Array(plusJakartaVar as ArrayBuffer));

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
      <script
        dangerouslySetInnerHTML={{
          __html: `
        // Simple debounce utility
        function debounce(func, wait) {
          let timeout;
          return function executedFunction(...args) {
            const later = () => {
              clearTimeout(timeout);
              func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
        }

        // Initialize form handlers
        document.addEventListener('DOMContentLoaded', function() {
          const form = document.querySelector('.og-generator');
          if (!form) return;

          const inputs = form.querySelectorAll('input, textarea');
          const debouncedUpdate = debounce(updatePreview, 500);

          inputs.forEach(input => {
            input.addEventListener('input', debouncedUpdate);
          });

          function updatePreview() {
            const formData = new FormData();
            inputs.forEach(input => {
              if (input.value.trim()) {
                formData.set(input.id, input.value.trim());
              }
            });

            const params = new URLSearchParams(formData);
            const previewUrl = '/og?' + params.toString() + '&t=' + Date.now();
            const fullUrl = window.location.origin + '/og?' + params.toString();

            const loadingDiv = document.querySelector('.loading-spinner');
            if (loadingDiv) loadingDiv.style.display = 'block';

            const img = document.querySelector('.preview-image');
            if (img) {
              img.src = previewUrl;
              img.onload = () => {
                if (loadingDiv) loadingDiv.style.display = 'none';
              };
            }

            const urlInput = document.querySelector('.url-input');
            if (urlInput) {
              urlInput.value = fullUrl;
            }

            const openButton = document.querySelector('.open-button');
            if (openButton) {
              openButton.setAttribute('href', fullUrl);
              openButton.setAttribute('rel', 'noopener');
            }
          }

          // Copy to clipboard
          const copyButton = document.querySelector('.copy-button');
          if (copyButton) {
            copyButton.addEventListener('click', async () => {
              const urlInput = document.querySelector('.url-input');
              if (urlInput) {
                try {
                  await navigator.clipboard.writeText(urlInput.value);
                  copyButton.textContent = 'Copied!';
                  setTimeout(() => {
                    copyButton.textContent = 'Copy URL';
                  }, 2000);
                } catch (err) {
                  console.error('Failed to copy:', err);
                }
              }
            });
          }

          // Preset buttons
          const presets = {
            'Default': {
              title: 'Welcome to My Site',
              description: 'This is a sample description for the OG image',
              siteName: 'yehezgun.com',
              social: 'Twitter: @yehezgun',
              image: 'https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png'
            },
            'Blog Post': {
              title: 'Understanding Modern Web Development',
              description: 'A comprehensive guide to building web applications',
              siteName: 'Tech Blog',
              social: 'Follow us @techblog',
              image: 'https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png'
            },
            'Product Launch': {
              title: 'Introducing Our New Product',
              description: 'Revolutionary features that will change how you work',
              siteName: 'ProductCorp',
              social: 'LinkedIn: /company/productcorp',
              image: 'https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png'
            },
            'Event': {
              title: 'Web Development Conference 2024',
              description: 'Join us for three days of learning and innovation',
              siteName: 'DevConf 2024',
              social: 'Register at devconf.com',
              image: 'https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png'
            }
          };

          document.querySelectorAll('.preset-button').forEach(button => {
            button.addEventListener('click', () => {
              const presetData = presets[button.textContent.trim()];
              if (presetData) {
                Object.keys(presetData).forEach(key => {
                  const input = document.getElementById(key);
                  if (input) {
                    input.value = presetData[key];
                  }
                });
                updatePreview();
              }
            });
          });

          // Reset button
          const resetButton = document.querySelector('.reset-button');
          if (resetButton) {
            resetButton.addEventListener('click', () => {
              if (confirm('Reset all fields?')) {
                const defaultData = {
                  title: 'Title',
                  description: 'Description',
                  siteName: 'yehezgun.com',
                  social: 'Twitter: @yehezgun',
                  image: 'https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png'
                };
                Object.keys(defaultData).forEach(key => {
                  const input = document.getElementById(key);
                  if (input) input.value = defaultData[key];
                });
                updatePreview();
              }
            });
          }

          updatePreview();
        });
      `,
        }}
      />
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
