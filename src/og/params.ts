import {
  OG_DEFAULTS,
  OG_FIELD_LIMITS,
} from "./config";
import { parseImageUrl } from "./image";

export { OG_DEFAULTS } from "./config";

export type OgParams = {
  title: string;
  description: string;
  siteName: string;
  social: string;
  cta: string;
  image: string;
};

export type ParseOgParamsResult =
  | { ok: true; value: OgParams }
  | { ok: false; error: string };

const TEXT_FIELDS = [
  "title",
  "description",
  "siteName",
  "social",
  "cta",
] as const;

export function parseOgParams(searchParams: URLSearchParams): ParseOgParamsResult {
  const values: OgParams = { ...OG_DEFAULTS };

  for (const field of TEXT_FIELDS) {
    const value = searchParams.get(field)?.trim();
    if (value) values[field] = value;

    if (values[field].length > OG_FIELD_LIMITS[field]) {
      return {
        ok: false,
        error: `${field} exceeds the maximum length`,
      };
    }
  }

  const image = searchParams.get("image")?.trim();
  if (image) values.image = image;

  if (values.image.length > OG_FIELD_LIMITS.image || !parseImageUrl(values.image)) {
    return { ok: false, error: "image must be a valid HTTPS image URL" };
  }

  return { ok: true, value: values };
}
