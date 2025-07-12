/**
 * Utility functions for visual testing and screenshot comparison
 */
const fs = require("fs");
const path = require("path");

/**
 * Compares the current state of an element with a baseline screenshot
 * Note: This is a simplified example - real visual testing would use a dedicated
 * library like pixelmatch or resemble.js for accurate comparison
 *
 * @param {import('@playwright/test').Page} page - The Playwright page
 * @param {import('@playwright/test').Locator} elementLocator - The element to compare
 * @param {string} screenshotName - Name for the screenshot file
 * @param {Object} options - Additional options
 * @param {boolean} options.updateBaseline - Whether to update the baseline image
 */
async function compareElementWithBaseline(
  page,
  elementLocator,
  screenshotName,
  options = {}
) {
  const screenshotsDir = path.join(__dirname, "../screenshots");
  const baselineDir = path.join(screenshotsDir, "baseline");
  const actualDir = path.join(screenshotsDir, "actual");
  const diffDir = path.join(screenshotsDir, "diff");

  // Ensure directories exist
  [screenshotsDir, baselineDir, actualDir, diffDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Screenshot file paths
  const baselinePath = path.join(baselineDir, `${screenshotName}.png`);
  const actualPath = path.join(actualDir, `${screenshotName}.png`);

  // Take screenshot of the element
  await elementLocator.screenshot({ path: actualPath });

  // If updating baseline or baseline doesn't exist, save it
  if (options.updateBaseline || !fs.existsSync(baselinePath)) {
    fs.copyFileSync(actualPath, baselinePath);
    return true;
  }

  // In a real implementation, here we would:
  // 1. Load both images and compare them (e.g., using pixelmatch)
  // 2. Calculate difference percentage
  // 3. Save diff image if needed
  // 4. Return comparison result

  // For this example, we're just checking if the baseline exists
  return fs.existsSync(baselinePath);
}

/**
 * Takes full page screenshot and saves it with the given name
 *
 * @param {import('@playwright/test').Page} page - The Playwright page
 * @param {string} screenshotName - Name for the screenshot file
 */
async function takeFullPageScreenshot(page, screenshotName) {
  const screenshotsDir = path.join(__dirname, "../screenshots");

  // Ensure directory exists
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  // Take full page screenshot
  await page.screenshot({
    path: path.join(screenshotsDir, `${screenshotName}.png`),
    fullPage: true,
  });
}

module.exports = {
  compareElementWithBaseline,
  takeFullPageScreenshot,
};
