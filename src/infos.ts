// The catalog of infos: the single source of truth for which infos exist, the
// shape of their value, and the theme they are shown under. Adding an info
// means adding it here (see GLOSSARY.md).
import {z} from "astro/zod";
import {CATEGORIES, type Category, type Theme} from "./vocabulary";

const text = z.string().trim().min(1);
const months = z
  .array(z.number().int().min(1).max(12))
  .min(1)
  .refine((list) => new Set(list).size === list.length, "Duplicate month");
const level = z.enum(["low", "medium", "high"]);
const toxicity = z.enum(["none", "animals", "people", "both"]);
const celsius = z.number().min(-50).max(60);
const protection = z.enum(["indoors", "greenhouse", "fleece"]);

// Every info is a short value plus a note of one or two sentences, or is
// explicitly not applicable to the plant (the note says why).
const notApplicable = z.strictObject({applicable: z.literal(false), note: text});
const info = <V extends z.ZodRawShape>(value: z.ZodType, extra?: V) =>
  z.union([z.strictObject({value, note: text, ...extra}), notApplicable]);

// The infos every plant has, and the ones only some categories have. An info
// is mandatory for the categories it applies to (as a value or as not
// applicable) and absent from the others.
const ALL = CATEGORIES;
const GARDEN = ["vegetable", "herb"] as const;

export const isNotApplicable = (item: {note: string}): item is {applicable: false; note: string} =>
  "applicable" in item;

export const INFOS = {
  soil: {label: "Terriccio", theme: "soil", categories: ALL, schema: info(text)},
  repotting: {
    label: "Rinvaso",
    theme: "soil",
    categories: ALL,
    schema: info(months, {frequency: text}),
  },
  wateringSummer: {label: "Annaffiatura d'estate", theme: "water", categories: ALL, schema: info(text)},
  wateringWinter: {label: "Annaffiatura d'inverno", theme: "water", categories: ALL, schema: info(text)},
  fertilizing: {label: "Concimazione", theme: "water", categories: ALL, schema: info(months)},
  light: {
    label: "Luce",
    theme: "climate",
    categories: ALL,
    schema: info(level, {
      dimHome: z.enum(["yes", "partly", "no"]),
      // Set when the plant needs more light than the home offers.
      supplementalLight: text.optional(),
    }),
  },
  idealTemperature: {
    label: "Temperatura ideale",
    theme: "climate",
    categories: ALL,
    schema: info(z.strictObject({min: celsius, max: celsius})),
  },
  minTemperature: {label: "Temperatura minima", theme: "climate", categories: ALL, schema: info(celsius)},
  humidity: {label: "Umidità", theme: "climate", categories: ALL, schema: info(level)},
  pruning: {label: "Potatura", theme: "care", categories: ALL, schema: info(text)},
  propagation: {label: "Propagazione", theme: "care", categories: ALL, schema: info(text)},
  toxicity: {label: "Tossicità", theme: "care", categories: ALL, schema: info(toxicity)},
  pests: {label: "Problemi e parassiti", theme: "problems", categories: ALL, schema: info(text)},
  sowing: {label: "Semina", theme: "care", categories: GARDEN, schema: info(months)},
  transplanting: {label: "Trapianto", theme: "care", categories: GARDEN, schema: info(months)},
  spacing: {label: "Distanza", theme: "care", categories: GARDEN, schema: info(text)},
  supports: {label: "Sostegni", theme: "care", categories: ["vegetable"], schema: info(text)},
  harvest: {label: "Raccolta", theme: "care", categories: [...GARDEN, "citrus"], schema: info(months)},
  overwintering: {
    label: "Svernamento",
    theme: "climate",
    categories: ["ornamental", "citrus", "herb", "bulb"],
    schema: info(
      z.strictObject({protection, bringIn: months, bringOut: months, threshold: celsius}),
    ),
  },
  flowering: {
    label: "Fioritura",
    theme: "care",
    categories: ["ornamental", "citrus", "bulb"],
    schema: info(months, {reflowering: text.optional()}),
  },
} as const satisfies Record<
  string,
  {label: string; theme: Theme; categories: readonly Category[]; schema: z.ZodType}
>;

export type InfoKey = keyof typeof INFOS;
export const INFO_KEYS = Object.keys(INFOS) as InfoKey[];

// Every info is optional here: which ones are required depends on the
// category, checked by `checkInfosForCategory` at card level.
export const infosSchema = z.strictObject(
  Object.fromEntries(INFO_KEYS.map((key) => [key, INFOS[key].schema.optional()])) as {
    [K in InfoKey]: z.ZodOptional<(typeof INFOS)[K]["schema"]>;
  },
);

export const appliesTo = (key: InfoKey, category: Category) =>
  (INFOS[key].categories as readonly Category[]).includes(category);

export function checkInfosForCategory(
  category: Category,
  infos: Partial<Record<InfoKey, unknown>>,
  ctx: z.RefinementCtx,
) {
  for (const key of INFO_KEYS) {
    const present = infos[key] !== undefined;
    if (appliesTo(key, category) && !present) {
      ctx.addIssue({code: "custom", path: ["infos", key], message: `Missing info "${key}" for category "${category}"`});
    } else if (!appliesTo(key, category) && present) {
      ctx.addIssue({code: "custom", path: ["infos", key], message: `Info "${key}" does not apply to category "${category}"`});
    }
  }
}

export const sourceSchema = z.strictObject({
  title: text,
  url: z.url(),
  type: z.enum(["institutional", "fallback"]),
});
