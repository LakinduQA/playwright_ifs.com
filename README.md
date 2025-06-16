# IFS.com Playwright Test Suite

This project is an automated end-to-end UI test suite for the public website [https://www.ifs.com/](https://www.ifs.com/), built using [Playwright](https://playwright.dev/). It follows best practices for robust, maintainable, and scalable web testing.

## Features

- **Page Object Model (POM):** All page interactions are encapsulated in the `pages/` directory for reusability and clarity.
- **Comprehensive Coverage:** Tests cover navigation, footer, contact forms, search, solutions, industries, language switcher, accessibility, privacy, performance, and responsive design.
- **Visual Regression:** Utilities for screenshot comparison and visual testing.
- **Accessibility:** Automated checks for headings, alt text, and ARIA attributes.
- **Performance:** Basic page load and resource size checks.
- **Data-driven:** Uses test data from `utils/testData.js` for parameterized tests.
- **CI/CD Ready:** Includes scripts and Playwright config for easy integration with GitHub Actions or other CI systems.
- **HTML Reports:** Generates detailed HTML reports for each test run.

## Project Structure

```
.
├── pages/                # Page Object Model classes for each major page/feature
│   ├── BasePage.js
│   ├── ContactPage.js
│   ├── HomePage.js
│   ├── IndustriesPage.js
│   ├── LanguageSwitcherPage.js
│   ├── SearchPage.js
│   └── SolutionsPage.js
├── tests/                # All Playwright test scripts
│   ├── accessibility.spec.js
│   ├── contact.spec.js
│   ├── data-driven.spec.js
│   ├── homepage.spec.js
│   ├── industries.spec.js
│   ├── language.spec.js
│   ├── performance.spec.js
│   ├── privacy.spec.js
│   ├── responsive.spec.js
│   ├── search.spec.js
│   ├── solutions.spec.js
│   ├── test-imports.spec.js
│   └── visual.spec.js
├── utils/                # Test data and visual testing helpers
│   ├── testData.js
│   └── visualTesting.js
├── playwright.config.js  # Playwright configuration (projects, reporters, etc.)
├── package.json          # NPM scripts and dependencies
├── results/              # Test reports (HTML, screenshots, etc.)
│   └── html-report/
└── playwright-report/    # Latest Playwright HTML report
```

## Key Test Areas

- **Navigation & Footer:** Ensures all main and footer links work and are visible.
- **Contact Forms:** Validates form fields, submission, and error handling.
- **Search:** Checks search functionality and result accuracy.
- **Solutions & Industries:** Verifies solution/industry overviews and navigation.
- **Language Switcher:** Tests language selection (if available).
- **Accessibility:** Checks for proper heading structure, alt text, and ARIA.
- **Privacy & Consent:** Validates cookie banners, privacy policy, and preference management.
- **Performance:** Measures page load and resource sizes.
- **Responsive Design:** Tests on mobile and desktop viewports.
- **Visual Regression:** Screenshots and comparison for UI consistency.

## How to Run

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run all tests:**

   ```bash
   npx playwright test
   ```

3. **Run a specific test:**

   ```bash
   npx playwright test tests/privacy.spec.js
   ```

4. **View HTML report:**

   ```bash
   npx playwright show-report
   ```

## Test Reports

- The `test-results-png` folder contains screenshots of the current test results that have passed. These images provide a visual reference of the reports and can be useful for documentation or sharing test outcomes.

## Flakiness Notice

Automated UI tests can sometimes be flaky, meaning they may pass or fail inconsistently. Common causes include:

- **UI changes:** Updates to the website's structure, selectors, or content can break tests.
- **Network issues:** Slow or unstable network connections can cause timeouts or loading failures.
- **Dynamic content:** Elements that load asynchronously or are affected by cookies, overlays, or popups.
- **Timing issues:** Animations, delayed rendering, or third-party scripts can affect test stability.
