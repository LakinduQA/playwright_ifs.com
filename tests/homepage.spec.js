const { test, expect } = require("@playwright/test");
const HomePage = require("../pages/HomePage");

test.describe("IFS Website - Homepage Tests", () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // Go to the homepage before each test
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.dismissOverlays();
  });

  test("should load the homepage correctly", async ({ page }) => {
    // Go to homepage
    await page.goto("https://www.ifs.com/");
    // Wait for main nav to be visible
    const navLinks = page.locator(".navLinks ul > li > a.nav-dd");
    await navLinks.first().waitFor({ state: "visible", timeout: 10000 });

    // Check for all main nav items
    const expectedNavs = [
      "IFS.ai",
      "Industries",
      "Solutions",
      "Customer Success",
      "Partners",
      "About",
    ];
    for (const nav of expectedNavs) {
      await expect(navLinks.filter({ hasText: nav })).toHaveCount(1);
    }

    // Check hero title and subtitle (robust, visible only)
    await expect(page.locator("h1")).toBeVisible();
    await expect(
      page.locator(
        'h5:has-text("Industrial AI is revolutionizing industries and reshaping the future")'
      )
    ).toBeVisible();

    // Check hero buttons (at least one should be visible)
    const learnHow = page.locator('a[href*="/ai"]:has-text("Learn how")');
    const bookDemo = page.locator(
      'a[href*="/book-a-demo"]:has-text("Book a demo")'
    );
    expect(
      (await learnHow.isVisible()) || (await bookDemo.isVisible())
    ).toBeTruthy();
  });

  test("should navigate through hero section tabs", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.dismissOverlays();
    await homePage.validateNavigationTabs();
  });

  test("should display customer stories section", async ({ page }) => {
    test.setTimeout(60000);
    const homePage = new HomePage(page);
    await homePage.dismissOverlays();
    await homePage.validateCustomerSection();
  });

  test("should navigate to the Learn How (AI) page", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.dismissOverlays();
    await homePage.clickLearnHow();
    // Verify we're on the AI page
    await expect(page).toHaveURL(/.*\/ai.*/);
  });

  test("should navigate to Industries page", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.dismissOverlays();
    await homePage.industriesSolutionsTab.click(); // Go to industry section
    await homePage.dismissOverlays();
    // Ensure we can navigate to Industries
    await homePage.exploreIndustriesLink.click();
    // Verify we're on the Industries page
    await expect(page).toHaveURL(/.*\/industries.*/);
  });

  test("should navigate to Solutions page", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.dismissOverlays();
    await homePage.industriesSolutionsTab.click(); // Go to industry section
    await homePage.dismissOverlays();
    // Ensure we can navigate to Solutions
    await homePage.exploreSolutionsLink.click();
    // Verify we're on the Solutions page
    await expect(page).toHaveURL(/.*\/solutions.*/);
  });
});
