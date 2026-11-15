import {expect, test} from "@playwright/test";

const plant = (page: import("@playwright/test").Page, botanicalName: string) =>
  page.getByRole("list", {name: "Piante"}).getByRole("listitem").filter({hasText: botanicalName});

test("the list shows a photo only for plants that have one", async ({page}) => {
  await page.goto("./");
  await expect(plant(page, "Monstera deliciosa").getByRole("img")).toBeVisible();
  await expect(plant(page, "Tulipa gesneriana").getByRole("img")).toBeVisible();
  await expect(plant(page, "Citrus × limon").getByRole("img")).toHaveCount(0);
  await expect(plant(page, "Cucumis sativus").getByRole("img")).toHaveCount(0);
});

test("list photos are resized for the phone", async ({page}) => {
  await page.goto("./");
  const image = plant(page, "Monstera deliciosa").getByRole("img");
  const width = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
  expect(width).toBeLessThanOrEqual(400);
});

test("a card shows its photo with author, license and origin page", async ({page}) => {
  await page.goto("cards/monstera-deliciosa/");
  const figure = page.getByRole("figure");
  await expect(figure.getByRole("img")).toBeVisible();
  await expect(figure).toContainText("Autrice Alfa");
  await expect(figure).toContainText("CC BY-SA 4.0");
  await expect(figure.getByRole("link", {name: "Pagina di origine"})).toHaveAttribute(
    "href",
    "https://commons.wikimedia.org/wiki/File:Monstera_alfa.jpg",
  );
});

test("the owner's own photo carries no third-party credit", async ({page}) => {
  await page.goto("cards/tulipa-gesneriana/");
  const figure = page.getByRole("figure");
  await expect(figure.getByRole("img")).toBeVisible();
  await expect(figure.locator("figcaption")).toHaveCount(0);
});

test("a card without photo has no figure, and the heading still leads the page", async ({page}) => {
  await page.goto("cards/citrus-limon/");
  await expect(page.getByRole("figure")).toHaveCount(0);
  await expect(page.getByRole("heading", {level: 1})).toHaveText("Limone");
});

test("a list row without photo keeps the same layout as one with a photo", async ({page}) => {
  await page.goto("./");
  const heightOf = (name: string) =>
    plant(page, name).evaluate((el) => el.getBoundingClientRect().height);
  expect(Math.abs((await heightOf("Citrus × limon")) - (await heightOf("Monstera deliciosa")))).toBeLessThan(2);
});
