// SolutionsPage object model for the IFS Solutions page
const BasePage = require("./BasePage");
const { expect } = require("@playwright/test");

class SolutionsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    // Contact form iframe and fields
    this.contactFormIframe = page.frameLocator(
      'iframe[src*="Book-a-Demo-Central-Program_iframe"]'
    );
    this.contactFormEmail =
      this.contactFormIframe.getByLabel(/Business Email/i);

    // Page elements
    this.pageTitle = page.getByRole("heading", {
      level: 1,
      name: /Industrial AI and enterprise software solutions/i,
    });
    this.pageSubtitle = page.getByText(
      "For hardcore businesses that service, power, and protect our planet.",
      { exact: true }
    );
    // There are two 'Book a demo' links, use the one in the main content
    this.bookDemoButton = page
      .locator("#content")
      .getByRole("link", { name: /Book a demo/i })
      .first();

    // Video section
    this.videoHeader = page.getByRole("heading", {
      level: 3,
      name: /Powering the world’s most demanding industries/i,
    });
    // Use the Wistia embed element as the video indicator
    this.videoEmbed = page.locator("main .wistia_embed").first();

    // Solutions cards
    this.solutionCards = page.locator("main h4").filter({
      hasText:
        /Enterprise Resource Planning|Enterprise Asset Management|Service Management|Enterprise Service Management|Energy & Resources/,
    });

    // Individual solution sections
    this.erpSection = page
      .locator('main h4:has-text("Enterprise Resource Planning")')
      .locator("..")
      .locator("..");
    this.eamSection = page
      .locator('main h4:has-text("Enterprise Asset Management")')
      .locator("..")
      .locator("..");
    this.smSection = page
      .locator('main h4:has-text("Service Management")')
      .locator("..")
      .locator("..");
    this.esmSection = page
      .locator('main h4:has-text("Enterprise Service Management")')
      .locator("..")
      .locator("..");
    this.energyResourcesSection = page
      .locator('main h4:has-text("Energy & Resources")')
      .locator("..")
      .locator("..");

    // FAQ section
    this.faqHeader = page.getByRole("heading", { level: 2, name: /FAQ/i });
    // The FAQ <h2> is followed by a div, then a div with class 'accordion', then a <ul class="items">
    this.faqList = page
      .locator('main h2:has-text("FAQ")')
      .locator(
        'xpath=../../following-sibling::div[contains(@class,"accordion")][1]//ul[contains(@class,"items")]'
      );
    this.faqItems = this.faqList.locator("li.item");

    // Contact form elements
    this.contactFormHeading = page.getByRole("heading", {
      level: 2,
      name: /Get in touch/i,
    });
    this.contactFormIframe = page.locator("main iframe").first();
    this.emailField = page
      .frameLocator("main iframe")
      .getByLabel(/Business Email/i);
    this.firstNameField = page
      .frameLocator("main iframe")
      .getByLabel(/First Name/i);
    this.lastNameField = page
      .frameLocator("main iframe")
      .getByLabel(/Last Name/i);
    this.companyField = page.frameLocator("main iframe").getByLabel(/Company/i);
    this.phoneField = page
      .frameLocator("main iframe")
      .getByLabel(/Phone Number/i);
    this.solutionInterestDropdown = page
      .frameLocator("main iframe")
      .getByLabel(/Solution Interest/i);
    this.countryDropdown = page
      .frameLocator("main iframe")
      .getByLabel(/Country/i);
    this.messageField = page.frameLocator("main iframe").getByLabel(/Message/i);
    this.consentCheckbox = page
      .frameLocator("main iframe")
      .getByLabel(/Please tick if you would/i);
    this.submitButton = page
      .frameLocator("main iframe")
      .getByRole("button", { name: /Book a Demo/i });

    // Additional information section
    this.additionalInfoHeader = page.getByRole("heading", {
      level: 3,
      name: /Additional information/i,
    });
    this.additionalInfoCards = page
      .locator("main a")
      .filter({ hasText: /Read more/i });
  }

  /**
   * Navigate to the IFS Solutions page
   */
  async goto() {
    await this.page.goto("https://www.ifs.com/solutions/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await this.dismissOverlays();
  }

  /**
   * Validate page header and content
   */
  async validatePageHeader() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageSubtitle).toBeVisible();
    await expect(this.bookDemoButton).toBeVisible();
  }

  /**
   * Validate video section
   */
  async validateVideoSection() {
    // Dismiss overlays before checking for video
    await this.dismissOverlays();
    await expect(this.videoHeader).toBeVisible();
    await this.videoHeader.scrollIntoViewIfNeeded();
    // Wait for the Wistia embed to appear and be visible
    await this.page.waitForTimeout(1000); // Give scripts a moment to run
    const count = await this.videoEmbed.count();
    expect(count).toBeGreaterThan(0);
    await expect(this.videoEmbed).toBeVisible();
  }

  /**
   * Validate solution cards
   */
  async validateSolutionCards() {
    // Check count of solution cards (should be at least 3)
    const cardCount = await this.solutionCards.count();
    expect(cardCount).toBeGreaterThan(2);
    // Check visibility of each solution section (pick first match)
    await expect(this.erpSection.first()).toBeVisible();
    await expect(this.eamSection.first()).toBeVisible();
    await expect(this.smSection.first()).toBeVisible();
    await expect(this.esmSection.first()).toBeVisible();
    await expect(this.energyResourcesSection.first()).toBeVisible();
  }

  /**
   * Validate FAQ section
   */
  async validateFAQSection() {
    await this.faqHeader.scrollIntoViewIfNeeded();
    await expect(this.faqHeader).toBeVisible();
    await this.page.waitForTimeout(1000);
    await expect(this.faqList).toBeVisible({ timeout: 5000 });
    const faqCount = await this.faqItems.count();
    expect(faqCount).toBeGreaterThan(0);
    try {
      // Wait for overlays to disappear before clicking
      await this.page
        .locator("#onetrust-consent-sdk, .onetrust-pc-dark-filter")
        .waitFor({ state: "hidden", timeout: 5000 })
        .catch(() => {});
      await this.faqItems.first().click({ force: true });
      await this.page.waitForTimeout(500);
    } catch (e) {
      console.log("Could not click FAQ item:", e);
    }
  }

  /**
   * Validate contact form presence
   */
  async validateContactForm() {
    await this.dismissOverlays();
    // Wait for the iframe to be attached
    await this.page.waitForSelector("iframe", { timeout: 15000 });
    // Wait for the email field to be visible
    await expect(this.contactFormEmail).toBeVisible({ timeout: 15000 });
    await expect(this.contactFormHeading).toBeVisible();
    await this.contactFormHeading.scrollIntoViewIfNeeded();
    await expect(this.contactFormIframe).toBeVisible({ timeout: 10000 });
    await expect(this.emailField).toBeVisible();
    await expect(this.firstNameField).toBeVisible();
    await expect(this.lastNameField).toBeVisible();
    await expect(this.companyField).toBeVisible();
    await expect(this.phoneField).toBeVisible();
    await expect(this.solutionInterestDropdown).toBeVisible();
    await expect(this.countryDropdown).toBeVisible();
    await expect(this.messageField).toBeVisible();
    await expect(this.consentCheckbox).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Validate additional information section
   */
  async validateAdditionalInfo() {
    await this.additionalInfoHeader.scrollIntoViewIfNeeded();
    await expect(this.additionalInfoHeader).toBeVisible();

    // Check that there are information cards
    const cardCount = await this.additionalInfoCards.count();
    expect(cardCount).toBeGreaterThan(0);
  }

  /**
   * Navigate to a solution page
   * @param {string} solution The solution to navigate to (e.g., "Enterprise Resource Planning")
   */
  async navigateToSolution(solution) {
    // Always dismiss overlays before clicking
    await this.dismissOverlays();
    let solutionSelector;
    switch (solution.toLowerCase()) {
      case "enterprise resource planning":
      case "erp":
        solutionSelector = this.erpSection;
        break;
      case "enterprise asset management":
      case "eam":
        solutionSelector = this.eamSection;
        break;
      case "service management":
      case "sm":
        solutionSelector = this.smSection;
        break;
      case "enterprise service management":
      case "esm":
        solutionSelector = this.esmSection;
        break;
      case "energy & resources":
        solutionSelector = this.energyResourcesSection;
        break;
      default:
        throw new Error(`Solution "${solution}" not recognized`);
    }

    // Find and click the correct card link by href or text
    let cardLink;
    let expectedUrlPattern;
    if (solution.toLowerCase().includes("erp")) {
      cardLink = this.page.locator('a[href*="enterprise-resource-planning"]');
      expectedUrlPattern = /enterprise-resource-planning/;
    } else if (solution.toLowerCase().includes("asset")) {
      cardLink = this.page.locator('a[href*="enterprise-asset-management"]');
      expectedUrlPattern = /enterprise-asset-management/;
    } else if (
      solution.toLowerCase().includes("service management") &&
      !solution.toLowerCase().includes("enterprise")
    ) {
      cardLink = this.page.locator('a[href*="field-service-management"]');
      expectedUrlPattern = /field-service-management/;
    } else if (solution.toLowerCase().includes("enterprise service")) {
      cardLink = this.page.locator('a[href*="enterprise-service-management"]');
      expectedUrlPattern = /enterprise-service-management/;
    } else if (solution.toLowerCase().includes("energy")) {
      cardLink = this.page.locator('a[href*="energy-and-resources-software"]');
      expectedUrlPattern = /energy-and-resources-software/;
    } else {
      cardLink = solutionSelector.locator("a");
      expectedUrlPattern = null;
    }
    // Scroll carousel if card is not visible
    let foundVisible = false;
    let popupResult = null;
    const cardCount = await cardLink.count();
    for (let i = 0; i < cardCount; i++) {
      const card = cardLink.nth(i);
      if (await card.isVisible()) {
        await card.scrollIntoViewIfNeeded();
        // Wait for overlays to disappear before clicking
        await this.page
          .locator("#onetrust-consent-sdk, .onetrust-pc-dark-filter")
          .waitFor({ state: "hidden", timeout: 5000 })
          .catch(() => {});
        const target = await card.getAttribute("target");
        if (target === "_blank") {
          // Try popup, but fallback to same-tab navigation if no popup appears
          let popup = null;
          try {
            [popup] = await Promise.all([
              this.page.waitForEvent("popup", { timeout: 2000 }),
              card.click(),
            ]);
            await popup.waitForLoadState("domcontentloaded");
            popupResult = popup;
          } catch (e) {
            // No popup, fallback to same-tab navigation
            try {
              await Promise.all([
                this.page
                  .waitForNavigation({
                    url: expectedUrlPattern,
                    timeout: 10000,
                  })
                  .catch(() => {}),
                card.click(),
              ]);
            } catch (err) {
              // If still blocked, try force click
              await card.click({ force: true });
            }
            if (expectedUrlPattern) {
              await this.page
                .waitForURL(expectedUrlPattern, { timeout: 10000 })
                .catch(() => {});
            }
          }
        } else {
          // Try navigation in same tab
          try {
            await Promise.all([
              this.page
                .waitForNavigation({ url: expectedUrlPattern, timeout: 10000 })
                .catch(() => {}),
              card.click(),
            ]);
          } catch (err) {
            // If still blocked, try force click
            await card.click({ force: true });
          }
          if (expectedUrlPattern) {
            await this.page
              .waitForURL(expectedUrlPattern, { timeout: 10000 })
              .catch(() => {});
          }
        }
        foundVisible = true;
        break;
      }
    }
    if (!foundVisible) {
      // Try to click next carousel button and retry
      const nextBtn = this.page
        .locator('button[aria-label*="Next"], button:has-text("next")')
        .first();
      for (let j = 0; j < 5; j++) {
        if (await nextBtn.isVisible()) await nextBtn.click();
        for (let i = 0; i < cardCount; i++) {
          const card = cardLink.nth(i);
          if (await card.isVisible()) {
            await card.scrollIntoViewIfNeeded();
            const target = await card.getAttribute("target");
            if (target === "_blank") {
              const [popup] = await Promise.all([
                this.page.waitForEvent("popup"),
                card.click(),
              ]);
              await popup.waitForLoadState("domcontentloaded");
              popupResult = popup;
            } else {
              await Promise.all([
                this.page
                  .waitForNavigation({
                    url: expectedUrlPattern,
                    timeout: 10000,
                  })
                  .catch(() => {}),
                card.click(),
              ]);
              if (expectedUrlPattern) {
                await this.page
                  .waitForURL(expectedUrlPattern, { timeout: 10000 })
                  .catch(() => {});
              }
            }
            foundVisible = true;
            break;
          }
        }
        if (foundVisible) break;
      }
    }
    if (!foundVisible)
      throw new Error("Could not find visible solution card to click");
    return popupResult;
  }

  /**
   * Fill in the contact form (without submitting)
   * @param {Object} formData Object containing form field values
   */
  async fillContactForm(formData) {
    // Dismiss overlays before interacting with the form
    await this.dismissOverlays();
    await expect(this.contactFormIframe).toBeVisible({ timeout: 10000 });
    if (formData.email) await this.emailField.fill(formData.email);
    if (formData.firstName) await this.firstNameField.fill(formData.firstName);
    if (formData.lastName) await this.lastNameField.fill(formData.lastName);
    if (formData.company) await this.companyField.fill(formData.company);
    if (formData.phone) await this.phoneField.fill(formData.phone);
    if (formData.solution)
      await this.solutionInterestDropdown.selectOption({
        label: formData.solution,
      });
    if (formData.country)
      await this.countryDropdown.selectOption({ label: formData.country });
    if (formData.message) await this.messageField.fill(formData.message);
    if (formData.consent) {
      await this.dismissOverlays(); // Dismiss overlays again before checking consent
      // Wait for overlays to disappear before checking
      await this.page
        .locator("#onetrust-consent-sdk, .onetrust-pc-dark-filter")
        .waitFor({ state: "hidden", timeout: 5000 })
        .catch(() => {});
      try {
        await this.consentCheckbox.check();
      } catch (e) {
        // If still blocked, try force check
        await this.consentCheckbox.check({ force: true });
      }
    }
  }
}

module.exports = SolutionsPage;
