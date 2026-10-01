import { container } from "@takumi-rs/helpers";
import { CARD_SIZES } from "../config";
import { cardContent, cardRoot, type CardTemplate } from "./shared";

export const minimal: CardTemplate = (input, palette) => cardRoot(input, palette.background, [
  container({ style: { position: "absolute", left: 64, top: 64, width: 6, height: CARD_SIZES[input.size].height - 128, backgroundColor: palette.accent } }),
  cardContent(input, palette),
]);
