import { Hono } from "hono";
import { html } from "hono/html";
import logo from "public/studio-logo.svg";
import icon192 from "public/icons/icon-192.png";
import icon512 from "public/icons/icon-512.png";
import maskable from "public/icons/icon-maskable-512.png";
import apple from "public/icons/apple-touch-icon.png";
import { OfflinePage } from "../components/OfflinePage";
import { serviceWorkerScript } from "./service-worker";

export function createPwaRoutes() {
  const app = new Hono();
  app.get("/manifest.webmanifest", () => new Response(JSON.stringify({
    id: "/", name: "Yehez Image Studio", short_name: "Image Studio",
    description: "Create Open Graph images and personalized greeting cards.",
    lang: "en", start_url: "/", scope: "/", display: "standalone",
    theme_color: "#0f172a", background_color: "#0f172a",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [{ name: "Open Graph Generator", url: "/" }, { name: "Greeting Card Studio", url: "/cards" }],
  }), { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "no-cache" } }));
  app.get("/sw.js", () => new Response(serviceWorkerScript, {
    headers: { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-cache", "X-Content-Type-Options": "nosniff" },
  }));
  app.get("/offline", (c) => c.html(html`<!DOCTYPE html>${<OfflinePage logo={new TextDecoder().decode(logo)} />}`));
  for (const [path, bytes] of [
    ["/icons/icon-192.png", icon192], ["/icons/icon-512.png", icon512],
    ["/icons/icon-maskable-512.png", maskable], ["/icons/apple-touch-icon.png", apple],
  ] as const) {
    app.get(path, () => new Response(bytes, {
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    }));
  }
  return app;
}
