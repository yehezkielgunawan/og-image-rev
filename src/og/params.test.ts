import { describe, expect, it } from "vitest";
import { OG_DEFAULTS, parseOgParams } from "./params";

describe("parseOgParams", () => {
  it("returns canonical defaults when optional values are absent", () => {
    const result = parseOgParams(new URLSearchParams());

    expect(result).toEqual({ ok: true, value: OG_DEFAULTS });
  });

  it("trims accepted values while preserving the CTA field", () => {
    const result = parseOgParams(
      new URLSearchParams({
        title: "  Hello  ",
        description: " World ",
        siteName: " Example ",
        social: " @example ",
        cta: " Read more ",
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        ...OG_DEFAULTS,
        title: "Hello",
        description: "World",
        siteName: "Example",
        social: "@example",
        cta: "Read more",
      },
    });
  });

  it("rejects text values that exceed their server-side limits", () => {
    const result = parseOgParams(
      new URLSearchParams({ title: "x".repeat(101) }),
    );

    expect(result.ok).toBe(false);
  });

  it("rejects image URLs that are not bounded HTTPS URLs", () => {
    const result = parseOgParams(
      new URLSearchParams({ image: "http://example.com/avatar.png" }),
    );

    expect(result.ok).toBe(false);
  });
});
