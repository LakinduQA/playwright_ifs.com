// ContactPage object model for the IFS Contact Us page
const BasePage = require("./BasePage");
const { expect } = require("@playwright/test");

class ContactPage extends BasePage {
  // Dismiss cookie banner if present
  async dismissCookieBannerIfVisible() {
    const cookieAccept = this.page.locator(
      'button:has-text("Accept All Cookies")'
    );
    if (await cookieAccept.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cookieAccept.click();
    }
  }

  // Dismiss chatbot if present (adjust selector as needed)
  async dismissChatbotIfVisible() {
    const closeChatbot = this.page.locator(
      'button[aria-label*="close"], button:has-text("Close")'
    );
    if (await closeChatbot.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closeChatbot.click();
    }
  }
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Page elements
    this.pageTitle = page.locator('h1:has-text("Contact us")');

    // Tab navigation - now more specific to avoid ambiguity
    this.contactUsTab = page
      .locator("#contact-tabs li")
      .filter({ hasText: "Contact us" });
    this.countryContactsTab = page
      .locator("#contact-tabs li")
      .filter({ hasText: "Country contacts" });

    // Contact form elements inside iframe (updated selector)
    this.formIframe = page.frameLocator("#contact-tabs iframe");
    this.contactFormIntro = page.locator(
      'p:has-text("The easiest and fastest way to get in touch")'
    );
    this.emailField = this.formIframe.getByLabel("*Business Email");
    this.firstNameField = this.formIframe.getByLabel("*First Name");
    this.lastNameField = this.formIframe.getByLabel("*Last Name");
    this.companyField = this.formIframe.getByLabel("*Company");
    this.phoneField = this.formIframe.getByLabel("*Phone Number");
    this.countryDropdown = this.formIframe.getByLabel("*Country");
    this.iAmDropdown = this.formIframe.getByLabel("*I am...");
    this.messageField = this.formIframe.getByLabel("*Message");
    this.consentCheckbox = this.formIframe.getByLabel(
      "*Please tick if you would"
    );
    this.submitButton = this.formIframe.getByRole("button", {
      name: "Contact Us",
    });

    // Award images
    this.awardImages = page.locator(
      'img[src*="gartner"], img[src*="customer_choice"]'
    );

    // Footer and social links (simple examples, adjust selectors as needed)
    this.footerLinks = page.locator("footer a");
    this.socialLinks = page.locator(
      'footer [aria-label*="social"] a, footer a[href*="linkedin"], footer a[href*="twitter"]'
    );
  }

  async goto() {
    await this.page.goto("https://www.ifs.com/contact-us", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await this.dismissCookieBannerIfVisible();
    await this.dismissChatbotIfVisible();
    // Wait for iframe and form fields to be ready (updated selector)
    await this.page
      .frameLocator("#contact-tabs iframe")
      .locator("input")
      .first()
      .waitFor({ state: "visible", timeout: 15000 });
  }

  async validatePageHeader() {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.contactUsTab.first()).toBeVisible();
    await expect(this.countryContactsTab.first()).toBeVisible();
  }

  async validateContactForm() {
    await expect(this.contactFormIntro).toBeVisible();
    await expect(this.emailField).toBeVisible();
    await expect(this.firstNameField).toBeVisible();
    await expect(this.lastNameField).toBeVisible();
    await expect(this.companyField).toBeVisible();
    await expect(this.phoneField).toBeVisible();
    await expect(this.countryDropdown).toBeVisible();
    await expect(this.iAmDropdown).toBeVisible();
    await expect(this.messageField).toBeVisible();
    await expect(this.consentCheckbox).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async switchToCountryContacts() {
    await this.countryContactsTab.first().click();
    // Wait for the tab to have the 'active' class, indicating the switch is complete
    await expect(this.countryContactsTab.first()).toHaveClass(/active/);
  }

  async fillContactForm(formData) {
    if (formData.email) await this.emailField.fill(formData.email);
    if (formData.firstName) await this.firstNameField.fill(formData.firstName);
    if (formData.lastName) await this.lastNameField.fill(formData.lastName);
    if (formData.company) await this.companyField.fill(formData.company);
    if (formData.phone) await this.phoneField.fill(formData.phone);
    if (formData.country)
      await this.countryDropdown.selectOption(formData.country);
    if (formData.iAm) await this.iAmDropdown.selectOption(formData.iAm);
    if (formData.message) await this.messageField.fill(formData.message);
    if (formData.consent) await this.consentCheckbox.check();
  }

  async validateFormValidation() {
    await this.emailField.fill("");
    await this.firstNameField.fill("");
    await this.lastNameField.fill("");
    await this.companyField.fill("");
    await this.phoneField.fill("");
    await this.countryDropdown.selectOption("");
    await this.iAmDropdown.selectOption("");
    await this.messageField.fill("");
    // Uncheck consent if checked
    if (await this.consentCheckbox.isChecked()) {
      await this.consentCheckbox.uncheck();
    }
    await this.submitButton.click();
    await expect(this.pageTitle).toBeVisible();
    await expect(this.emailField).toBeVisible();
  }

  async validateAwards() {
    await expect(this.awardImages.first()).toBeVisible();
    const count = await this.awardImages.count();
    expect(count).toBeGreaterThan(0);
  }

  async validateFooterLinks() {
    const linkCount = await this.footerLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    for (let i = 0; i < linkCount; i++) {
      await expect(this.footerLinks.nth(i)).toHaveAttribute("href", /.+/);
    }
  }

  async validateSocialMediaLinks() {
    const count = await this.socialLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(this.socialLinks.nth(i)).toHaveAttribute(
        "href",
        /https?:\/\//
      );
    }
  }
}

module.exports = ContactPage;
