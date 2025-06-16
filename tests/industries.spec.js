const { test, expect } = require("@playwright/test");
const IndustriesPage = require("../pages/IndustriesPage");

test.setTimeout(60000);

test.describe("IFS Website - Industries Page Tests", () => {
  let industriesPage;

  test.beforeEach(async ({ page }) => {
    industriesPage = new IndustriesPage(page);
    await industriesPage.goto();
  });

  test("should load the industries page correctly", async () => {
    await industriesPage.validatePageHeader();
    await industriesPage.validateFooterLinks();
    await industriesPage.validateSocialMediaLinks();
  });

  test("should display industry experts section", async () => {
    await industriesPage.validateIndustryExperts();
  });

  test("should display all industry cards", async () => {
    await industriesPage.validateIndustryCards();
  });

  test("should allow filling in contact form fields", async () => {
    // Only type and check if we can input the data, do not submit
    await industriesPage.fillContactForm({
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      company: "Test Company",
      phone: "1234567890",
      country: "United States",
      message: "This is a test message from automated testing. Please ignore.",
      consent: true,
      submit: false, // Ensure no submit action is performed
    });
    // Verify form was filled (check a few fields)
    await expect(industriesPage.emailField).toHaveValue("test@example.com");
    await expect(industriesPage.firstNameField).toHaveValue("Test");
    await expect(industriesPage.lastNameField).toHaveValue("User");
  });

  test("should navigate to each industry detail page", async ({ page }) => {
    // Test navigation to Aerospace & Defense
    await industriesPage.navigateToIndustry("Aerospace & Defense");
    await expect(page).toHaveURL(/.*aerospace-and-defense.*/);
    await industriesPage.goto();
    // Test navigation to Energy Utilities
    await industriesPage.navigateToIndustry("Energy Utilities and Resources");
    await expect(page).toHaveURL(/.*energy-utilities-and-resources.*/);
    // Add more industry navigations as needed
  });
});
