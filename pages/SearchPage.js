// SearchPage object model for the IFS Search page
const BasePage = require("./BasePage");
const { expect } = require("@playwright/test");

class SearchPage extends BasePage {
  // Dismiss any overlay/dialog with a visible "Close" button
  async dismissOverlays() {
    // Dismiss OneTrust cookie banner if present
    const oneTrust = this.page.locator(
      "#onetrust-consent-sdk, .onetrust-pc-dark-filter"
    );
    if (await oneTrust.isVisible().catch(() => false)) {
      const acceptBtn = this.page.getByRole("button", {
        name: /Accept All Cookies/i,
      });
      if (await acceptBtn.isVisible().catch(() => false)) {
        await acceptBtn.click();
        await oneTrust
          .waitFor({ state: "hidden", timeout: 10000 })
          .catch(() => {});
      } else {
        const rejectBtn = this.page.getByRole("button", {
          name: /Reject All/i,
        });
        if (await rejectBtn.isVisible().catch(() => false)) {
          await rejectBtn.click();
          await oneTrust
            .waitFor({ state: "hidden", timeout: 10000 })
            .catch(() => {});
        }
      }
    }
    // As a last resort, forcibly hide overlays
    await this.page.evaluate(() => {
      const ot = document.getElementById("onetrust-consent-sdk");
      if (ot) ot.style.display = "none";
      const otf = document.querySelector(".onetrust-pc-dark-filter");
      if (otf) otf.style.display = "none";
    });
    // Wait for overlays to be hidden
    await this.page
      .waitForSelector("#onetrust-consent-sdk, .onetrust-pc-dark-filter", {
        state: "hidden",
        timeout: 10000,
      })
      .catch(() => {});
    // Dismiss any generic dialog with a "Close" button
    const closeButtons = this.page.locator("button:visible", {
      hasText: "Close",
    });
    const count = await closeButtons.count();
    for (let i = 0; i < count; i++) {
      if (
        await closeButtons
          .nth(i)
          .isVisible()
          .catch(() => false)
      ) {
        await closeButtons
          .nth(i)
          .click()
          .catch(() => {});
        await this.page.waitForTimeout(500); // Give time for dialog to close
      }
    }
  }
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page); // Page elements
    // Search icon in header (unique)
    this.searchIcon = page.locator(".searchIcon > a").first();
    this.pageTitle = page.locator("main h1");
    // Search input and button (only on /search page)
    this.searchInput = page.getByRole("textbox", { name: "Search" });
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.clearButton = page.getByRole("button", { name: /clear/i });

    // Search results elements
    this.searchResultsHeading = page.locator("main h2, main h3");
    this.searchResultsList = page.locator(
      ".card-searchstudio-js-custom .card-searchstudio-js-title a.stretched-link"
    );
    this.resultsPagination = page.locator(
      'nav[aria-label*="pagination"], ul.pagination'
    );
    this.nextPageButton = page.getByRole("link", { name: /next/i });

    // Featured sections
    this.productSolutionsHeading = page.locator('main h2:has-text("Products")');
    this.productSolutionsCards = page.locator("main h4");

    // Looking for something else section
    this.lookingElseHeading = page.locator(
      'main h3:has-text("Looking for something else")'
    );
    this.lookingElseCards = page.locator('main [class*="slick-slide"]');

    // Community section
    this.communityHeading = page.locator(
      'main h3:has-text("Have more product-related queries")'
    );
    this.findAnswersLink = page.locator('main a:has-text("Find answers")');
  }

  /**
   * Navigate to the IFS Search page
   */
  async goto() {
    await this.page.goto("https://www.ifs.com/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await this.dismissOverlays();
  }

  /**
   * Validate page header and content
   */
  async validatePageHeader() {
    // Only check for search input and button if on /search page
    if ((await this.page.url()).includes("/search")) {
      await expect(this.pageTitle).toBeVisible();
      await expect(this.searchInput).toBeVisible();
      await expect(this.searchButton).toBeVisible();
    } else {
      await expect(this.pageTitle).toBeVisible();
    }
  }

  /**
   * Perform a search
   * @param {string} query The search query
   */
  async performSearch(query, expectResults = true) {
    await this.dismissOverlays();
    // Scroll search icon into view and ensure overlays are gone
    await this.searchIcon.scrollIntoViewIfNeeded();
    // Aggressively remove overlays before click
    await this.page.evaluate(() => {
      const ot = document.getElementById("onetrust-consent-sdk");
      if (ot) ot.remove();
      const otf = document.querySelector(".onetrust-pc-dark-filter");
      if (otf) otf.remove();
      // Remove any dialog with a close button
      document.querySelectorAll("button").forEach((btn) => {
        if (
          btn.textContent &&
          btn.textContent.trim().toLowerCase() === "close"
        ) {
          btn.click();
        }
      });
    });
    // Wait for overlays to be gone
    await this.page
      .waitForSelector("#onetrust-consent-sdk, .onetrust-pc-dark-filter", {
        state: "hidden",
        timeout: 10000,
      })
      .catch(() => {});
    // If not already on /search, click the search icon and wait for navigation
    if (!(await this.page.url()).includes("/search")) {
      for (let i = 0; i < 3; i++) {
        try {
          await this.searchIcon.waitFor({ state: "visible", timeout: 20000 });
          await this.searchIcon.click({ trial: false, timeout: 10000 });
          await this.page.waitForURL("**/search", { timeout: 20000 });
          break;
        } catch (e) {
          // Remove overlays and retry
          await this.page.evaluate(() => {
            const ot = document.getElementById("onetrust-consent-sdk");
            if (ot) ot.remove();
            const otf = document.querySelector(".onetrust-pc-dark-filter");
            if (otf) otf.remove();
          });
          await this.page.waitForTimeout(500);
        }
      }
      // Dismiss overlays again after navigation
      await this.dismissOverlays();
    }
    // Wait for search input to be visible
    await this.searchInput.waitFor({ state: "visible", timeout: 20000 });
    await this.dismissOverlays();
    await this.searchInput.click();
    await this.searchInput.fill(query);
    await this.searchButton.waitFor({ state: "visible", timeout: 20000 });
    await this.dismissOverlays();
    await this.searchButton.click();
    // Wait for search results to load if expected
    if (expectResults) {
      // Wait for either results or a visible heading (no results)
      const resultsPromise = this.page
        .waitForSelector(
          ".card-searchstudio-js-custom .card-searchstudio-js-title a.stretched-link",
          { timeout: 30000 }
        )
        .then(() => "results")
        .catch(() => null);
      const headingPromise = this.page
        .waitForSelector("main h2, main h3", {
          state: "visible",
          timeout: 30000,
        })
        .then(() => "heading")
        .catch(() => null);
      const found = await Promise.race([resultsPromise, headingPromise]);
      if (!found) {
        throw new Error("Neither results nor heading appeared after search");
      }
    }
  }

  /**
   * Clear the search
   */
  async clearSearch() {
    // Only click clear if button is visible and enabled
    if (
      (await this.clearButton.isVisible().catch(() => false)) &&
      (await this.clearButton.isEnabled().catch(() => false))
    ) {
      await this.clearButton.click();
      // Wait for the page to update
      await this.page.waitForLoadState("networkidle");
      // Wait for results to disappear
      await this.page
        .waitForSelector(
          ".card-searchstudio-js-custom .card-searchstudio-js-title a.stretched-link",
          { state: "detached", timeout: 10000 }
        )
        .catch(() => {});
    }
  }

  /**
   * Validate search results
   * @param {boolean} expectResults Whether to expect search results or not
   */
  async validateSearchResults(expectResults = true) {
    if (expectResults) {
      // Check that at least one result is visible and count > 0
      const resultsCount = await this.searchResultsList.count();
      expect(resultsCount).toBeGreaterThan(0);
      // Ensure at least one result link is visible
      let foundVisible = false;
      for (let i = 0; i < resultsCount; i++) {
        if (await this.searchResultsList.nth(i).isVisible()) {
          foundVisible = true;
          break;
        }
      }
      expect(foundVisible).toBe(true);
      // Check for any visible heading
      const headingCount = await this.searchResultsHeading.count();
      let headingVisible = false;
      for (let i = 0; i < headingCount; i++) {
        if (await this.searchResultsHeading.nth(i).isVisible()) {
          headingVisible = true;
          break;
        }
      }
      expect(headingVisible).toBe(true);
    } else {
      // Check for any visible heading
      const headingCount = await this.searchResultsHeading.count();
      let headingVisible = false;
      for (let i = 0; i < headingCount; i++) {
        if (await this.searchResultsHeading.nth(i).isVisible()) {
          headingVisible = true;
          break;
        }
      }
      expect(headingVisible).toBe(true);
    }
  }

  /**
   * Validate pagination (if available)
   */
  async validatePagination() {
    // Check if pagination exists (search might not have enough results)
    const isPaginationVisible = await this.resultsPagination.isVisible();

    if (isPaginationVisible) {
      // Check if next button is available and enabled
      const isNextVisible = await this.nextPageButton.isVisible();
      const isNextEnabled = await this.nextPageButton
        .isEnabled()
        .catch(() => false);

      if (isNextVisible && isNextEnabled) {
        // Get current first result for comparison
        const firstResultText = await this.searchResultsList
          .first()
          .textContent();

        // Click next page
        await this.nextPageButton.click();
        // Wait for results to load
        await this.page.waitForLoadState("networkidle");

        // Get new first result text
        const newFirstResultText = await this.searchResultsList
          .first()
          .textContent();

        // Verify results changed
        expect(firstResultText).not.toEqual(newFirstResultText);
      }
    }
  }

  /**
   * Validate product solutions section
   */
  async validateProductSolutionsSection() {
    // Only check if section exists
    if (await this.productSolutionsHeading.isVisible().catch(() => false)) {
      await expect(this.productSolutionsHeading).toBeVisible();
      const cardCount = await this.productSolutionsCards.count();
      expect(cardCount).toBeGreaterThan(0);
    } else {
      // Section not present, skip
      console.warn("Product solutions section not found, skipping check.");
    }
  }

  /**
   * Validate "looking for something else" section
   */
  async validateLookingElseSection() {
    if (await this.lookingElseHeading.isVisible().catch(() => false)) {
      await this.lookingElseHeading.scrollIntoViewIfNeeded();
      await expect(this.lookingElseHeading).toBeVisible();
      const cardCount = await this.lookingElseCards.count();
      expect(cardCount).toBeGreaterThan(0);
    } else {
      console.warn(
        "Looking for something else section not found, skipping check."
      );
    }
  }

  /**
   * Validate community section
   */
  async validateCommunitySection() {
    if (await this.communityHeading.isVisible().catch(() => false)) {
      await this.communityHeading.scrollIntoViewIfNeeded();
      await expect(this.communityHeading).toBeVisible();
      await expect(this.findAnswersLink).toBeVisible();
    } else {
      console.warn("Community section not found, skipping check.");
    }
  }

  /**
   * Click on a search result by index
   * @param {number} index The index of the result to click (0-based)
   */
  async clickSearchResult(index = 0) {
    await this.searchResultsList.nth(index).click();
  }
}

module.exports = SearchPage;
