const { test, expect } = require("@playwright/test");
const SolutionsPage = require("../pages/SolutionsPage");

test.describe("IFS Website - Solutions Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the solutions page before each test
    const solutionsPage = new SolutionsPage(page);
    await solutionsPage.goto();
  });

  test("should load the solutions page correctly", async ({ page }) => {
    const solutionsPage = new SolutionsPage(page);
    await solutionsPage.validatePageHeader();
    await solutionsPage.validateFooterLinks();
    await solutionsPage.validateSocialMediaLinks();
  });

  test("should display video section", async ({ page }) => {
    const solutionsPage = new SolutionsPage(page);
    await solutionsPage.validateVideoSection();
  });

  test("should display all solution cards", async ({ page }) => {
    const solutionsPage = new SolutionsPage(page);
    await solutionsPage.validateSolutionCards();
  });

  test("should display FAQ section", async ({ page }) => {
    const solutionsPage = new SolutionsPage(page);
    await solutionsPage.validateFAQSection();
  });

  test("should display contact form", async ({ page }) => {
    const solutionsPage = new SolutionsPage(page);
    await solutionsPage.validateContactForm();
  });

  test("should display additional information section", async ({ page }) => {
    const solutionsPage = new SolutionsPage(page);
    await solutionsPage.validateAdditionalInfo();
  });

  test("should allow filling in contact form fields", async ({ page }) => {
    const solutionsPage = new SolutionsPage(page);

    // Scroll to the form
    await solutionsPage.contactFormHeading.scrollIntoViewIfNeeded();

    // Fill in form fields but don't submit (to avoid spamming real forms)
    await solutionsPage.fillContactForm({
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      company: "Test Company",
      phone: "1234567890",
      solution: "Enterprise Resource Planning (ERP)",
      country: "United States",
      message: "This is a test message from automated testing. Please ignore.",
      consent: true,
    });

    // Verify form was filled (we'll just check one field to keep the test simple)
    await expect(solutionsPage.emailField).toHaveValue("test@example.com");
  });
});
