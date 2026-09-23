import { describe, expect, it, vi } from "vitest";
import { fetchImage, parseImageUrl } from "./image";

function imageResponse(
  body: number[],
  headers: Record<string, string> = { "content-type": "image/png" },
) {
  return new Response(new Uint8Array(body).buffer as ArrayBuffer, {
    status: 200,
    headers,
  });
}

describe("fetchImage", () => {
  it.each([
    "https://[::ffff:7f00:1]/avatar.png",
    "https://localhost./avatar.png",
  ])("rejects private host variants: %s", (url) => {
    expect(parseImageUrl(url)).toBeNull();
  });

  it("returns bounded image bytes for a supported response", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(imageResponse([1, 2, 3]));

    const result = await fetchImage("https://example.com/avatar.png", {
      fetchImpl,
    });

    expect(result).toEqual({
      contentType: "image/png",
      data: new Uint8Array([1, 2, 3]),
      url: "https://example.com/avatar.png",
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://example.com/avatar.png",
      expect.objectContaining({ redirect: "manual" }),
    );
  });

  it("rejects a response whose declared length exceeds the byte limit", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      imageResponse([1], {
        "content-type": "image/png",
        "content-length": "11",
      }),
    );

    const result = await fetchImage("https://example.com/avatar.png", {
      fetchImpl,
      maxBytes: 10,
    });

    expect(result).toBeNull();
  });

  it("rejects a streamed body that exceeds the byte limit", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(imageResponse([1, 2, 3, 4]));

    const result = await fetchImage("https://example.com/avatar.png", {
      fetchImpl,
      maxBytes: 3,
    });

    expect(result).toBeNull();
  });

  it("rejects unsupported media types and unsafe redirects", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(null, {
        status: 302,
        headers: { location: "http://example.com/avatar.png" },
      }),
    );

    const result = await fetchImage("https://example.com/avatar.png", {
      fetchImpl,
    });

    expect(result).toBeNull();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("rejects unsupported image content types", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      imageResponse([1], { "content-type": "text/html" }),
    );

    const result = await fetchImage("https://example.com/avatar.png", {
      fetchImpl,
    });

    expect(result).toBeNull();
  });
});
