import {defineConfig, devices} from "@playwright/test";

const PORT = process.env.LOCAL_PORT ?? "4321";
const BASE_PATH = "/piante";

// `npm test` first builds the site on the fixture cards; the server only
// serves what that build produced, under the GitHub Pages base path.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  use: {
    // The site is designed phone first: tests run at that width.
    ...devices["Pixel 7"],
    baseURL: `http://localhost:${PORT}${BASE_PATH}/`,
  },
  webServer: {
    command: "node scripts/serve-dist.mjs",
    env: {PORT, BASE_PATH, DIST_DIR: "dist-test"},
    url: `http://localhost:${PORT}${BASE_PATH}/`,
    reuseExistingServer: false,
  },
});
