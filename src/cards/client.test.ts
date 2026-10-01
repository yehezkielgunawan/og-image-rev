import { runInNewContext } from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cardClientScript } from "./client";

function setup() {
  const nodes = new Map<string, ReturnType<typeof node>>();
  function node(value = "") {
    const listeners: Record<string, (event: unknown) => void> = {};
    return {
      value, textContent: "", disabled: true, hidden: true, src: "", href: "", download: "",
      dataset: {}, listeners,
      addEventListener: vi.fn((name: string, fn: (event: unknown) => void) => { listeners[name] = fn; }),
      setAttribute: vi.fn(), removeAttribute: vi.fn(), click: vi.fn(),
    };
  }
  const values = { occasion: "birthday", template: "minimal", theme: "warm", size: "square", heading: "Happy birthday!", recipient: "", message: "A custom message", sender: "" };
  for (const [field, value] of Object.entries(values)) nodes.set(`card-${field}`, node(value));
  for (const id of ["card-form", "card-preview", "card-download", "card-status", "card-error", "card-reset", "card-dimensions", "card-empty"]) nodes.set(id, node());
  for (const field of ["heading", "recipient", "message", "sender"]) nodes.set(`card-${field}-count`, node());
  const fetch = vi.fn();
  const createObjectURL = vi.fn(() => `blob:${createObjectURL.mock.calls.length}`);
  const revokeObjectURL = vi.fn();
  const events: Record<string, () => void> = {};
  const decode = vi.fn(async () => {});
  runInNewContext(cardClientScript, {
    document: { getElementById: (id: string) => nodes.get(id), createElement: () => node() },
    window: { addEventListener: (name: string, fn: () => void) => { events[name] = fn; } },
    fetch, AbortController, URL: { createObjectURL, revokeObjectURL },
    Image: class { src = ""; decode = decode; },
    setTimeout, clearTimeout,
  });
  return { nodes, fetch, createObjectURL, revokeObjectURL, events, decode };
}

const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
const png = () => {
  const blob = new Blob(["png"], { type: "image/png" });
  const response = new Response(blob, { headers: { "Content-Type": "image/png" } });
  // Keep the VM test focused on request ordering, rather than Node's stream scheduling.
  Object.defineProperty(response, "blob", { value: async () => blob });
  return response;
};
afterEach(() => vi.useRealTimers());

describe("card editor behavior", () => {
  it("does not disable download when a settled text field blurs", async () => {
    vi.useFakeTimers();
    const app = setup();
    app.fetch.mockResolvedValue(png());
    await vi.advanceTimersByTimeAsync(0);
    expect(app.nodes.get("card-download")!.disabled).toBe(false);
    app.nodes.get("card-form")!.listeners.change({ target: app.nodes.get("card-message") });
    expect(app.nodes.get("card-download")!.disabled).toBe(false);
    expect(app.fetch).toHaveBeenCalledTimes(1);
  });

  it("ignores superseded responses even when the request does not honor abort", async () => {
    vi.useFakeTimers();
    const app = setup();
    let resolveOld!: (response: Response) => void;
    app.fetch.mockImplementationOnce(() => new Promise<Response>(resolve => { resolveOld = resolve; }));
    await vi.advanceTimersByTimeAsync(0);
    app.fetch.mockResolvedValueOnce(png());
    app.nodes.get("card-heading")!.value = "Latest heading";
    app.nodes.get("card-form")!.listeners.input({ target: app.nodes.get("card-heading") });
    await vi.advanceTimersByTimeAsync(400);
    await flush();
    const current = app.nodes.get("card-preview")!.src;
    expect(current).toMatch(/^blob:/);
    resolveOld(png());
    await flush();
    expect(app.nodes.get("card-preview")!.src).toBe(current);
    expect(app.createObjectURL).toHaveBeenCalledTimes(1);
    expect(app.nodes.get("card-download")!.disabled).toBe(false);
  });

  it("preserves customized wording and names when changing occasion", async () => {
    vi.useFakeTimers();
    const app = setup();
    app.fetch.mockResolvedValue(png());
    app.nodes.get("card-recipient")!.value = "Alex";
    app.nodes.get("card-occasion")!.value = "thank-you";
    app.nodes.get("card-form")!.listeners.change({ target: app.nodes.get("card-occasion") });
    expect(app.nodes.get("card-heading")!.value).toBe("A little note of thanks");
    expect(app.nodes.get("card-message")!.value).toBe("A custom message");
    expect(app.nodes.get("card-recipient")!.value).toBe("Alex");
    await vi.advanceTimersByTimeAsync(400);
  });

  it("keeps the last preview but disables downloading when the new image cannot decode", async () => {
    vi.useFakeTimers();
    const app = setup();
    app.fetch.mockResolvedValue(png());
    await vi.advanceTimersByTimeAsync(0);
    const previous = app.nodes.get("card-preview")!.src;
    app.decode.mockRejectedValueOnce(new Error("bad image"));
    app.nodes.get("card-form")!.listeners.input({ target: app.nodes.get("card-heading") });
    expect(app.nodes.get("card-download")!.disabled).toBe(true);
    await vi.advanceTimersByTimeAsync(400);
    expect(app.nodes.get("card-preview")!.src).toBe(previous);
    expect(app.nodes.get("card-download")!.disabled).toBe(true);
    expect(app.nodes.get("card-error")!.hidden).toBe(false);
    expect(app.revokeObjectURL).toHaveBeenCalledWith("blob:2");
    app.events.pagehide();
    expect(app.revokeObjectURL).toHaveBeenCalledWith(previous);
  });

  it("does not request an invalid card and reports the field error", async () => {
    vi.useFakeTimers();
    const app = setup();
    app.nodes.get("card-heading")!.value = "";
    app.nodes.get("card-form")!.listeners.input({ target: app.nodes.get("card-heading") });
    await vi.advanceTimersByTimeAsync(400);
    expect(app.fetch).not.toHaveBeenCalled();
    expect(app.nodes.get("card-error")!.textContent).toContain("heading");
  });
});
