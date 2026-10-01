// Browser script, served verbatim rather than executed in the Cloudflare Worker.
// Bump the version when changing the offline page or precached branding assets.
export const serviceWorkerScript = `
const CACHE_PREFIX = "yehez-studio-pwa-";
const CACHE_NAME = CACHE_PREFIX + "v1";
const ASSETS = ["/offline", "/icon.svg", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/icon-maskable-512.png", "/icons/apple-touch-icon.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key))
  )));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  // Restrict interception to UI navigation: image/API responses must never
  // receive an HTML fallback, even when opened directly in a browser tab.
  if (request.mode !== "navigate" || !["/", "/cards", "/offline"].includes(url.pathname)) return;
  event.respondWith(fetch(request).catch(async () => {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match("/offline")) || new Response(
      "You're offline. Connect to the internet to create and download images.",
      { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }));
});
`;
