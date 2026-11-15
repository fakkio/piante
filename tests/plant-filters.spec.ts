import {expect, test, type Page} from "@playwright/test";

const search = (page: Page) => page.getByRole("searchbox", {name: "Cerca"});
const commonNames = (page: Page) =>
  page.getByRole("list", {name: "Piante"}).getByRole("heading");
const filter = (page: Page, name: string) => page.getByRole("checkbox", {name, exact: true});
const clear = (page: Page) => page.getByRole("button", {name: "Azzera filtri"});

test.beforeEach(async ({page}) => {
  await page.goto("./");
  await page.getByText("Filtri", {exact: false}).first().click();
});

test("a single filter narrows the list", async ({page}) => {
  await filter(page, "Agrume").check();
  await expect(commonNames(page)).toHaveText(["Limone"]);
});

test("a filter on the status narrows the list", async ({page}) => {
  await filter(page, "In programma").check();
  await expect(commonNames(page)).toHaveText(["Cetriolo", "Tulipano"]);
});

test("filters on infos: light and toxicity", async ({page}) => {
  await filter(page, "Luce bassa").check();
  await expect(commonNames(page)).toHaveText(["Limone"]);

  await filter(page, "Luce bassa").uncheck();
  await filter(page, "Tossica per animali").check();
  // "Both" counts as toxic to animals; the unresearched plant has no value.
  await expect(commonNames(page)).toHaveText(["Limone", "Monstera"]);
});

test("two filters combine and narrow further", async ({page}) => {
  await filter(page, "In programma").check();
  await filter(page, "Luce alta").check();
  await expect(commonNames(page)).toHaveText(["Cetriolo"]);
});

test("values of the same filter widen the list", async ({page}) => {
  await filter(page, "Luce bassa").check();
  await filter(page, "Luce media").check();
  await expect(commonNames(page)).toHaveText(["Limone", "Monstera"]);
});

test("filters combine with the search by name", async ({page}) => {
  await filter(page, "In programma").check();
  await search(page).fill("tulip");
  await expect(commonNames(page)).toHaveText(["Tulipano"]);
  await search(page).fill("monstera");
  await expect(commonNames(page)).toHaveCount(0);
  await expect(page.getByText("Nessuna pianta trovata")).toBeVisible();
});

test("the clear command resets filters but not the search", async ({page}) => {
  await filter(page, "Agrume").check();
  await filter(page, "Luce bassa").check();
  await search(page).fill("limo");
  await clear(page).click();
  await expect(commonNames(page)).toHaveText(["Limone"]);
  await expect(filter(page, "Agrume")).not.toBeChecked();
  await search(page).fill("");
  await expect(commonNames(page)).toHaveCount(4);
  await expect(clear(page)).toBeHidden();
});

test("active filters are visible without opening the filter panel", async ({page}) => {
  await filter(page, "Agrume").check();
  await page.getByText("Filtri", {exact: false}).first().click();
  const active = page.getByRole("list", {name: "Filtri attivi"});
  await expect(active).toContainText("Agrume");
  await active.getByRole("button", {name: /Agrume/}).click();
  await expect(commonNames(page)).toHaveCount(4);
});

test("filters with no match show an explicit message", async ({page}) => {
  await filter(page, "Agrume").check();
  await filter(page, "In programma").check();
  await expect(commonNames(page)).toHaveCount(0);
  await expect(page.getByText("Nessuna pianta trovata")).toBeVisible();
});

test("filter controls are comfortable to tap on a phone", async ({page}) => {
  const box = await filter(page, "Agrume").locator("xpath=..").boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
});
