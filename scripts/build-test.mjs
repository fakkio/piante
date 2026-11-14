// Builds the site on the fixture cards, into a folder separate from the
// published one: tests never touch the real cards or `dist`.
import {build} from "astro";

process.env.CARDS_DIR = "./tests/cards";

await build({outDir: "./dist-test"});
