import {defineCollection} from "astro:content";
import {glob} from "astro/loaders";
import {z} from "astro/zod";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {infosSchema, sourceSchema} from "./infos";
import {CATEGORIES, STATUSES} from "./vocabulary";

// The cards folder is configurable: tests build the site on fixture cards,
// never on the real ones. Relative to the project root, or absolute.
const cardsDir = pathToFileURL(resolve(process.env.CARDS_DIR ?? "./cards"));

const nonEmptyText = z.string().trim().min(1);

const cards = defineCollection({
  loader: glob({pattern: "*.md", base: cardsDir}),
  schema: z
    .strictObject({
    botanicalName: nonEmptyText,
    // The first common name is the one shown in the list.
    commonNames: z.array(nonEmptyText).min(1),
    aliases: z.array(nonEmptyText).default([]),
    category: z.enum(CATEGORIES),
    status: z.enum(STATUSES),
    // Researched content. A card still waiting for its research has none of
    // the three; a card with any of them must have all, with every
    // mandatory info.
    infos: infosSchema.optional(),
    sources: z.array(sourceSchema).min(1).optional(),
    researchedOn: z.coerce.date().optional(),
  }).refine(
    ({infos, sources, researchedOn}) =>
      [infos, sources, researchedOn].every((v) => v === undefined) ||
      [infos, sources, researchedOn].every((v) => v !== undefined),
    "infos, sources and researchedOn go together",
  ),
});

export const collections = {cards};
