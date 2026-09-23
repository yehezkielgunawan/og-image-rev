import { exports } from "cloudflare:workers";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("Worker runtime", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders a PNG with the real Worker and WASM runtime", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    );

    const response = await exports.default.fetch(
      "https://example.com/og?title=Worker%20smoke",
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect((await response.arrayBuffer()).byteLength).toBeGreaterThan(0);
  });
});
