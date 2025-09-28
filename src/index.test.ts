import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';

// Mock WASM module and binary import BEFORE importing the app
vi.mock('@takumi-rs/wasm', () => {
  class MockRenderer {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadFont(_data: Uint8Array) {}
    render = vi.fn(() => new Uint8Array(10));
  }
  return {
    initSync: vi.fn(),
    Renderer: MockRenderer,
  };
});

vi.mock(
  '@takumi-rs/wasm/takumi_wasm_bg.wasm',
  () => ({ default: new ArrayBuffer(8) }),
  { virtual: true },
);

// Mock public assets used at import time
vi.mock(
  'public/fonts/Inter,Plus_Jakarta_Sans/Plus_Jakarta_Sans/PlusJakartaSans-VariableFont_wght.ttf',
  () => ({ default: new ArrayBuffer(16) }),
  { virtual: true },
);
vi.mock('public/favicon.ico', () => ({ default: new Uint8Array([0, 1, 2, 3]) }), {
  virtual: true,
});
vi.mock('public/yehez-icon.svg', () => ({ default: new TextEncoder().encode('<svg/>') }), {
  virtual: true,
});

// Import the app after mocks
let app: any;
beforeAll(async () => {
  const mod = await import('./index.tsx');
  app = mod.default;
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('routes', () => {
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

  it('GET / returns HTML with generator content', async () => {
    const res = await app.request('/');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type') || '').toContain('text/html');
    const html = await res.text();
    expect(html).toContain('OG Image Generator');
    expect(html).toMatch(/<link\s+rel="stylesheet"\s+href="\/styles\.css"/);
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
});
