const { test, expect } = require("@playwright/test");
const HomePage = require("../pages/HomePage");

/**
 * Tests for measuring key performance metrics
 * Note: These are basic measurements - for more detailed performance analysis,
 * consider using Lighthouse or other specialized tools
 */
test.describe("IFS Website - Performance Tests", () => {
  test("should load homepage within acceptable time", async ({ page }) => {
    // Start measuring time
    const startTime = Date.now();

    const homePage = new HomePage(page);
    await homePage.goto();

    // Wait for hero section to be visible as an indicator of meaningful content
    await homePage.heroTitle.waitFor({ state: "visible" });

    // Calculate time to hero visible
    const timeToHeroVisible = Date.now() - startTime;

    // Logging the time for reporting
    console.log(`Time to hero visible: ${timeToHeroVisible}ms`);

    // Assertion - adjust threshold based on requirements
    // This is a basic example - actual threshold should be determined based on
    // performance requirements and baseline measurements
    expect(timeToHeroVisible).toBeLessThan(10000); // 10 seconds is a very generous threshold
  });

  test("should respond to user interactions quickly", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Measure tab switching time
    const startTabTime = Date.now();

    // Click on resources tab
    await homePage.orchestrateResourcesTab.click();

    // Wait for resources section to be visible
    await homePage.orchestrateResourcesHeading.waitFor({ state: "visible" });

    // Calculate time to switch tab
    const tabSwitchTime = Date.now() - startTabTime;

    console.log(`Time to switch tab: ${tabSwitchTime}ms`);
    expect(tabSwitchTime).toBeLessThan(3000); // Expect tab switching to be under 3 seconds
  });

  test("should have acceptable page weight (resources)", async ({ page }) => {
    // Track all responses
    const responses = [];
    page.on("response", (response) => responses.push(response));

    const homePage = new HomePage(page);
    await homePage.goto();
    await page.waitForLoadState("networkidle");

    let totalBytes = 0;
    const resourcesByType = {
      document: 0,
      stylesheet: 0,
      image: 0,
      script: 0,
      font: 0,
      other: 0,
    };

    for (const response of responses) {
      // Only count successful responses
      if (!response.ok()) continue;
      let contentLength = 0;
      const headers = response.headers();
      if (headers["content-length"]) {
        contentLength = parseInt(headers["content-length"], 10);
      } else {
        // Try to get the body size if no content-length (with a cap for large files)
        try {
          const buffer = await response.body();
          contentLength = buffer.length;
        } catch (e) {
          // Ignore if body can't be fetched (e.g., cached or opaque responses)
        }
      }
      if (contentLength) {
        totalBytes += contentLength;
        const type = response.request().resourceType();
        switch (type) {
          case "document":
            resourcesByType.document += contentLength;
            break;
          case "stylesheet":
            resourcesByType.stylesheet += contentLength;
            break;
          case "image":
            resourcesByType.image += contentLength;
            break;
          case "script":
            resourcesByType.script += contentLength;
            break;
          case "font":
            resourcesByType.font += contentLength;
            break;
          default:
            resourcesByType.other += contentLength;
        }
      }
    }

    console.log(`Total page weight: ${Math.round(totalBytes / 1024)} KB`);
    console.log("Resources by type (KB):");
    for (const [type, bytes] of Object.entries(resourcesByType)) {
      console.log(`- ${type}: ${Math.round(bytes / 1024)}`);
    }

    // Assertion on total page weight (adjust as needed)
    expect(totalBytes).toBeLessThan(15 * 1024 * 1024); // 15MB is very generous
    // Optionally assert on specific types
    // expect(resourcesByType.image).toBeLessThan(5 * 1024 * 1024);
  });
});
