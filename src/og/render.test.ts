import { describe, expect, it, vi } from "vitest";
import type { Renderer } from "@takumi-rs/wasm";
import { OG_DEFAULTS } from "./config";
import { renderOgImage } from "./render";

describe("renderOgImage", () => {
  it("awaits the current renderer API and passes the registered font", async () => {
    const render = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]));
    const renderer = { render } as unknown as Renderer;
    const font = new Uint8Array([4, 5, 6]);

    const result = await renderOgImage(
      OG_DEFAULTS,
      {
        contentType: "image/png",
        data: new Uint8Array([7, 8, 9]),
        url: OG_DEFAULTS.image,
      },
      renderer,
      font,
    );

    expect(result).toEqual(new Uint8Array([1, 2, 3]));
    expect(render).toHaveBeenCalledWith(
      expect.objectContaining({ type: "container" }),
      expect.objectContaining({
        format: "png",
        height: 630,
        width: 1200,
        fonts: [{ name: "Plus Jakarta Sans", data: font }],
      }),
    );
  });
});
