// The catalog of infos: the single source of truth for which infos exist, the
// shape of their value, and the theme they are shown under. Adding an info
// means adding it here (see GLOSSARY.md).
import {z} from "astro/zod";
import type {Theme} from "./vocabulary";

const text = z.string().trim().min(1);
const months = z
  .array(z.number().int().min(1).max(12))
  .min(1)
  .refine((list) => new Set(list).size === list.length, "Duplicate month");
const level = z.enum(["low", "medium", "high"]);
const toxicity = z.enum(["none", "animals", "people", "both"]);
const celsius = z.number().min(-50).max(60);

// Every info is a short value plus a note of one or two sentences.
const info = <V extends z.ZodRawShape>(value: z.ZodType, extra?: V) =>
  z.strictObject({value, note: text, ...extra});

export const INFOS = {
  soil: {label: "Terriccio", theme: "soil", schema: info(text)},
  repotting: {
    label: "Rinvaso",
    theme: "soil",
    schema: info(months, {frequency: text}),
  },
  wateringSummer: {label: "Annaffiatura d'estate", theme: "water", schema: info(text)},
  wateringWinter: {label: "Annaffiatura d'inverno", theme: "water", schema: info(text)},
  fertilizing: {label: "Concimazione", theme: "water", schema: info(months)},
  light: {
    label: "Luce",
    theme: "climate",
    schema: info(level, {
      dimHome: z.enum(["yes", "partly", "no"]),
      // Set when the plant needs more light than the home offers.
      supplementalLight: text.optional(),
    }),
  },
  idealTemperature: {
    label: "Temperatura ideale",
    theme: "climate",
    schema: info(z.strictObject({min: celsius, max: celsius})),
  },
  minTemperature: {label: "Temperatura minima", theme: "climate", schema: info(celsius)},
  humidity: {label: "Umidità", theme: "climate", schema: info(level)},
  pruning: {label: "Potatura", theme: "care", schema: info(text)},
  propagation: {label: "Propagazione", theme: "care", schema: info(text)},
  toxicity: {label: "Tossicità", theme: "care", schema: info(toxicity)},
  pests: {label: "Problemi e parassiti", theme: "problems", schema: info(text)},
} as const satisfies Record<
  string,
  {label: string; theme: Theme; schema: z.ZodType}
>;

export type InfoKey = keyof typeof INFOS;
export const INFO_KEYS = Object.keys(INFOS) as InfoKey[];

export const infosSchema = z.strictObject(
  Object.fromEntries(INFO_KEYS.map((key) => [key, INFOS[key].schema])) as {
    [K in InfoKey]: (typeof INFOS)[K]["schema"];
  },
);

export const sourceSchema = z.strictObject({
  title: text,
  url: z.url(),
  type: z.enum(["institutional", "fallback"]),
});
