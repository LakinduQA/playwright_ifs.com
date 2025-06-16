// IndustriesPage object model for the IFS Industries page
const BasePage = require("./BasePage");
const { expect } = require("@playwright/test");

class IndustriesPage extends BasePage {
  /**
   * Accept the cookie consent dialog if present
   */
  async acceptCookiesIfVisible() {
    const cookieButton = this.page.getByRole("button", {
      name: "Accept All Cookies",
    });
    // Only try to click if visible and enabled
    if (await cookieButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cookieButton
        .waitFor({ state: "visible", timeout: 2000 })
        .catch(() => {});
      await cookieButton
        .waitFor({ state: "attached", timeout: 2000 })
        .catch(() => {});
      await cookieButton.click().catch(() => {});
      // Wait for the overlay to disappear
      const overlay = this.page.locator("#onetrust-consent-sdk");
      await overlay
        .waitFor({ state: "detached", timeout: 5000 })
        .catch(() => {});
    }
  }
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Page elements
    this.pageTitle = page.locator(
      'main h1:has-text("Enhanced Industry Functionality")'
    );
    this.pageSubtitle = page.locator(
      'main p:has-text("The best-of-breed functionality")'
    );

    // Industries section elements
    this.industryExperts = page.locator(
      'main h4:has-text("We are industry experts")'
    );

    // Industry cards (all h4s under main that are industry names)
    this.industryCards = page.locator("main h4").filter({
      hasText:
        /Aerospace|Energy|Construction|Manufacturing|Service Industries|Telecommunications/,
    });

    // Individual industry sections (parent of h4)
    this.aerospaceDefenseSection = page
      .locator('main h4:has-text("Aerospace & Defense")')
      .locator("..")
      .locator("..");
    this.energyUtilitiesSection = page
      .locator('main h4:has-text("Energy Utilities and Resources")')
      .locator("..")
      .locator("..");
    this.constructionSection = page
      .locator('main h4:has-text("Construction and Engineering")')
      .locator("..")
      .locator("..");
    this.manufacturingSection = page
      .locator('main h4:has-text("Manufacturing")')
      .locator("..")
      .locator("..");
    this.serviceIndustriesSection = page
      .locator('main h4:has-text("Service Industries")')
      .locator("..")
      .locator("..");
    this.telecommunicationsSection = page
      .locator('main h4:has-text("Telecommunications")')
      .locator("..")
      .locator("..");

    // Contact form elements (iframe after 'Get in touch' heading)
    this.contactFormHeading = page.locator('h2:has-text("Get in touch")');
    this.contactFormIframe = page.locator("#content iframe").first();
    this.emailField = page
      .frameLocator("#content iframe")
      .getByLabel("*Business Email");
    this.firstNameField = page
      .frameLocator("#content iframe")
      .getByLabel("*First Name");
    this.lastNameField = page
      .frameLocator("#content iframe")
      .getByLabel("*Last Name");
    this.companyField = page
      .frameLocator("#content iframe")
      .getByLabel("*Company");
    this.phoneField = page
      .frameLocator("#content iframe")
      .getByLabel("*Phone Number");
    this.countryDropdown = page
      .frameLocator("#content iframe")
      .getByLabel("*Country");
    this.iamDropdown = page
      .frameLocator("#content iframe")
      .getByLabel("*I am...");
    this.messageField = page
      .frameLocator("#content iframe")
      .getByLabel("*Message");
    this.consentCheckbox = page
      .frameLocator("#content iframe")
      .getByLabel("*Please tick if you would");
    this.submitButton = page
      .frameLocator("#content iframe")
      .getByRole("button", { name: "Contact Us" });
  }

  /**
   * Navigate to the IFS Industries page
   */
  async goto() {
    await this.page.goto("https://www.ifs.com/industries/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await this.acceptCookiesIfVisible();
    await this.dismissChatbotIfVisible();
  }

  /**
   * Validate page header and content
   */
  async validatePageHeader() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.pageSubtitle).toBeVisible();
  }

  /**
   * Validate industry experts section
   */
  async validateIndustryExperts() {
    await expect(this.industryExperts).toBeVisible();
  }

  /**
   * Validate industry cards
   */
  async validateIndustryCards() {
    // Check count of industry cards (should be 6)
    await expect(this.industryCards).toHaveCount(6);
    // Check visibility of each industry section
    await expect(this.aerospaceDefenseSection).toBeVisible();
    await expect(this.energyUtilitiesSection).toBeVisible();
    await expect(this.constructionSection).toBeVisible();
    await expect(this.manufacturingSection).toBeVisible();
    await expect(this.serviceIndustriesSection).toBeVisible();
    await expect(this.telecommunicationsSection).toBeVisible();
  }

  /**
   * Validate contact form presence
   */
  async validateContactForm() {
    await expect(this.contactFormHeading).toBeVisible();
    await this.contactFormHeading.scrollIntoViewIfNeeded();
    // Wait for the iframe to be attached
    await expect(this.contactFormIframe).toBeVisible({ timeout: 10000 });
    // Check that form fields are present
    await expect(this.emailField).toBeVisible();
    await expect(this.firstNameField).toBeVisible();
    await expect(this.lastNameField).toBeVisible();
    await expect(this.companyField).toBeVisible();
    await expect(this.phoneField).toBeVisible();
    await expect(this.countryDropdown).toBeVisible();
    await expect(this.messageField).toBeVisible();
    await expect(this.consentCheckbox).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  /**
   * Navigate to an industry page
   * @param {string} industry The industry to navigate to (e.g., "Aerospace & Defense")
   */
  async navigateToIndustry(industry) {
    let industrySelector;
    switch (industry.toLowerCase()) {
      case "aerospace & defense":
      case "aerospace and defense":
        industrySelector = this.aerospaceDefenseSection;
        break;
      case "energy utilities and resources":
        industrySelector = this.energyUtilitiesSection;
        break;
      case "construction and engineering":
        industrySelector = this.constructionSection;
        break;
      case "manufacturing":
        industrySelector = this.manufacturingSection;
        break;
      case "service industries":
        industrySelector = this.serviceIndustriesSection;
        break;
      case "telecommunications":
        industrySelector = this.telecommunicationsSection;
        break;
      default:
        throw new Error(`Industry "${industry}" not recognized`);
    }

    // Find and click the link within the industry section
    const learnMoreLink = industrySelector.locator(
      'a:has-text("Learn more"), a:has-text("Discover now"), a:has-text("Read more")'
    );
    await learnMoreLink.click();
  }

  /**
   * Fill in the contact form (without submitting)
   * @param {Object} formData Object containing form field values
   */
  async fillContactForm(formData) {
    // Accept cookies if needed before interacting with the form
    await this.acceptCookiesIfVisible();
    // Wait for the iframe to be visible before filling
    await expect(this.contactFormIframe).toBeVisible({ timeout: 20000 });
    if (formData.email) await this.emailField.fill(formData.email);
    if (formData.firstName) await this.firstNameField.fill(formData.firstName);
    if (formData.lastName) await this.lastNameField.fill(formData.lastName);
    if (formData.company) await this.companyField.fill(formData.company);
    if (formData.phone) await this.phoneField.fill(formData.phone);
    if (formData.country)
      await this.countryDropdown.selectOption(formData.country);
    if (formData.iam) await this.iamDropdown.selectOption(formData.iam);
    if (formData.message) await this.messageField.fill(formData.message);
    if (formData.consent) await this.consentCheckbox.check();
  }
}

module.exports = IndustriesPage;
