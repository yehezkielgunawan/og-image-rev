import { describe, expect, it, vi } from "vitest";
import { renderCardImage, buildCardNode } from "./render";
import type { CardInput } from "./types";

const input: CardInput = {
  occasion: "birthday", template: "minimal", theme: "warm", size: "square",
  heading: "Happy birthday!", recipient: "Alex", message: "One line\nAnother line", sender: "Sam",
};

describe("card rendering", () => {
  it.each(["minimal", "celebratory", "elegant"] as const)("renders %s in both dimensions", async (template) => {
    for (const size of ["square", "portrait"] as const) {
      const render = vi.fn(async () => new Uint8Array([1, 2, 3]));
      const png = await renderCardImage({ ...input, template, size }, { render }, new Uint8Array([0]));
      expect(png).toEqual(new Uint8Array([1, 2, 3]));
      expect(render).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        width: 1080, height: size === "square" ? 1080 : 1350, format: "png",
      }));
      const tree = JSON.stringify(render.mock.calls[0]);
      expect(tree).toContain("Happy birthday!");
      expect(tree).toContain("Another line");
      expect(tree).toContain("Alex");
      expect(tree).toContain("Sam");
      expect(tree).not.toContain("ellipsis");
    }
  });

  it("omits name labels when optional names are blank", () => {
    const tree = JSON.stringify(buildCardNode({ ...input, recipient: "", sender: "" }));
    expect(tree).not.toContain("FOR ");
    expect(tree).not.toContain("FROM ");
  });

  it("retains the entire maximum-length message and uses a smaller text layout", () => {
    const message = "W".repeat(400);
    const tree = JSON.stringify(buildCardNode({ ...input, message }));
    expect(tree).toContain(message);
    expect(tree).not.toContain("lineClamp");
  });
});
