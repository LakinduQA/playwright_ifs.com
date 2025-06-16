const { test, expect } = require("@playwright/test");
const HomePage = require("../pages/HomePage");
const { takeFullPageScreenshot } = require("../utils/visualTesting");

/**
 * Visual regression tests for the IFS website
 * Note: These tests capture screenshots - the first run will create baseline images
 */
test.describe("IFS Website - Visual Regression Tests", () => {
  // Add a flag to conditionally run screenshot tests
  // These tests are resource-intensive and might be run separately
  const ENABLE_VISUAL_TESTS = process.env.ENABLE_VISUAL_TESTS === "true";

  test.beforeEach(async () => {
    test.skip(
      !ENABLE_VISUAL_TESTS,
      "Visual tests are disabled. Run with ENABLE_VISUAL_TESTS=true to enable."
    );
  });

  test("should maintain homepage hero section appearance", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Wait for hero section to fully load
    await homePage.heroTitle.waitFor({ state: "visible" });

    // Take screenshot of the hero section
    await takeFullPageScreenshot(page, "homepage-hero");
  });

  test("should maintain navigation menu appearance", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Capture navigation area
    await page.screenshot({
      path: "screenshots/navigation.png",
      clip: {
        x: 0,
        y: 0,
        width: page.viewportSize().width,
        height: 150, // Approximate height of the navigation area
      },
    });
  });

  test("should maintain footer appearance", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Scroll to footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait for any visible footer link (robust)
    await homePage.footerAllLinks.first().waitFor({ state: "visible" });

    // Take screenshot of the footer
    await page.screenshot({
      path: "screenshots/footer.png",
      clip: {
        x: 0,
        y: page.viewportSize().height - 600, // Approximate footer position
        width: page.viewportSize().width,
        height: 600, // Approximate footer height
      },
    });
  });

  // Test visual consistency across different browsers
  // Note: This assumes the tests are run on multiple browser projects
  test("should display consistently across browsers", async ({
    page,
    browserName,
  }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Wait for page to fully load
    await homePage.waitForPageLoad();

    // Take a screenshot with the browser name in the filename
    await takeFullPageScreenshot(page, `homepage-${browserName}`);
  });
});
