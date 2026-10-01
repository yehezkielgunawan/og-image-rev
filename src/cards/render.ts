import type { Renderer } from "@takumi-rs/wasm";
import { CARD_PALETTES, CARD_SIZES } from "./config";
import { cardTemplates } from "./templates";
import type { CardInput } from "./types";

export function buildCardNode(input: CardInput) {
  return cardTemplates[input.template](input, CARD_PALETTES[input.theme]);
}

export async function renderCardImage(input: CardInput, renderer: Pick<Renderer, "render">, font: Uint8Array): Promise<Uint8Array> {
  const { width, height } = CARD_SIZES[input.size];
  return renderer.render(buildCardNode(input), {
    width, height, format: "png", fonts: [{ name: "Plus Jakarta Sans", data: font }],
  });
}
