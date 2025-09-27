import { Hono } from "hono";
import { FC } from "hono/jsx";
import { initSync, Renderer } from "@takumi-rs/wasm";
import module from "@takumi-rs/wasm/takumi_wasm_bg.wasm";
import {
  container,
  text,
  image as imgNode,
  percentage,
} from "@takumi-rs/helpers";
import { OGImageEditor } from "./components/OGImageEditor";

// Initialize Takumi WASM
initSync({ module });

// Initialize a single renderer instance for the worker
const renderer = new Renderer();

// Load Plus Jakarta Sans variable font (single file to avoid glyph mixing)
import plusJakartaVar from "public/fonts/Inter,Plus_Jakarta_Sans/Plus_Jakarta_Sans/PlusJakartaSans-VariableFont_wght.ttf";
import faviconIco from "public/favicon.ico";

renderer.loadFont(new Uint8Array(plusJakartaVar as ArrayBuffer));

const app = new Hono();

// Home/Landing page
app.get("/", (c) => {
  const origin = new URL(c.req.url).origin;
  return c.html(
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OG Image Generator - Create Beautiful Open Graph Images</title>
        <meta
          name="description"
          content="Generate custom Open Graph images with real-time preview. Perfect for social media sharing on Twitter, Facebook, LinkedIn and more."
        />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }

          .landing-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            text-align: center;
            color: white;
          }

          .hero-section {
            padding: 4rem 0;
          }

          .hero-title {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          }

          .hero-subtitle {
            font-size: 1.3rem;
            margin-bottom: 3rem;
            opacity: 0.9;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }

          .cta-buttons {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-bottom: 4rem;
          }

          .btn {
            padding: 1rem 2rem;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .btn-primary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
          }

          .btn-primary:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }

          .btn-secondary {
            background: white;
            color: #667eea;
            border: 2px solid white;
          }

          .btn-secondary:hover {
            background: transparent;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 4rem;
          }

          .feature-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            padding: 2rem;
            transition: transform 0.3s ease;
          }

          .feature-card:hover {
            transform: translateY(-5px);
            background: rgba(255, 255, 255, 0.15);
          }

          .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }

          .feature-title {
            font-size: 1.4rem;
            font-weight: 700;
            margin-bottom: 1rem;
          }

          .feature-description {
            opacity: 0.9;
          }

          .api-section {
            margin-top: 4rem;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            text-align: left;
          }

          .api-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-align: center;
          }

          .api-example {
            background: rgba(0, 0, 0, 0.3);
            padding: 1.5rem;
            border-radius: 8px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            margin: 1rem 0;
          }

          .api-params {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .param-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #fff;
          }

          .param-name {
            font-weight: 700;
            margin-bottom: 0.5rem;
          }

          .param-desc {
            opacity: 0.9;
            font-size: 0.9rem;
          }

          @media (max-width: 768px) {
            .landing-container {
              padding: 1rem;
            }

            .hero-title {
              font-size: 2.5rem;
            }

            .hero-subtitle {
              font-size: 1.1rem;
            }

            .cta-buttons {
              flex-direction: column;
              align-items: center;
            }

            .btn {
              width: 100%;
              max-width: 300px;
            }

            .features-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </head>
      <body>
        <div class="landing-container">
          <div class="hero-section">
            <h1 class="hero-title">OG Image Generator</h1>
            <p class="hero-subtitle">
              Create beautiful Open Graph images for your website, blog posts,
              and social media. Generate custom images with real-time preview
              and perfect dimensions for all platforms.
            </p>

            <div class="cta-buttons">
              <a href="/editor" class="btn btn-primary">
                Start Creating
              </a>
              <a href="#api" class="btn btn-secondary">
                API Documentation
              </a>
            </div>
          </div>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🎨</div>
              <h3 class="feature-title">Real-time Preview</h3>
              <p class="feature-description">
                See your changes instantly with our 500ms debounced preview
                system. No waiting, no guessing - just perfect results.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3 class="feature-title">Responsive Design</h3>
              <p class="feature-description">
                Works perfectly on all devices. Mobile, tablet, or desktop -
                create stunning OG images anywhere, anytime.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h3 class="feature-title">Blazing Fast</h3>
              <p class="feature-description">
                Powered by Cloudflare Workers and Hono framework. Generate
                images at lightning speed with global edge distribution.
              </p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🔧</div>
              <h3 class="feature-title">API Ready</h3>
              <p class="feature-description">
                Simple REST API for integration into your applications. Perfect
                for automated workflows and dynamic content.
              </p>
            </div>
          </div>

          <div id="api" class="api-section">
            <h2 class="api-title">API Usage</h2>
            <p style="text-align: center; margin-bottom: 2rem; opacity: 0.9;">
              Generate OG images programmatically with our simple REST API
            </p>

            <div class="api-example">
              GET {origin}
              /og?title=Your+Title&description=Your+Description&siteName=yoursite.com&social=@yourhandle&image=https://yourimage.jpg
            </div>

            <div class="api-params">
              <div class="param-item">
                <div class="param-name">title</div>
                <div class="param-desc">Main heading for your image</div>
              </div>
              <div class="param-item">
                <div class="param-name">description</div>
                <div class="param-desc">Subtitle or description text</div>
              </div>
              <div class="param-item">
                <div class="param-name">siteName</div>
                <div class="param-desc">Your website or brand name</div>
              </div>
              <div class="param-item">
                <div class="param-name">social</div>
                <div class="param-desc">Social media handle or contact</div>
              </div>
              <div class="param-item">
                <div class="param-name">image</div>
                <div class="param-desc">Profile or brand image URL</div>
              </div>
            </div>

            <div style="text-align: center; margin-top: 2rem;">
              <a href="/editor" class="btn btn-primary">
                Try the Editor
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>,
  );
});

// Editor route with custom parameters
app.get("/editor", (c) => {
  const origin = new URL(c.req.url).origin;
  const initialValues = {
    title: c.req.query("title") || "",
    description: c.req.query("description") || "",
    siteName: c.req.query("siteName") || "",
    social: c.req.query("social") || "",
    image: c.req.query("image") || "",
  };

  return c.html(
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OG Image Editor</title>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
          }

          .og-editor {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .editor-header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 2rem;
            text-align: center;
          }

          .editor-header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 700;
          }

          .editor-subtitle {
            font-size: 1.1rem;
            opacity: 0.9;
          }

          .editor-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            padding: 2rem;
          }

          .editor-form-section h2 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #2c3e50;
          }

          .og-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-field {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .form-label {
            font-weight: 600;
            color: #2c3e50;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .required {
            color: #e74c3c;
            margin-left: 2px;
          }

          .form-input {
            padding: 0.75rem 1rem;
            border: 2px solid #ecf0f1;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: #fafafa;
          }

          .form-input:focus {
            outline: none;
            border-color: #3498db;
            background: white;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
          }

          .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
          }

          .btn-primary, .btn-secondary {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .btn-primary {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
          }

          .btn-secondary {
            background: #ecf0f1;
            color: #2c3e50;
          }

          .btn-secondary:hover {
            background: #d5dbdb;
            transform: translateY(-2px);
          }

          .preview-panel {
            position: sticky;
            top: 2rem;
          }

          .preview-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #2c3e50;
          }

          .preview-container {
            position: relative;
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1rem;
          }

          .preview-image {
            width: 100%;
            height: auto;
            border-radius: 8px;
            transition: opacity 0.3s ease;
            display: block;
          }

          .preview-image.loading {
            opacity: 0.5;
          }

          .preview-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 10;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #ecf0f1;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .preview-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            font-size: 0.9rem;
          }

          .preview-dimensions {
            color: #6c757d;
            font-weight: 500;
          }

          .preview-link {
            color: #3498db;
            text-decoration: none;
            font-weight: 600;
          }

          .preview-link:hover {
            text-decoration: underline;
          }

          .usage-example {
            margin-top: 2rem;
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 8px;
          }

          .usage-example h4 {
            margin-bottom: 1rem;
            color: #2c3e50;
          }

          .code-block {
            position: relative;
            background: #2c3e50;
            color: #ecf0f1;
            padding: 1rem;
            border-radius: 8px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 0.85rem;
            overflow-x: auto;
          }

          .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            padding: 0.25rem 0.5rem;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 0.75rem;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.3s ease;
          }

          .copy-btn:hover {
            opacity: 1;
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            body {
              padding: 10px;
            }

            .editor-header {
              padding: 1.5rem 1rem;
            }

            .editor-header h1 {
              font-size: 2rem;
            }

            .editor-container {
              grid-template-columns: 1fr;
              gap: 1.5rem;
              padding: 1.5rem;
            }

            .form-actions {
              flex-direction: column;
            }

            .preview-panel {
              position: static;
            }

            .usage-example {
              margin-top: 1rem;
            }

            .code-block {
              font-size: 0.75rem;
            }
          }

          /* Tablet */
          @media (max-width: 1024px) and (min-width: 769px) {
            .editor-container {
              gap: 1.5rem;
            }

            .editor-header h1 {
              font-size: 2.2rem;
            }
          }

          /* Toast notification */
          .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
          }

          .toast.show {
            transform: translateX(0);
          }

          .toast.error {
            background: #e74c3c;
          }
        `}</style>
      </head>
      <body>
        <OGImageEditor initialValues={initialValues} origin={origin} />
        <script>{`
          // Debounced preview update function
          let debounceTimer;
          const DEBOUNCE_DELAY = 500;

          function debounce(func, delay) {
            return function(...args) {
              clearTimeout(debounceTimer);
              debounceTimer = setTimeout(() => func.apply(this, args), delay);
            };
          }

          // Update preview image
          function updatePreview() {
            const form = document.getElementById('og-form');
            const params = new URLSearchParams();

            // Get all form values
            const inputs = form.querySelectorAll('input[data-field]');
            inputs.forEach(input => {
              const value = input.value.trim();
              if (value) {
                params.set(input.dataset.field, value);
              }
            });

            const previewUrl = '/og?' + params.toString();
            const previewImage = document.getElementById('preview-image');
            const previewLink = document.getElementById('preview-link');
            const previewContainer = document.querySelector('.preview-container');
            const usageCode = document.getElementById('usage-code');

            // Show loading state
            previewImage.classList.add('loading');
            let loadingDiv = previewContainer.querySelector('.preview-loading');
            if (!loadingDiv) {
              loadingDiv = document.createElement('div');
              loadingDiv.className = 'preview-loading';
              loadingDiv.innerHTML = '<div class="loading-spinner"></div><p>Generating preview...</p>';
              previewContainer.appendChild(loadingDiv);
            }

            // Update image src
            const newImage = new Image();
            newImage.onload = function() {
              previewImage.src = previewUrl;
              previewImage.classList.remove('loading');
              previewLink.href = previewUrl;
              if (loadingDiv) loadingDiv.remove();

              // Update usage code
              const origin = window.location.origin;
              usageCode.textContent = '<meta property="og:image" content="' + origin + previewUrl + '" />\\n<meta name="twitter:image" content="' + origin + previewUrl + '" />';
            };
            newImage.onerror = function() {
              previewImage.classList.remove('loading');
              if (loadingDiv) loadingDiv.remove();
              showToast('Failed to generate preview', 'error');
            };
            newImage.src = previewUrl;
          }

          // Debounced preview update
          const debouncedUpdatePreview = debounce(updatePreview, DEBOUNCE_DELAY);

          // Toast notification
          function showToast(message, type = 'success') {
            const existingToast = document.querySelector('.toast');
            if (existingToast) {
              document.body.removeChild(existingToast);
            }

            const toast = document.createElement('div');
            toast.className = 'toast' + (type === 'error' ? ' error' : '');
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => toast.classList.add('show'), 100);
            setTimeout(() => {
              toast.classList.remove('show');
              setTimeout(() => {
                if (document.body.contains(toast)) {
                  document.body.removeChild(toast);
                }
              }, 300);
            }, 3000);
          }

          // Copy to clipboard
          async function copyToClipboard(text) {
            try {
              await navigator.clipboard.writeText(text);
              showToast('Copied to clipboard!');
            } catch (err) {
              // Fallback for older browsers
              const textArea = document.createElement('textarea');
              textArea.value = text;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
              showToast('Copied to clipboard!');
            }
          }

          // Initialize event listeners
          document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('og-form');
            const inputs = form.querySelectorAll('input[data-field]');
            const resetBtn = document.getElementById('reset-btn');
            const copyUrlBtn = document.getElementById('copy-url-btn');
            const copyCodeBtn = document.getElementById('copy-code-btn');

            // Add input listeners for debounced preview updates
            inputs.forEach(input => {
              input.addEventListener('input', debouncedUpdatePreview);
              input.addEventListener('paste', () => {
                setTimeout(debouncedUpdatePreview, 100);
              });
            });

            // Reset button
            resetBtn.addEventListener('click', function() {
              inputs.forEach(input => {
                const defaultValues = {
                  title: 'Your Amazing Title Here',
                  description: 'This is a compelling description that will appear on your OG image.',
                  siteName: 'yehezgun.com',
                  social: 'Twitter: @yehezgun',
                  image: 'https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png'
                };
                input.value = defaultValues[input.dataset.field] || '';
              });
              debouncedUpdatePreview();
              showToast('Reset to default values');
            });

            // Copy URL button
            copyUrlBtn.addEventListener('click', function() {
              const previewLink = document.getElementById('preview-link');
              const fullUrl = window.location.origin + previewLink.getAttribute('href');
              copyToClipboard(fullUrl);
            });

            // Copy code button
            copyCodeBtn.addEventListener('click', function() {
              const usageCode = document.getElementById('usage-code');
              copyToClipboard(usageCode.textContent);
            });

            // Initial preview update
            updatePreview();
          });
        `}</script>
      </body>
    </html>,
  );
});

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
