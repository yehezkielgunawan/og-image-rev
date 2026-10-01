import type { CardInput, CardPalette } from "./types";

export const CARD_OCCASIONS = {
  birthday: { label: "Birthday", heading: "Happy birthday!", message: "Here's to another year of little joys, big adventures, and all the things that make you smile." },
  "thank-you": { label: "Thank you", heading: "A little note of thanks", message: "Your kindness made a difference. Thank you for being there, and for being you." },
  congratulations: { label: "Congratulations", heading: "Look at you go!", message: "You worked for this, and it shows. Celebrating you and everything that's still to come." },
  general: { label: "Just because", heading: "Thinking of you", message: "No special occasion. Just a little reminder that you mean a lot to me." },
} as const;

export const CARD_TEMPLATES = {
  minimal: { label: "Minimal", description: "Thoughtful type. Room to breathe." },
  celebratory: { label: "Celebratory", description: "A little color, a lot of joy." },
  elegant: { label: "Elegant", description: "Rich tones. A timeless frame." },
} as const;

export const CARD_THEMES = { warm: "Rose & cream", cool: "Blue & mist", neutral: "Ink & paper" } as const;
export const CARD_PALETTES: Record<CardInput["theme"], CardPalette> = {
  warm: { background: "#fff3e5", ink: "#682b36", accent: "#bb4c59", muted: "#8a5a5d" },
  cool: { background: "#eaf1f7", ink: "#203f5b", accent: "#416e9b", muted: "#526d82" },
  neutral: { background: "#f5f2ea", ink: "#292d29", accent: "#807043", muted: "#66685e" },
};

export const CARD_SIZES = {
  square: { label: "Square", width: 1080, height: 1080 },
  portrait: { label: "Portrait", width: 1080, height: 1350 },
} as const;

export const CARD_FIELD_LIMITS = { heading: 80, recipient: 60, message: 400, sender: 60 } as const;
export const CARD_MAX_MESSAGE_LINES = 12;
export const CARD_MAX_BODY_BYTES = 16 * 1024;
export const CARD_DEFAULTS: CardInput = {
  occasion: "birthday", template: "minimal", theme: "warm", size: "square",
  heading: CARD_OCCASIONS.birthday.heading, recipient: "", message: CARD_OCCASIONS.birthday.message, sender: "",
};
