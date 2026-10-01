import { minimal } from "./minimal";
import { celebratory } from "./celebratory";
import { elegant } from "./elegant";
import type { CardTemplate } from "./shared";
import type { CardInput } from "../types";

export const cardTemplates: Record<CardInput["template"], CardTemplate> = { minimal, celebratory, elegant };
