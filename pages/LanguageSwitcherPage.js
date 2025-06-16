// (removed stray top-level async getVisibleLanguages)
// LanguageSwitcherPage.js - POM for the language switcher in the IFS top bar
const BasePage = require("./BasePage");

class LanguageSwitcherPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.languageButton = page.getByRole("button", { name: "English" });
    this.languageOption = (lang) => page.getByRole("link", { name: lang });
  }

  async openDropdown() {
    // Dismiss overlays (cookie, chatbot, etc.)
    await this.dismissOverlays();
    // Wait for overlay to be gone
    const overlay = this.page.locator(
      "#onetrust-consent-sdk, .onetrust-pc-dark-filter"
    );
    await overlay.waitFor({ state: "hidden", timeout: 10000 }).catch(() => {});
    await this.languageButton.waitFor({ state: "visible", timeout: 5000 });
    await this.languageButton.click();
  }

  async selectLanguage(lang) {
    const option = this.languageOption(lang);
    await option.waitFor({ state: "visible", timeout: 5000 });
    await option.click();
  }

  async isLanguageButtonVisible(lang = "English") {
    return await this.page.getByRole("button", { name: lang }).isVisible();
  }

  async getVisibleLanguages() {
    // Open dropdown if not already open
    await this.openDropdown();
    // Get all visible language options
    const options = await this.page
      .locator('a[role="menuitem"], a[role="option"], a')
      .all();
    const visibleLangs = [];
    for (const opt of options) {
      if (await opt.isVisible()) {
        const text = (await opt.textContent())?.trim();
        if (text) visibleLangs.push(text);
      }
    }
    return visibleLangs;
  }
}

module.exports = LanguageSwitcherPage;
