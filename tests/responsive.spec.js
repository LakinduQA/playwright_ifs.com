const { test, expect, devices } = require("@playwright/test");
const HomePage = require("../pages/HomePage");
const ContactPage = require("../pages/ContactPage");

test.describe("IFS Website - Responsive Design Tests", () => {
  test.setTimeout(60000);

  // Test on mobile viewport
  test.describe("Mobile Viewport", () => {
    test.use({
      viewport: devices["iPhone 13"].viewport,
    });

    test("should display mobile menu on small screen", async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();
      await homePage.dismissOverlays();
      await expect(homePage.mobileMenu).toBeVisible({ timeout: 10000 });
      await homePage.openMobileMenu();
      // Debug: print menu container HTML if nav links not found
      const navLinksVisible = await page
        .locator(".ma5menu__panel--active a:not(.ma5menu__btn--enter):visible")
        .first()
        .isVisible()
        .catch(() => false);
      if (!navLinksVisible) {
        const menuHtml = await page
          .locator(".ma5menu__panel--active")
          .first()
          .evaluate((el) => el.outerHTML)
          .catch(() => "not found");
        console.log("DEBUG: Menu HTML after open:", menuHtml);
      }
      await expect(
        page
          .locator(
            ".ma5menu__panel--active a:not(.ma5menu__btn--enter):visible"
          )
          .first()
      ).toBeVisible({ timeout: 10000 });
    });

    test("should have usable contact form on mobile", async ({ page }) => {
      const contactPage = new ContactPage(page);
      await contactPage.goto();
      await contactPage.dismissOverlays();
      await expect(contactPage.pageTitle).toBeVisible();
      await expect(contactPage.firstNameField).toBeVisible();
    });
  });

  // Test on tablet viewport
  test.describe("Tablet Viewport", () => {
    test.use({
      viewport: devices["iPad Pro 11"].viewport,
    });

    test("should display tablet-optimized layout", async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();
      await homePage.dismissOverlays();
      await homePage.validateHeroSection();
      await homePage.validateNavigationTabs();
    });
  });

  // Test on large desktop viewport
  test.describe("Large Desktop Viewport", () => {
    test.use({
      viewport: { width: 1920, height: 1080 },
    });

    test("should optimize layout for large screens", async ({ page }) => {
      const homePage = new HomePage(page);
      await homePage.goto();
      await homePage.dismissOverlays();
      await homePage.validateHeroSection();
      // Scroll footer into view before checking for links
      const footer = page.locator("footer");
      await footer.scrollIntoViewIfNeeded();
      // Relax selector: look for any link under Industries section
      const industriesLink = page
        .locator(
          'footer h4:has-text("Industries") ~ ul a, footer h4:has-text("Industries") + ul a, footer h4:has-text("Industries")'
        )
        .locator("xpath=following-sibling::ul[1]//a")
        .first();
      const footerLinkVisible = await industriesLink
        .isVisible()
        .catch(() => false);
      if (!footerLinkVisible) {
        const footerHtml = await footer
          .first()
          .evaluate((el) => el.outerHTML)
          .catch(() => "not found");
        console.log("DEBUG: Footer HTML:", footerHtml);
      }
      await expect(industriesLink).toBeVisible({ timeout: 10000 });
      await homePage.validateFooterLinks();
    });
  });

  // Test viewport transitions
  test("should adapt when viewport size changes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.dismissOverlays();
    await expect(homePage.mobileMenu).toBeVisible({ timeout: 10000 });
    // Open mobile menu and check nav links
    await homePage.openMobileMenu();
    await expect(
      page
        .locator(".ma5menu__panel--active a:not(.ma5menu__btn--enter):visible")
        .first()
    ).toBeVisible({ timeout: 10000 });
    // Resize to desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    // Wait for nav links to hide (menu closes)
    await homePage.closeMobileMenu();
    await expect(
      page
        .locator(".ma5menu__panel--active a:not(.ma5menu__btn--enter):visible")
        .first()
    ).not.toBeVisible({ timeout: 10000 });
  });
});
