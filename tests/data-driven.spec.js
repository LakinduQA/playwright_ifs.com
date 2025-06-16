const { test, expect } = require("@playwright/test");
const IndustriesPage = require("../pages/IndustriesPage");
const SolutionsPage = require("../pages/SolutionsPage");
const { industries, solutions, searchQueries } = require("../utils/testData");

/**
 * Data-driven tests for the IFS website
 */
test.describe("IFS Website - Data-Driven Tests", () => {
  test.setTimeout(60000);
  // Test all industries
  test.describe("Industry Pages", () => {
    for (const industry of industries) {
      test(`should display the ${industry.name} industry page correctly`, async ({
        page,
      }) => {
        // Navigate directly to the industry page
        await page.goto(`https://www.ifs.com${industry.url}`, {
          timeout: 90000,
        });
        // Remove overlays after navigation
        await page.evaluate(() => {
          const ot = document.getElementById("onetrust-consent-sdk");
          if (ot) ot.remove();
          const dark = document.querySelector(".onetrust-pc-dark-filter");
          if (dark) dark.remove();
          const banner = document.getElementById("onetrust-banner-sdk");
          if (banner) banner.remove();
          document
            .querySelectorAll(
              '[style*="pointer-events: none"], [style*="z-index: 9999"], .ot-fade-in'
            )
            .forEach((el) => el.remove());
        });

        // Verify industry page loaded
        const industriesPage = new IndustriesPage(page);
        await industriesPage.validateLogo();

        // Check that the industry heading contains the expected text
        const heading = page.locator("h1").first();
        await expect(heading).toContainText(industry.expectedHeading);
      });
    }
  });

  // Test all solutions
  test.describe("Solution Pages", () => {
    for (const solution of solutions) {
      test(`should display the ${solution.name} solution page correctly`, async ({
        page,
      }) => {
        // Navigate directly to the solution page
        await page.goto(`https://www.ifs.com${solution.url}`, {
          timeout: 90000,
        });
        // Remove overlays after navigation
        await page.evaluate(() => {
          const ot = document.getElementById("onetrust-consent-sdk");
          if (ot) ot.remove();
          const dark = document.querySelector(".onetrust-pc-dark-filter");
          if (dark) dark.remove();
          const banner = document.getElementById("onetrust-banner-sdk");
          if (banner) banner.remove();
          document
            .querySelectorAll(
              '[style*="pointer-events: none"], [style*="z-index: 9999"], .ot-fade-in'
            )
            .forEach((el) => el.remove());
        });

        // Verify solution page loaded
        const solutionsPage = new SolutionsPage(page);
        await solutionsPage.validateLogo();

        // Check that the solution heading contains the expected text
        const heading = page.locator("h1").first();
        await expect(heading).toContainText(solution.expectedHeading);
      });
    }
  });
});
