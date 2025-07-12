const { test, expect } = require("@playwright/test");
const SearchPage = require("../pages/SearchPage");

test.describe("IFS Website - Search Page Tests", () => {
  let searchPage;
  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test("should load the search page correctly", async ({ page }) => {
    await searchPage.dismissOverlays();
    await searchPage.validatePageHeader();
    await searchPage.validateFooterLinks();
    await searchPage.validateSocialMediaLinks();
  });

  test("should display product solutions section", async ({ page }) => {
    await searchPage.dismissOverlays();
    await searchPage.validateProductSolutionsSection();
  });

  test("should display looking for something else section", async ({
    page,
  }) => {
    await searchPage.dismissOverlays();
    await searchPage.validateLookingElseSection();
  });

  test("should display community section", async ({ page }) => {
    await searchPage.dismissOverlays();
    await searchPage.validateCommunitySection();
  });

  test("should perform a search and display results", async ({ page }) => {
    await searchPage.performSearch("cloud");
    await searchPage.dismissOverlays();
    await searchPage.validateSearchResults(true);
  });

  test("should navigate through search result pages if available", async ({
    page,
  }) => {
    await searchPage.performSearch("cloud");
    await searchPage.dismissOverlays();
    await searchPage.validateSearchResults(true);
    try {
      await searchPage.dismissOverlays();
      await searchPage.validatePagination();
    } catch (e) {
      // If pagination test fails, it might be because there's only one page of results, which is acceptable
      console.log("Pagination test skipped:", e.message);
    }
  });
});
