export const DEFAULT_IMAGE_URL =
  "https://res.cloudinary.com/yehez/image/upload/v1646485864/yehez_avatar_transparent_swwqcq.png";

export const OG_DEFAULTS = {
  title: "Title",
  description: "Description",
  siteName: "yehezgun.com",
  social: "Twitter: @yehezgun",
  cta: "",
  image: DEFAULT_IMAGE_URL,
} as const;

export const OG_FIELD_LIMITS = {
  title: 100,
  description: 200,
  siteName: 50,
  social: 50,
  cta: 40,
  image: 2048,
} as const;

export const IMAGE_FETCH_LIMITS = {
  maxBytes: 2 * 1024 * 1024,
  timeoutMs: 4000,
  maxRedirects: 3,
} as const;

export const SUPPORTED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
