import {expect, test, type Page} from "@playwright/test";

const openCard = async (page: Page, commonName: string) => {
  await page.goto("./");
  await page.getByRole("link", {name: commonName}).click();
};

test("opening a plant from the list shows its card, and Back returns to the list", async ({
  page,
}) => {
  await openCard(page, "Monstera");
  await expect(page.getByRole("heading", {level: 1})).toHaveText("Monstera");
  await expect(page).toHaveURL(/\/schede\/monstera-deliciosa\/$/);

  await page.goBack();
  await expect(page.getByRole("list", {name: "Piante"})).toBeVisible();
});

test("a card has a stable address of its own", async ({page}) => {
  await page.goto("schede/citrus-limon/");
  await expect(page.getByRole("heading", {level: 1})).toHaveText("Limone");
});

test("infos are grouped by theme, each with a short value and a note", async ({
  page,
}) => {
  await openCard(page, "Monstera");

  await expect(page.getByRole("heading", {level: 2})).toHaveText([
    "Terreno e rinvaso",
    "Acqua e concime",
    "Luce e temperatura",
    "Cure",
    "Problemi",
    "Fonti",
    "Nota personale",
  ]);

  const soil = page.locator('[data-info="soil"]');
  await expect(soil).toContainText("Terriccio alfa");
  await expect(soil).toContainText("Nota terriccio alfa.");

  const repotting = page.locator('[data-info="repotting"]');
  await expect(repotting).toContainText("marzo, aprile");
  await expect(repotting).toContainText("2 anni");

  await expect(page.locator('[data-info="idealTemperature"]')).toContainText("18–24 °C");
  await expect(page.locator('[data-info="minTemperature"]')).toContainText("10 °C");
  await expect(page.locator('[data-info="light"]')).toContainText("Lampada alfa");
});

test("sources show their type, followed by the date of the last research", async ({
  page,
}) => {
  await openCard(page, "Monstera");
  const sources = page.getByRole("region", {name: "Fonti"});
  await expect(sources).toContainText("1 novembre 2026");
  const items = sources.getByRole("listitem");
  await expect(items.nth(0)).toContainText("Fonte istituzionale alfa");
  await expect(items.nth(0)).toContainText("Istituzionale");
  await expect(items.nth(1)).toContainText("Di ripiego");
});

test("the personal note is rendered from the Markdown body", async ({page}) => {
  await openCard(page, "Monstera");
  await expect(page.getByRole("region", {name: "Nota personale"})).toContainText(
    "La mia Monstera è alta circa un metro.",
  );
});

test("a card without personal note has no empty section", async ({page}) => {
  await openCard(page, "Limone");
  await expect(page.getByRole("heading", {name: "Fonti"})).toBeVisible();
  await expect(page.getByRole("heading", {name: "Nota personale"})).toHaveCount(0);
});

test("a card not yet researched says so, with no empty info fields", async ({page}) => {
  await openCard(page, "Tulipano");
  await expect(page.getByText("Scheda ancora da ricercare.")).toBeVisible();
  await expect(page.locator("[data-info]")).toHaveCount(0);
});
