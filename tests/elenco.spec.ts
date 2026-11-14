import {expect, test, type Page} from "@playwright/test";

const elenco = (page: Page) => page.getByRole("list", {name: "Piante"});
const pianta = (page: Page, nomeBotanico: string) =>
  elenco(page).getByRole("listitem").filter({hasText: nomeBotanico});

test.beforeEach(async ({page}) => {
  await page.goto("./");
});

test("l'elenco mostra ogni Pianta di prova con nome comune, nome botanico, Categoria e Stato", async ({
  page,
}) => {
  await expect(elenco(page).getByRole("listitem")).toHaveCount(4);

  const monstera = pianta(page, "Monstera deliciosa");
  await expect(monstera.getByRole("heading")).toHaveText("Monstera");
  await expect(monstera).toContainText("Ornamentale");
  await expect(monstera).toContainText("Coltivata");

  const cetriolo = pianta(page, "Cucumis sativus");
  await expect(cetriolo.getByRole("heading")).toHaveText("Cetriolo");
  await expect(cetriolo).toContainText("Ortaggio");
  await expect(cetriolo).toContainText("In programma");
});

test("le Piante sono in ordine alfabetico di nome comune", async ({page}) => {
  await expect(elenco(page).getByRole("heading")).toHaveText([
    "Cetriolo",
    "Limone",
    "Monstera",
    "Tulipano",
  ]);
});

test("una Pianta in programma si distingue da una coltivata", async ({page}) => {
  const stato = (nomeBotanico: string) =>
    pianta(page, nomeBotanico).getByText(/^(Coltivata|In programma)$/);
  const sfondo = (nomeBotanico: string) =>
    stato(nomeBotanico).evaluate((el) => getComputedStyle(el).backgroundColor);

  await expect(stato("Tulipa gesneriana")).toHaveText("In programma");
  await expect(stato("Citrus × limon")).toHaveText("Coltivata");
  expect(await sfondo("Tulipa gesneriana")).not.toBe(
    await sfondo("Citrus × limon"),
  );
});

test("l'elenco sta nella larghezza del telefono senza scorrimento orizzontale", async ({
  page,
}) => {
  await expect(elenco(page)).toBeVisible();

  const eccedenza = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(eccedenza).toBe(0);
});

test("il sito dichiara un manifest per l'aggiunta alla schermata Home", async ({
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
  for (const icona of manifest.icons) {
    const risposta = await request.get(new URL(icona.src, href).href);
    expect(risposta.ok(), icona.src).toBe(true);
  }
});
