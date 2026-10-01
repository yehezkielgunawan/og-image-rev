import { container } from "@takumi-rs/helpers";
import { CARD_SIZES } from "../config";
import { cardContent, cardRoot, type CardTemplate } from "./shared";

export const celebratory: CardTemplate = (input, palette) => {
  const { height } = CARD_SIZES[input.size];
  const dots = Array.from({ length: 14 }, (_, index) => container({
    style: {
      position: "absolute", left: 36 + index * 76,
      top: index % 2 === 0 ? 34 + (index % 3) * 10 : height - 64 - (index % 3) * 10,
      width: index % 3 === 0 ? 24 : 14, height: index % 3 === 0 ? 24 : 14,
      borderRadius: index % 3 === 0 ? 0 : 24,
      backgroundColor: index % 2 === 0 ? palette.accent : palette.muted,
      transform: `rotate(${index * 23}deg)`,
    },
  }));
  return cardRoot(input, palette.background, [...dots, cardContent(input, palette, true)]);
};
