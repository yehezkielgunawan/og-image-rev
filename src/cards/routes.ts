import { Hono } from "hono";
import { CARD_MAX_BODY_BYTES } from "./config";
import { parseCardInput } from "./params";
import type { CardInput } from "./types";

async function readCardBody(request: Request): Promise<string | null> {
  const declaredLength = Number(request.headers.get("content-length"));
  if (declaredLength > CARD_MAX_BODY_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > CARD_MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
    return body + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

export function createCardRoutes(render: (input: CardInput) => Promise<Uint8Array>) {
  const routes = new Hono();
  routes.post("/render", async (c) => {
    c.header("Cache-Control", "no-store");
    const contentType = c.req.header("content-type")?.split(";", 1)[0].trim().toLowerCase();
    if (contentType !== "application/json") {
      return c.json({ error: "Send your card as application/json" }, 415);
    }
    let input: unknown;
    try {
      const body = await readCardBody(c.req.raw);
      if (body === null) return c.json({ error: "Card request exceeds 16 KB" }, 413);
      input = JSON.parse(body);
    } catch {
      return c.json({ error: "Invalid JSON card request" }, 400);
    }
    const parsed = parseCardInput(input);
    if (!parsed.ok) return c.json({ error: parsed.error, field: parsed.field }, 400);
    try {
      const png = await render(parsed.value);
      // Copy WASM-owned bytes into a response-owned buffer.
      const body = new Uint8Array(png.byteLength);
      body.set(png);
      return new Response(body, {
        headers: {
          "Content-Type": "image/png", "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff", "Content-Length": String(body.byteLength),
        },
      });
    } catch {
      console.error(JSON.stringify({ message: "card image render failed", template: parsed.value.template, size: parsed.value.size }));
      return c.json({ error: "Unable to render card. Please try again." }, 500);
    }
  });
  return routes;
}
