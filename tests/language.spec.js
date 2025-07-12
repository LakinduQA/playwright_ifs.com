import { test, expect } from "@playwright/test";
const LanguageSwitcherPage = require("../pages/LanguageSwitcherPage");

// Test at least 4 languages from the dropdown
const LANGUAGES_TO_TEST = ["English", "Français", "Deutsch", "Español"];

test("IFS language switcher works for at least 4 languages", async ({
  page,
}) => {
  const langPage = new LanguageSwitcherPage(page);
  await page.goto("https://www.ifs.com/");
  await langPage.dismissOverlays();
  await langPage.openDropdown();
  const visibleLangs = await langPage.getVisibleLanguages();
  expect(visibleLangs.length).toBeGreaterThanOrEqual(4);

  // Test switching to each language in LANGUAGES_TO_TEST if present
  for (const lang of LANGUAGES_TO_TEST) {
    if (visibleLangs.includes(lang)) {
      await langPage.openDropdown();
      await langPage.selectLanguage(lang);
      // URL check: English is default, others should have /fr, /de, /es, etc.
      if (lang === "English") {
        await expect(page).not.toHaveURL(/\/fr|\/de|\/es/);
      } else if (lang === "Français") {
        await expect(page).toHaveURL(/\/fr/);
      } else if (lang === "Deutsch") {
        await expect(page).toHaveURL(/\/de/);
      } else if (lang === "Español") {
        await expect(page).toHaveURL(/\/es/);
      }
      await expect(page.getByRole("button", { name: lang })).toBeVisible();
    }
  }
});
