import {expect, test, type Page} from "@playwright/test";

const plantList = (page: Page) => page.getByRole("list", {name: "Piante"});
const plant = (page: Page, botanicalName: string) =>
  plantList(page).getByRole("listitem").filter({hasText: botanicalName});

test.beforeEach(async ({page}) => {
  await page.goto("./");
});

test("the list shows every fixture plant with common name, botanical name, category and status", async ({
  page,
}) => {
  await expect(plantList(page).getByRole("listitem")).toHaveCount(4);

  const monstera = plant(page, "Monstera deliciosa");
  await expect(monstera.getByRole("heading")).toHaveText("Monstera");
  await expect(monstera).toContainText("Ornamentale");
  await expect(monstera).toContainText("Coltivata");

  const cucumber = plant(page, "Cucumis sativus");
  await expect(cucumber.getByRole("heading")).toHaveText("Cetriolo");
  await expect(cucumber).toContainText("Ortaggio");
  await expect(cucumber).toContainText("In programma");
});

test("plants are sorted alphabetically by common name", async ({page}) => {
  await expect(plantList(page).getByRole("heading")).toHaveText([
    "Cetriolo",
    "Limone",
    "Monstera",
    "Tulipano",
  ]);
});

test("a planned plant stands apart from a growing one", async ({page}) => {
  const status = (botanicalName: string) =>
    plant(page, botanicalName).getByText(/^(Coltivata|In programma)$/);
  const background = (botanicalName: string) =>
    status(botanicalName).evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    );

  await expect(status("Tulipa gesneriana")).toHaveText("In programma");
  await expect(status("Citrus × limon")).toHaveText("Coltivata");
  expect(await background("Tulipa gesneriana")).not.toBe(
    await background("Citrus × limon"),
  );
});

test("the list fits a phone width without horizontal scrolling", async ({
  page,
}) => {
  await expect(plantList(page)).toBeVisible();

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test("the site declares a manifest for adding it to the Home screen", async ({
  page,
  request,
}) => {
  const href = await page
    .locator('link[rel="manifest"]')
    .evaluate((link: HTMLLinkElement) => link.href);
  const manifest = await (await request.get(href)).json();

  expect(manifest.name).toBe("Piante");
  expect(manifest.display).toBe("standalone");
  expect(new URL(manifest.start_url, href).pathname).toBe("/piante/");

  expect(manifest.icons.length).toBeGreaterThan(0);
  for (const icon of manifest.icons) {
    const response = await request.get(new URL(icon.src, href).href);
    expect(response.ok(), icon.src).toBe(true);
  }
});
