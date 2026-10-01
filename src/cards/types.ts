export type CardInput = {
  occasion: "birthday" | "thank-you" | "congratulations" | "general";
  template: "minimal" | "celebratory" | "elegant";
  theme: "warm" | "cool" | "neutral";
  size: "square" | "portrait";
  heading: string;
  recipient: string;
  message: string;
  sender: string;
};

export type CardPalette = { background: string; ink: string; accent: string; muted: string };
