// Rigenera le icone PNG in `public/` da `public/icona.svg`. Va lanciato a mano
// solo quando cambia l'SVG: i PNG sono versionati.
import {readFile} from "node:fs/promises";
import {chromium} from "@playwright/test";

const svg = await readFile("public/icona.svg", "utf8");
// L'icona "maskable" riempie tutto il quadrato: il sistema la ritaglia da sé.
const ANGOLI = 'rx="112"';
if (!svg.includes(ANGOLI)) {
  throw new Error(`public/icona.svg non contiene più ${ANGOLI}`);
}
const piena = svg.replace(ANGOLI, 'rx="0"');

const icone = [
  {file: "icona-192.png", lato: 192, sorgente: svg},
  {file: "icona-512.png", lato: 512, sorgente: svg},
  {file: "icona-maschera-512.png", lato: 512, sorgente: piena},
  // iOS non ritaglia e non gestisce la trasparenza: quadrato pieno.
  {file: "apple-touch-icon.png", lato: 180, sorgente: piena},
];

const browser = await chromium.launch();
for (const {file, lato, sorgente} of icone) {
  const page = await browser.newPage({viewport: {width: lato, height: lato}});
  await page.setContent(
    `<style>*{margin:0}svg{display:block;width:${lato}px;height:${lato}px}</style>${sorgente}`,
  );
  await page.screenshot({path: `public/${file}`, omitBackground: true});
  await page.close();
}
await browser.close();
