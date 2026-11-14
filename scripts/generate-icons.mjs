// Regenerates the PNG icons in `public/` from `public/icon.svg`. Run it by
// hand only when the SVG changes: the PNGs are committed.
import {readFile} from "node:fs/promises";
import {chromium} from "@playwright/test";

const svg = await readFile("public/icon.svg", "utf8");
// The maskable icon fills the whole square: the system crops it itself.
const ROUNDED_CORNERS = 'rx="112"';
if (!svg.includes(ROUNDED_CORNERS)) {
  throw new Error(`public/icon.svg no longer contains ${ROUNDED_CORNERS}`);
}
const fullBleed = svg.replace(ROUNDED_CORNERS, 'rx="0"');

const icons = [
  {file: "icon-192.png", size: 192, source: svg},
  {file: "icon-512.png", size: 512, source: svg},
  {file: "icon-maskable-512.png", size: 512, source: fullBleed},
  // iOS neither crops nor handles transparency: full square.
  {file: "apple-touch-icon.png", size: 180, source: fullBleed},
];

const browser = await chromium.launch();
for (const {file, size, source} of icons) {
  const page = await browser.newPage({viewport: {width: size, height: size}});
  await page.setContent(
    `<style>*{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${source}`,
  );
  await page.screenshot({path: `public/${file}`, omitBackground: true});
  await page.close();
}
await browser.close();
