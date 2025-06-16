const { test, expect } = require("@playwright/test");

test.describe("Test imports", () => {
  test("should import all page objects", async ({}) => {
    // This test just checks that all imports work correctly
    try {
      const BasePage = require("../pages/BasePage");
      const HomePage = require("../pages/HomePage");
      const SearchPage = require("../pages/SearchPage");
      const IndustriesPage = require("../pages/IndustriesPage");
      const SolutionsPage = require("../pages/SolutionsPage");
      const ContactPage = require("../pages/ContactPage");
      const LanguageSwitcherPage = require("../pages/LanguageSwitcherPage");

      expect(true).toBeTruthy();
    } catch (error) {
      console.error("Import error:", error);
      expect(false, `Import failed: ${error.message}`).toBeTruthy();
    }
  });
});
