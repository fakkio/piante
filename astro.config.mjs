// @ts-check
import {defineConfig} from "astro/config";

// GitHub Pages serves the site under the repository name: every internal link
// and asset URL goes through this base path.
export default defineConfig({
  site: "https://fakkio.github.io",
  base: "/piante",
});
