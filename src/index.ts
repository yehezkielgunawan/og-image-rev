import { Hono } from "hono";
import { initSync, Renderer } from "@takumi-rs/wasm";
import module from "@takumi-rs/wasm/takumi_wasm_bg.wasm";

initSync({ module });
const renderer = new Renderer();

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
