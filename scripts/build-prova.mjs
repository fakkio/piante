// Costruisce il sito sulle Schede di prova, in una cartella separata da quella
// pubblicata: i test non toccano mai le Schede reali né `dist`.
import {build} from "astro";

process.env.SCHEDE_DIR = "./tests/schede";

await build({outDir: "./dist-prova"});
