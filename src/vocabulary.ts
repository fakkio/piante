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
