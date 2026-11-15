import {expect, test, type Page} from "@playwright/test";

test.beforeEach(async ({page}) => {
  await page.goto("./");
  await page.getByRole("link", {name: "Confronto"}).click();
});

const row = (page: Page, name: string) =>
  page.getByRole("row").filter({has: page.getByRole("rowheader", {name})});

test("shows one row per plant and the short values of the default columns", async ({page}) => {
  await expect(page.getByRole("rowheader")).toHaveText(["Cetriolo", "Limone", "Monstera", "Tulipano"]);
  await expect(page.getByRole("columnheader", {name: "Luce"})).toBeVisible();
  await expect(row(page, "Monstera")).toContainText("Media");
});

test("a plant without researched infos shows a missing value", async ({page}) => {
  await expect(row(page, "Tulipano").getByRole("cell").first()).toHaveText("—");
  await expect(row(page, "Tulipano").getByRole("cell").first()).toHaveAccessibleName("Non ancora ricercato");
});

test("a not applicable info is shown differently from a missing value", async ({page}) => {
  await page.getByRole("checkbox", {name: "Potatura"}).check();
  const cell = row(page, "Cetriolo").locator('td[data-column="pruning"]');
  await expect(cell).toHaveText("Non applicabile");
  await expect(cell).not.toHaveText("—");
  await expect(row(page, "Monstera").locator('td[data-column="pruning"]')).not.toHaveText("Non applicabile");
});

test("the columns can be chosen", async ({page}) => {
  await expect(page.getByRole("columnheader", {name: "Umidità"})).toHaveCount(0);
  await page.getByRole("checkbox", {name: "Umidità"}).check();
  await expect(page.getByRole("columnheader", {name: "Umidità"})).toBeVisible();
  await expect(row(page, "Limone")).toContainText("Alta");

  await page.getByRole("checkbox", {name: "Luce"}).uncheck();
  await expect(page.getByRole("columnheader", {name: "Luce"})).toHaveCount(0);
});

test("the plant name opens its card", async ({page}) => {
  await row(page, "Monstera").getByRole("link", {name: "Monstera"}).click();
  await expect(page.getByRole("heading", {level: 1})).toHaveText("Monstera");
});

test("the name column stays fixed when the table scrolls sideways", async ({page}) => {
  for (const name of ["Temperatura ideale", "Terriccio", "Rinvaso", "Concimazione"]) {
    await page.getByRole("checkbox", {name}).check();
  }
  const scroller = page.locator(".table-scroll");
  expect(await scroller.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  const header = row(page, "Monstera").getByRole("rowheader");
  const before = await header.boundingBox();
  await scroller.evaluate((el) => (el.scrollLeft = 200));
  const after = await header.boundingBox();
  expect(after!.x).toBe(before!.x);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
