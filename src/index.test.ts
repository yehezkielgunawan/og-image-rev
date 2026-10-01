import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';

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
  const card = {
    occasion: 'birthday', template: 'minimal', theme: 'warm', size: 'square',
    heading: 'Happy birthday!', recipient: '', message: 'Have a lovely day.', sender: '',
  };

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
