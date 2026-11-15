// The fixed vocabularies of a card, with the Italian label the site shows for
// each value. Code and frontmatter use the English keys; see GLOSSARY.md for
// the Italian terms they stand for.
export const CATEGORY_LABELS = {
  ornamental: "Ornamentale",
  citrus: "Agrume",
  herb: "Aromatica",
  vegetable: "Ortaggio",
  bulb: "Bulbosa",
} as const;

export const STATUS_LABELS = {
  growing: "Coltivata",
  planned: "In programma",
} as const;

export type Category = keyof typeof CATEGORY_LABELS;
export type Status = keyof typeof STATUS_LABELS;

const keys = <T extends object>(labels: T) =>
  Object.keys(labels) as [keyof T, ...(keyof T)[]];

export const CATEGORIES = keys(CATEGORY_LABELS);
export const STATUSES = keys(STATUS_LABELS);

export const LEVEL_LABELS = {
  low: "Bassa",
  medium: "Media",
  high: "Alta",
} as const;

export const DIM_HOME_LABELS = {
  yes: "Sì",
  partly: "In parte",
  no: "No",
} as const;

export const THEME_LABELS = {
  soil: "Terreno e rinvaso",
  water: "Acqua e concime",
  climate: "Luce e temperatura",
  care: "Cure",
  problems: "Problemi",
} as const;

export const SOURCE_TYPE_LABELS = {
  institutional: "Istituzionale",
  fallback: "Di ripiego",
} as const;

export const MONTH_LABELS = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
] as const;

export type Theme = keyof typeof THEME_LABELS;

// Activity types of the "this month" view.
export const ACTIVITY_LABELS = {
  repotting: "Rinvaso",
  fertilizing: "Concimazione",
} as const;
