import { container, text } from "@takumi-rs/helpers";
import { CARD_SIZES } from "../config";
import type { CardInput, CardPalette } from "../types";

export type CardNode = ReturnType<typeof container>;
export type CardTemplate = (input: CardInput, palette: CardPalette) => CardNode;

// Conservative glyph-width budgeting also handles unbroken words. Never truncate text.
function estimatedLines(value: string, fontSize: number, width: number): number {
  const capacity = Math.max(1, Math.floor(width / (fontSize * 1.15)));
  return value.split("\n").reduce((total, line) => total + Math.max(1, Math.ceil(line.length / capacity)), 0);
}

function fittedText(value: string, width: number, height: number, maxSize: number, color: string, weight: number, centered: boolean) {
  let fontSize = maxSize;
  while (fontSize > 14 && estimatedLines(value, fontSize, width) * fontSize * 1.4 > height) fontSize -= 1;
  return text(value, {
    width, maxWidth: width, fontFamily: "Plus Jakarta Sans", fontSize,
    fontWeight: weight, lineHeight: 1.4, color, textAlign: centered ? "center" : "left",
    whiteSpace: "pre-wrap", overflowWrap: "anywhere", flexShrink: 0,
  });
}

export function cardContent(input: CardInput, palette: CardPalette, centered = false): CardNode {
  const portrait = input.size === "portrait";
  const width = 824;
  return container({
    style: { display: "flex", flexDirection: "column", alignItems: centered ? "center" : "flex-start", gap: portrait ? 34 : 24, width, flexShrink: 0 },
    children: [
      ...(input.recipient ? [fittedText(`FOR ${input.recipient}`, width, 70, 24, palette.muted, 600, centered)] : []),
      fittedText(input.heading, width, portrait ? 250 : 200, 72, palette.ink, 700, centered),
      container({ style: { width: 64, height: 4, backgroundColor: palette.accent, marginTop: 8, marginBottom: 8, flexShrink: 0 } }),
      fittedText(input.message, width, portrait ? 550 : 410, 34, palette.ink, 400, centered),
      ...(input.sender ? [fittedText(`FROM ${input.sender}`, width, 70, 24, palette.muted, 600, centered)] : []),
    ],
  });
}

export function cardRoot(input: CardInput, background: string, children: CardNode[]): CardNode {
  const { width, height } = CARD_SIZES[input.size];
  return container({
    style: { width, height, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: background },
    children,
  });
}
