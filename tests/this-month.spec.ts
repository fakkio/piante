import {expect, test, type Page} from "@playwright/test";

// The browser date is pinned: the view must follow it, not the build date.
async function openOn(page: Page, isoDate: string) {
  await page.clock.setFixedTime(new Date(isoDate));
  await page.goto("./");
  await page.getByRole("link", {name: "Questo mese"}).click();
}

const month = (page: Page) => page.getByRole("heading", {level: 1});
const group = (page: Page, name: string) =>
  page.getByRole("region", {name});

test("opens by itself on the current month of the browser", async ({page}) => {
  await openOn(page, "2026-03-15T10:00:00");
  await expect(month(page)).toHaveText("Marzo");
});

test("lists the activities of the month grouped by type, each with its plant", async ({
  page,
}) => {
  await openOn(page, "2026-03-15T10:00:00");
  const repotting = group(page, "Rinvaso");
  await expect(repotting.getByRole("listitem")).toHaveText(["Limone", "Monstera"]);
  await expect(page.getByRole("region", {name: "Concimazione"})).toHaveCount(0);

  await openOn(page, "2026-07-15T10:00:00");
  await expect(group(page, "Rinvaso").getByRole("listitem")).toHaveText(["Cetriolo"]);
  await expect(group(page, "Concimazione").getByRole("listitem")).toHaveText([
    "Cetriolo",
    "Limone",
    "Monstera",
  ]);
});

test("planned plants are included", async ({page}) => {
  await openOn(page, "2026-07-15T10:00:00");
  await expect(group(page, "Rinvaso").getByRole("link", {name: "Cetriolo"})).toBeVisible();
});

test("an entry opens the card of the plant", async ({page}) => {
  await openOn(page, "2026-03-15T10:00:00");
  await group(page, "Rinvaso").getByRole("link", {name: "Monstera"}).click();
  await expect(page.getByRole("heading", {level: 1})).toHaveText("Monstera");
});

test("previous, next and any month can be reached", async ({page}) => {
  await openOn(page, "2026-03-15T10:00:00");
  await page.getByRole("button", {name: "Mese successivo"}).click();
  await expect(month(page)).toHaveText("Aprile");
  await expect(group(page, "Rinvaso").getByRole("listitem")).toHaveText(["Limone", "Monstera"]);

  await page.getByRole("button", {name: "Mese precedente"}).click();
  await page.getByRole("button", {name: "Mese precedente"}).click();
  await expect(month(page)).toHaveText("Febbraio");

  await page.getByRole("combobox", {name: "Mese"}).selectOption("luglio");
  await expect(month(page)).toHaveText("Luglio");
  await expect(group(page, "Concimazione")).toBeVisible();
});

test("months wrap around the year", async ({page}) => {
  await openOn(page, "2026-12-15T10:00:00");
  await page.getByRole("button", {name: "Mese successivo"}).click();
  await expect(month(page)).toHaveText("Gennaio");
  await page.getByRole("button", {name: "Mese precedente"}).click();
  await expect(month(page)).toHaveText("Dicembre");
});

test("an empty month says so", async ({page}) => {
  await openOn(page, "2026-01-15T10:00:00");
  await expect(month(page)).toHaveText("Gennaio");
  await expect(page.getByRole("status")).toHaveText("Nessuna attività questo mese.");
});

test("the view is usable at phone width: no horizontal scroll, tappable controls", async ({
  page,
}) => {
  await openOn(page, "2026-03-15T10:00:00");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);
  const box = await page.getByRole("button", {name: "Mese successivo"}).boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  expect(box!.width).toBeGreaterThanOrEqual(44);
});
