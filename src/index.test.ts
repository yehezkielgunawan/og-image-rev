import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { runInNewContext } from 'node:vm';

const { renderMock } = vi.hoisted(() => ({
  renderMock: vi.fn(async () => new Uint8Array(10)),
}));

// Mock WASM module BEFORE importing the app
// Virtual modules (wasm, fonts, assets) are aliased in vitest.config.ts
vi.mock('@takumi-rs/wasm', () => {
  class MockRenderer {
    render = renderMock;
  }
  return {
    initSync: vi.fn(),
    Renderer: MockRenderer,
  };
});

// Import the app after mocks
let app: any;
beforeAll(async () => {
  const mod = await import('./index');
  app = mod.default;
});

afterEach(() => {
  vi.clearAllMocks();
  renderMock.mockResolvedValue(new Uint8Array(10));
  vi.unstubAllGlobals();
});

describe('routes', () => {
  it('serves an installable studio manifest and links it from both editors', async () => {
    const res = await app.request('/manifest.webmanifest');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/manifest+json');
    const manifest = await res.json();
    expect(manifest).toMatchObject({ name: 'Yehez Image Studio', id: '/', start_url: '/', scope: '/', display: 'standalone' });
    expect(manifest.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ sizes: '192x192', type: 'image/png' }),
      expect.objectContaining({ sizes: '512x512', purpose: 'maskable' }),
    ]));
    for (const path of ['/', '/cards']) {
      const html = await (await app.request(path)).text();
      expect(html).toContain('rel="manifest" href="/manifest.webmanifest"');
      expect(html).toContain('src="/icon.svg"');
      expect(html).toContain('register("/sw.js"');
      expect(html).toContain('href="/icons/apple-touch-icon.png"');
    }
  });

  it('serves a self-contained offline page with a retry link', async () => {
    const res = await app.request('/offline');
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('You’re offline');
    expect(html).toContain('href="/"');
    expect(html).toContain('<svg');
    expect(html).not.toContain('/styles.css');
    expect(html).not.toContain('<script');
  });

  it('runs the service worker with offline navigation fallback and isolated cache cleanup', async () => {
    const res = await app.request('/sw.js');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('javascript');
    expect(res.headers.get('cache-control')).toBe('no-cache');
    const handlers: Record<string, (event: any) => void> = {};
    const cache = { addAll: vi.fn().mockResolvedValue(undefined), match: vi.fn(async () => new Response('offline')) };
    const caches = {
      open: vi.fn(async () => cache),
      keys: vi.fn(async () => ['yehez-studio-pwa-old', 'other-app']),
      delete: vi.fn().mockResolvedValue(true),
    };
    const fetch = vi.fn(async () => new Response('online'));
    runInNewContext(await res.text(), {
      self: { location: { origin: 'https://studio.test' }, addEventListener: (type: string, handler: typeof handlers[string]) => { handlers[type] = handler; } },
      caches, fetch, URL, Response,
    });
    let pending: Promise<unknown> = Promise.resolve();
    const waitUntil = (promise: Promise<unknown>) => { pending = promise; };
    handlers.install({ waitUntil });
    await pending;
    expect(cache.addAll).toHaveBeenCalledWith(expect.arrayContaining(['/offline', '/icon.svg']));
    expect(cache.addAll.mock.calls[0][0]).not.toContain('/');
    expect(cache.addAll.mock.calls[0][0]).not.toContain('/cards');
    handlers.activate({ waitUntil });
    await pending;
    expect(caches.delete).toHaveBeenCalledWith('yehez-studio-pwa-old');
    expect(caches.delete).not.toHaveBeenCalledWith('other-app');
    const respondWith = vi.fn((promise) => { pending = promise; });
    const request = { url: 'https://studio.test/cards', method: 'GET', mode: 'navigate' };
    handlers.fetch({ request, respondWith });
    expect(await (await pending as Response).text()).toBe('online');
    fetch.mockRejectedValueOnce(new TypeError('offline'));
    handlers.fetch({ request, respondWith });
    expect(await (await pending as Response).text()).toBe('offline');
    expect(cache.match).toHaveBeenCalledWith('/offline');
    for (const bypass of [
      { ...request, url: 'https://studio.test/og?title=private' },
      { ...request, url: 'https://studio.test/cards/render', method: 'POST' },
      { ...request, url: 'https://elsewhere.test/' },
      { ...request, mode: 'cors' },
    ]) {
      respondWith.mockClear();
      handlers.fetch({ request: bypass, respondWith });
      expect(respondWith).not.toHaveBeenCalled();
    }
  });

  const card = {
    occasion: 'birthday', template: 'minimal', theme: 'warm', size: 'square',
    heading: 'Happy birthday!', recipient: '', message: 'Have a lovely day.', sender: '',
  };

  it('serves the greeting editor with its own metadata, controls, and active navigation', async () => {
    const res = await app.request('/cards');
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Greeting Card Studio');
    expect(html).toContain('id="card-form"');
    expect(html).toContain('id="card-message"');
    expect(html).toContain('maxlength="400"');
    expect(html).toContain('Portrait');
    expect(html).toContain('Celebratory');
    expect(html).toContain('Elegant');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('workers.dev/cards');
    expect(html).toContain('Download PNG');
  });

  it('links the existing OG generator to greeting cards', async () => {
    const html = await (await app.request('/')).text();
    expect(html).toContain('href="/cards"');
  });

  it('POST /cards/render returns a private PNG without fetching external assets', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = await app.request('/cards/render', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(card),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect((await res.arrayBuffer()).byteLength).toBeGreaterThan(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ['bad JSON', '{', 'application/json', 400],
    ['wrong content type', JSON.stringify(card), 'text/plain', 415],
    ['oversized body', ' '.repeat(16385), 'application/json', 413],
    ['invalid field', JSON.stringify({ ...card, template: 'unknown' }), 'application/json', 400],
  ])('POST /cards/render rejects %s', async (_label, body, contentType, status) => {
    const res = await app.request('/cards/render', {
      method: 'POST', headers: { 'Content-Type': String(contentType) }, body: String(body),
    });
    expect(res.status).toBe(status);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.json()).toHaveProperty('error');
    expect(renderMock).not.toHaveBeenCalled();
  });

  it('enforces actual streamed bytes even if Content-Length understates the size', async () => {
    const res = await app.request('/cards/render', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': '1' },
      body: ' '.repeat(16385),
    });
    expect(res.status).toBe(413);
    expect(renderMock).not.toHaveBeenCalled();
  });

  it('returns a stable card render error without logging card content', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderMock.mockRejectedValueOnce(new Error('personal content'));
    try {
      const res = await app.request('/cards/render', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(card),
      });
      expect(res.status).toBe(500);
      expect(await res.json()).toEqual({ error: 'Unable to render card. Please try again.' });
      expect(JSON.stringify(log.mock.calls)).not.toContain('personal content');
    } finally { log.mockRestore(); }
  });

  it('GET /health returns OK', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('OK');
    expect(res.headers.get('content-type') || '').toContain('text/plain');
  });

  it('GET /styles.css returns CSS', async () => {
    const res = await app.request('/styles.css');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type') || '').toContain('text/css');
    const body = await res.text();
    expect(body).toContain('.og-generator');
  });

  it('GET / returns HTML with generator content and inline script', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type') || '').toContain('text/html');
    const html = await res.text();
    expect(html).toContain('OG Image Generator');
    expect(html).toMatch(/<link\s+rel="stylesheet"\s+href="\/styles\.css"/);
    // Check for inline script with form field IDs
    expect(html).toContain('FORM_FIELD_IDS');
    expect(html).toContain('updatePreview');
    expect(html).not.toContain('Date.now()');
    expect(html).not.toContain("&t=");
  });

  it('GET /favicon.ico returns icon bytes', async () => {
    const res = await app.request('/favicon.ico');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type') || '').toContain('image/x-icon');
    const buf = new Uint8Array(await res.arrayBuffer());
    expect(buf.byteLength).toBeGreaterThan(0);
  });

  it('GET /icon.svg returns SVG bytes', async () => {
    const res = await app.request('/icon.svg');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type') || '').toContain('image/svg+xml');
    const txt = await res.text();
    expect(txt).toContain('<svg');
  });

  it('GET /og produces a PNG when image fetch succeeds', async () => {
    // Mock global fetch to return a small PNG-like payload
    const payload = new Uint8Array([1, 2, 3, 4]).buffer;
    const response = new Response(payload, {
      status: 200,
      headers: { 'Content-Type': 'image/png' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    const res = await app.request(
      '/og?title=Hello&description=World&siteName=example.com&social=@handle&image=https://example.com/a.png',
    );

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
    const data = new Uint8Array(await res.arrayBuffer());
    expect(data.byteLength).toBeGreaterThan(0);
  });

  it('GET /og still renders when image fetch fails', async () => {
    const badResponse = new Response(null, { status: 404 });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(badResponse));

    const res = await app.request('/og');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
    const data = new Uint8Array(await res.arrayBuffer());
    expect(data.byteLength).toBeGreaterThan(0);
  });

  it('GET /og rejects oversized text before fetching an image', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = await app.request(`/og?title=${'x'.repeat(101)}`);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: 'title exceeds the maximum length',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('GET /og rejects an unsafe image URL before fetching it', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = await app.request('/og?image=http://example.com/avatar.png');

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: 'image must be a valid HTTPS image URL',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('GET /og returns a stable error when rendering fails', async () => {
    renderMock.mockRejectedValueOnce(new Error('render failed'));
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(new Uint8Array([1, 2, 3]), {
          status: 200,
          headers: { 'Content-Type': 'image/png' },
        }),
      ),
    );

    const res = await app.request('/og');

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Unable to render image' });
    expect(res.headers.get('cache-control')).toBe('no-store');
  });
});
