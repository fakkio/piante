// The site lives under the GitHub Pages base path: every internal link and
// asset URL is built here, never as a hand-written absolute path.
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export const sitePath = (relative = ""): string =>
  `${base}/${relative.replace(/^\//, "")}`;
