import { CARD_FIELD_LIMITS, CARD_MAX_MESSAGE_LINES, CARD_OCCASIONS, CARD_SIZES, CARD_TEMPLATES, CARD_THEMES } from "./config";
import type { CardInput } from "./types";

export type ParseCardResult =
  | { ok: true; value: CardInput }
  | { ok: false; error: string; field?: keyof CardInput };

export function parseCardInput(input: unknown): ParseCardResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Expected a card object" };
  }
  const raw = input as Record<string, unknown>;
  const options = { occasion: CARD_OCCASIONS, template: CARD_TEMPLATES, theme: CARD_THEMES, size: CARD_SIZES };
  for (const field of ["occasion", "template", "theme", "size"] as const) {
    if (typeof raw[field] !== "string" || !Object.hasOwn(options[field], raw[field])) {
      return { ok: false, field, error: `Choose a valid ${field}` };
    }
  }
  const values: Record<string, string> = {};
  for (const field of ["heading", "recipient", "message", "sender"] as const) {
    if (typeof raw[field] !== "string") return { ok: false, field, error: `${field} must be text` };
    const value = raw[field].replace(/\r\n?/g, "\n").trim();
    if ((field === "heading" || field === "message") && !value) {
      return { ok: false, field, error: `Please enter a ${field}` };
    }
    if (value.length > CARD_FIELD_LIMITS[field]) {
      return { ok: false, field, error: `${field} must be ${CARD_FIELD_LIMITS[field]} characters or fewer` };
    }
    if (field === "message" && value.split("\n").length > CARD_MAX_MESSAGE_LINES) {
      return { ok: false, field, error: `Use ${CARD_MAX_MESSAGE_LINES} lines or fewer so your message stays readable` };
    }
    values[field] = field === "message" ? value : value.replace(/\s+/g, " ");
  }
  return { ok: true, value: {
    occasion: raw.occasion as CardInput["occasion"], template: raw.template as CardInput["template"],
    theme: raw.theme as CardInput["theme"], size: raw.size as CardInput["size"],
    heading: values.heading, recipient: values.recipient, message: values.message, sender: values.sender,
  } };
}
