import {defineCollection} from "astro:content";
import {glob} from "astro/loaders";
import {z} from "astro/zod";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";

const CATEGORIE = [
  "ornamentale",
  "agrume",
  "aromatica",
  "ortaggio",
  "bulbosa",
] as const;

const STATI = ["coltivata", "in programma"] as const;

// La cartella delle Schede è configurabile: i test costruiscono il sito sulle
// Schede di prova, mai su quelle reali.
// Relativa alla radice del progetto, oppure assoluta.
const cartellaSchede = pathToFileURL(
  resolve(process.env.SCHEDE_DIR ?? "./schede"),
);

const testo = z.string().trim().min(1);

const schede = defineCollection({
  loader: glob({pattern: "*.md", base: cartellaSchede}),
  schema: z.strictObject({
    nomeBotanico: testo,
    // Il primo nome comune è quello mostrato nell'elenco.
    nomiComuni: z.array(testo).min(1),
    alias: z.array(testo).default([]),
    categoria: z.enum(CATEGORIE),
    stato: z.enum(STATI),
  }),
});

export const collections = {schede};
