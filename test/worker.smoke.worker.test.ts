import { exports } from "cloudflare:workers";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("Worker runtime", () => {
  it.each(["minimal", "celebratory", "elegant"])("renders %s cards with real WASM at both sizes", async (template) => {
    for (const [size, height] of [["square", 1080], ["portrait", 1350]] as const) {
      const response = await exports.default.fetch("https://example.com/cards/render", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion: "birthday", template, theme: "warm", size,
          heading: "Happy birthday, José!", recipient: "Zoë", message: "W".repeat(400), sender: "Renée",
        }),
      });
      expect(response.status).toBe(200);
      const png = new Uint8Array(await response.arrayBuffer());
      expect(Array.from(png.slice(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
      const header = new DataView(png.buffer, png.byteOffset, png.byteLength);
      expect(header.getUint32(16)).toBe(1080);
      expect(header.getUint32(20)).toBe(height);
    }
  });

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
