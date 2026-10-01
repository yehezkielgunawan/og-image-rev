import { container } from "@takumi-rs/helpers";
import { CARD_SIZES } from "../config";
import { cardContent, cardRoot, type CardTemplate } from "./shared";

export const elegant: CardTemplate = (input, palette) => {
  const { width, height } = CARD_SIZES[input.size];
  const inverted = { background: palette.ink, ink: palette.background, accent: "#d7bd86", muted: palette.background };
  const frames = [36, 48].map((inset) => container({ style: {
    position: "absolute", left: inset, top: inset, width: width - inset * 2, height: height - inset * 2,
    borderWidth: 1, borderStyle: "solid", borderColor: inverted.accent,
  } }));
  return cardRoot(input, inverted.background, [...frames, cardContent(input, inverted, true)]);
};
