// @ts-check
import {defineConfig} from "astro/config";

// GitHub Pages pubblica il sito sotto il nome del repository: ogni link e
// risorsa interna passa da questo percorso base.
export default defineConfig({
  site: "https://fakkio.github.io",
  base: "/piante",
});
