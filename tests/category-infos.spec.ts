import {expect, test, type Page} from "@playwright/test";

const openCard = async (page: Page, commonName: string) => {
  await page.goto("./");
  await page.getByRole("link", {name: commonName}).click();
};

const info = (page: Page, key: string) => page.locator(`[data-info="${key}"]`);

test("a vegetable shows its garden infos", async ({page}) => {
  await openCard(page, "Cetriolo");
  await expect(info(page, "sowing")).toContainText("aprile");
  await expect(info(page, "transplanting")).toContainText("maggio, giugno");
  await expect(info(page, "spacing")).toContainText("Distanza gamma");
  await expect(info(page, "supports")).toContainText("Sostegno gamma");
  await expect(info(page, "harvest")).toContainText("agosto, settembre");
  await expect(info(page, "harvest")).toContainText("Nota raccolta gamma.");
});

test("garden infos do not appear on an ornamental", async ({page}) => {
  await openCard(page, "Monstera");
  for (const key of ["sowing", "transplanting", "spacing", "supports", "harvest"]) {
    await expect(info(page, key)).toHaveCount(0);
  }
});

test("a vegetable shows neither wintering nor flowering", async ({page}) => {
  await openCard(page, "Cetriolo");
  await expect(info(page, "overwintering")).toHaveCount(0);
  await expect(info(page, "flowering")).toHaveCount(0);
});

test("wintering shows the protection, the months and the threshold", async ({page}) => {
  await openCard(page, "Limone");
  const wintering = info(page, "overwintering");
  await expect(wintering).toContainText("Sotto tessuto non tessuto");
  await expect(wintering).toContainText("Ritirare: novembre");
  await expect(wintering).toContainText("Riportare fuori: marzo");
  await expect(wintering).toContainText("0 °C");
  await expect(wintering).toContainText("Nota svernamento beta.");
});

test("flowering shows the months and how to induce reflowering", async ({page}) => {
  await openCard(page, "Limone");
  await expect(info(page, "flowering")).toContainText("aprile, maggio");
  await expect(info(page, "flowering")).toContainText("Rifioritura beta");
});

test("a category info that does not apply to the plant says so, with its note", async ({page}) => {
  await openCard(page, "Monstera");
  await expect(info(page, "flowering")).toContainText("Non applicabile");
  await expect(info(page, "flowering")).toContainText("Nota fioritura alfa.");
});

test("the month view lists sowing, flowering and wintering moves", async ({page}) => {
  await page.clock.setFixedTime(new Date("2026-04-15T10:00:00"));
  await page.goto("./");
  await page.getByRole("link", {name: "Questo mese"}).click();
  await expect(page.getByRole("region", {name: "Semina"}).getByRole("listitem")).toHaveText(["Cetriolo"]);
  await expect(page.getByRole("region", {name: "Fioritura"}).getByRole("listitem")).toHaveText(["Limone"]);

  await page.getByRole("combobox", {name: "Mese"}).selectOption("novembre");
  await expect(page.getByRole("region", {name: "Ritirare"}).getByRole("listitem")).toHaveText(["Limone"]);
  await page.getByRole("combobox", {name: "Mese"}).selectOption("marzo");
  await expect(page.getByRole("region", {name: "Riportare fuori"}).getByRole("listitem")).toHaveText(["Limone"]);
});
