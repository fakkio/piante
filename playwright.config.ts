import {defineConfig, devices} from "@playwright/test";

const PORT = process.env.LOCAL_PORT ?? "4321";
const BASE_PATH = "/piante";

// `npm test` costruisce prima il sito sulle Schede di prova; il server serve
// solo quello che la build ha prodotto, sotto il percorso base di GitHub Pages.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    // Il sito è pensato prima per il telefono: i test girano a quella larghezza.
    ...devices["Pixel 7"],
    baseURL: `http://localhost:${PORT}${BASE_PATH}/`,
  },
  webServer: {
    command: "node scripts/serve-dist.mjs",
    env: {PORT, BASE_PATH, DIST_DIR: "dist-prova"},
    url: `http://localhost:${PORT}${BASE_PATH}/`,
    reuseExistingServer: false,
  },
});
