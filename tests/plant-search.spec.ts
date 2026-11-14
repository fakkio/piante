import {expect, test, type Page} from "@playwright/test";

const search = (page: Page) => page.getByRole("searchbox", {name: "Cerca"});
const commonNames = (page: Page) =>
  page.getByRole("list", {name: "Piante"}).getByRole("heading");

test.beforeEach(async ({page}) => {
  await page.goto("./");
});

test("typing a botanical name narrows the list", async ({page}) => {
  await search(page).fill("monstera del");
  await expect(commonNames(page)).toHaveText(["Monstera"]);
});

test("an alias finds the plant", async ({page}) => {
  await search(page).fill("formaggio svizzero");
  await expect(commonNames(page)).toHaveText(["Monstera"]);
});

test("a common name finds the plant", async ({page}) => {
  await search(page).fill("tulip");
  await expect(commonNames(page)).toHaveText(["Tulipano"]);
});

test("case and accents are ignored", async ({page}) => {
  await search(page).fill("LÌMONÉ");
  await expect(commonNames(page)).toHaveText(["Limone"]);

  // An accent that the stored name does not have is ignored too.
  await search(page).fill("cetriòlino");
  await expect(commonNames(page)).toHaveText(["Cetriolo"]);
});

test("no match shows an explicit message, and clearing restores the list", async ({
  page,
}) => {
  await search(page).fill("zzz");
  await expect(commonNames(page)).toHaveCount(0);
  await expect(page.getByText("Nessuna pianta trovata")).toBeVisible();

  await search(page).fill("");
  await expect(commonNames(page)).toHaveCount(4);
  await expect(page.getByText("Nessuna pianta trovata")).toBeHidden();
});

test("the search survives opening another page and going back", async ({
  page,
}) => {
  await search(page).fill("tulip");
  await expect(commonNames(page)).toHaveText(["Tulipano"]);

  await page.goto("manifest.webmanifest");
  await page.goBack();

  await expect(search(page)).toHaveValue("tulip");
  await expect(commonNames(page)).toHaveText(["Tulipano"]);
});

test("the search box is comfortable to tap on a phone", async ({page}) => {
  const box = await search(page).boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  const fontSize = await search(page).evaluate(
    (el) => parseFloat(getComputedStyle(el).fontSize),
  );
  expect(fontSize).toBeGreaterThanOrEqual(16);
});
