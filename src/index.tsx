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

// Initialize Takumi WASM
initSync({ module });

// Initialize a single renderer instance for the worker
const renderer = new Renderer();

// Load Plus Jakarta Sans variable font (single file to avoid glyph mixing)
import plusJakartaVar from "public/fonts/Inter,Plus_Jakarta_Sans/Plus_Jakarta_Sans/PlusJakartaSans-VariableFont_wght.ttf";
import faviconIco from "public/favicon.ico";

renderer.loadFont(new Uint8Array(plusJakartaVar as ArrayBuffer));

const app = new Hono();

// Set up JSX renderer
app.use(
  "*",
  jsxRenderer(
    ({ children }) => {
      return (
        <html>
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>OG Image Generator</title>
            <meta
              name="description"
              content="Create beautiful Open Graph images for your website"
            />
            <style
              dangerouslySetInnerHTML={{
                __html: `
              /* Reset and Base Styles */
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }

              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                  sans-serif;
                line-height: 1.6;
                color: #1f2937;
                background-color: #f9fafb;
                min-height: 100vh;
              }

              /* Main Generator Layout */
              .og-generator {
                max-width: 1400px;
                margin: 0 auto;
                padding: 2rem;
                min-height: 100vh;
              }

              .generator-header {
                text-align: center;
                margin-bottom: 3rem;
              }

              .generator-header h1 {
                font-size: 3rem;
                font-weight: 700;
                color: #111827;
                margin-bottom: 0.5rem;
              }

              .generator-header p {
                font-size: 1.25rem;
                color: #6b7280;
              }

              .generator-layout {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 3rem;
                margin-bottom: 3rem;
              }

              /* Form Section */
              .form-section {
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                border: 1px solid #e5e7eb;
              }

              .form-container {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                margin-bottom: 2rem;
              }

              /* Form Fields */
              .form-field {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
              }

              .form-label {
                font-weight: 600;
                font-size: 0.875rem;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 0.25rem;
              }

              .required {
                color: #ef4444;
              }

              .form-input,
              .form-textarea {
                padding: 0.75rem;
                border: 1px solid #d1d5db;
                border-radius: 0.5rem;
                font-size: 1rem;
                transition: border-color 0.2s, box-shadow 0.2s;
              }

              .form-input:focus,
              .form-textarea:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
              }

              .form-textarea {
                resize: vertical;
                min-height: 5rem;
              }

              .form-description {
                font-size: 0.75rem;
                color: #6b7280;
                margin-top: 0.25rem;
              }

              .character-count {
                font-size: 0.75rem;
                color: #9ca3af;
                text-align: right;
                margin-top: 0.25rem;
              }

              /* Preset Buttons */
              .preset-buttons {
                margin-bottom: 1.5rem;
              }

              .preset-buttons h4 {
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #374151;
              }

              .preset-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0.75rem;
              }

              .preset-button {
                padding: 0.75rem 1rem;
                background: #f3f4f6;
                border: 1px solid #d1d5db;
                border-radius: 0.5rem;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.2s;
              }

              .preset-button:hover {
                background: #e5e7eb;
                border-color: #9ca3af;
              }

              /* Action Buttons */
              .form-actions {
                border-top: 1px solid #e5e7eb;
                padding-top: 1.5rem;
              }

              .action-buttons {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
              }

              .reset-button,
              .export-button,
              .import-button {
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid;
              }

              .reset-button {
                background: #fef2f2;
                border-color: #fecaca;
                color: #dc2626;
              }

              .reset-button:hover {
                background: #fee2e2;
                border-color: #fca5a5;
              }

              .export-button {
                background: #eff6ff;
                border-color: #dbeafe;
                color: #2563eb;
              }

              .export-button:hover {
                background: #dbeafe;
                border-color: #93c5fd;
              }

              .import-button {
                background: #f0fdf4;
                border-color: #bbf7d0;
                color: #16a34a;
              }

              .import-button:hover {
                background: #dcfce7;
                border-color: #86efac;
              }

              /* Preview Section */
              .preview-section {
                background: white;
                border-radius: 1rem;
                padding: 2rem;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                border: 1px solid #e5e7eb;
              }

              .preview-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
              }

              .preview-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
              }

              .preview-header h3 {
                font-size: 1.5rem;
                font-weight: 600;
                color: #111827;
              }

              .loading-spinner {
                font-size: 0.875rem;
                color: #3b82f6;
                font-weight: 500;
              }

              .preview-wrapper {
                position: relative;
                background: #f9fafb;
                border: 2px dashed #d1d5db;
                border-radius: 0.75rem;
                min-height: 300px;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .preview-image-container {
                position: relative;
                width: 100%;
                height: auto;
              }

              .preview-image {
                width: 100%;
                height: auto;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                transition: opacity 0.3s;
              }

              .preview-actions {
                display: flex;
                flex-direction: column;
                gap: 1rem;
              }

              .url-display {
                display: flex;
                gap: 0.5rem;
              }

              .url-input {
                flex: 1;
                padding: 0.5rem;
                border: 1px solid #d1d5db;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                background: #f9fafb;
              }

              .copy-button {
                padding: 0.5rem 1rem;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 0.375rem;
                cursor: pointer;
                font-size: 0.875rem;
                transition: background-color 0.2s;
              }

              .copy-button:hover {
                background: #2563eb;
              }

              .open-button,
              .download-button {
                padding: 0.75rem 1rem;
                border-radius: 0.5rem;
                font-size: 0.875rem;
                cursor: pointer;
                transition: all 0.2s;
                text-decoration: none;
                text-align: center;
                display: inline-block;
              }

              .open-button {
                background: #059669;
                color: white;
                border: none;
              }

              .open-button:hover {
                background: #047857;
              }

              .download-button {
                background: #7c3aed;
                color: white;
                border: none;
              }

              .download-button:hover {
                background: #6d28d9;
              }

              /* Footer */
              .generator-footer {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 3rem;
                margin-top: 3rem;
                padding-top: 3rem;
                border-top: 1px solid #e5e7eb;
              }

              .tips,
              .technical-info {
                background: white;
                padding: 2rem;
                border-radius: 1rem;
                box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
              }

              .tips h4,
              .technical-info h4 {
                font-size: 1.125rem;
                font-weight: 600;
                margin-bottom: 1rem;
                color: #111827;
              }

              .tips ul,
              .technical-info ul {
                list-style: none;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
              }

              .tips li,
              .technical-info li {
                position: relative;
                padding-left: 1.5rem;
                color: #4b5563;
                font-size: 0.875rem;
              }

              .tips li::before,
              .technical-info li::before {
                content: '•';
                position: absolute;
                left: 0;
                color: #3b82f6;
                font-weight: bold;
              }

              /* Responsive Design */
              @media (max-width: 1024px) {
                .generator-layout {
                  grid-template-columns: 1fr;
                  gap: 2rem;
                }

                .preview-section {
                  order: -1;
                }

                .generator-footer {
                  grid-template-columns: 1fr;
                  gap: 2rem;
                }

                .preset-grid {
                  grid-template-columns: 1fr;
                }
              }

              @media (max-width: 768px) {
                .og-generator {
                  padding: 1rem;
                }

                .generator-header h1 {
                  font-size: 2rem;
                }

                .generator-header p {
                  font-size: 1rem;
                }

                .form-section,
                .preview-section {
                  padding: 1.5rem;
                }

                .action-buttons {
                  flex-direction: column;
                }

                .action-buttons button,
                .action-buttons a {
                  width: 100%;
                }

                .url-display {
                  flex-direction: column;
                }

                .copy-button {
                  width: 100%;
                }
              }

              @media (max-width: 480px) {
                .og-generator {
                  padding: 0.5rem;
                }

                .generator-header h1 {
                  font-size: 1.5rem;
                }

                .form-section,
                .preview-section,
                .tips,
                .technical-info {
                  padding: 1rem;
                }

                .preset-grid {
                  grid-template-columns: 1fr;
                }
              }

              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }

              .loading-spinner::after {
                content: ' ⟳';
                animation: spin 1s linear infinite;
              }

              button:focus,
              input:focus,
              textarea:focus,
              a:focus {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
              }
            `,
              }}
            />
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
              urlInput.value = window.location.origin + '/og?' + params.toString();
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

// Health check
app.get("/health", (c) => c.text("OK"));
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
