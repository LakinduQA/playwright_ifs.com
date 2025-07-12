const { test, expect } = require("@playwright/test");
const ContactPage = require("../pages/ContactPage");

test.describe("IFS Website - Contact Us Page Tests", () => {
  let contactPage;
  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.goto();
  });

  test("should load the contact page correctly", async () => {
    await contactPage.validatePageHeader();
    await contactPage.validateFooterLinks();
    await contactPage.validateSocialMediaLinks();
  });

  test("should display contact form", async () => {
    await contactPage.validateContactForm();
  });

  test("should validate form fields", async () => {
    await contactPage.validateFormValidation();
  });

  test("should switch between contact tabs", async () => {
    await expect(contactPage.contactUsTab.first()).toHaveClass(/active/);
    await contactPage.switchToCountryContacts();
    await expect(contactPage.countryContactsTab.first()).toHaveClass(/active/);
  });

  test("should display awards", async () => {
    await contactPage.validateAwards();
  });

  test("should allow filling in contact form fields", async () => {
    await contactPage.fillContactForm({
      email: "testingyourwebsit3@gmail.com",
      firstName: "Test",
      lastName: "User",
      company: "Test Company",
      phone: "0771234567",
      country: "Sri Lanka",
      iAm: "Just researching",
      message: "This is a test message from automated testing. Please ignore.",
      consent: true,
    });
    await expect(contactPage.emailField).toHaveValue(
      "testingyourwebsit3@gmail.com"
    );
  });
});
