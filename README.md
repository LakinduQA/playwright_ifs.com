# IFS.com Playwright Test Suite

[![Playwright](https://img.shields.io/badge/Playwright-1.49-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-13%20Suites-success)](tests/)

Automated end-to-end test suite for [ifs.com](https://www.ifs.com/) using Playwright with Page Object Model architecture.

## Features

- **Cross-Browser Testing** — Chromium, Firefox, and WebKit
- **Page Object Model** — Maintainable and reusable test components
- **Comprehensive Coverage** — Accessibility, performance, visual regression, responsive design
- **CI/CD Ready** — GitHub Actions workflow with browser caching
- **AI-Enhanced** — Playwright MCP integration for faster test development

## Quick Start

```bash
# Clone and install
git clone https://github.com/LakinduQA/playwright_ifs.com.git
cd playwright_ifs.com
npm install
npx playwright install

# Run tests
npm test                    # All tests
npm run test:headed         # With browser UI
npm run test:chrome         # Chromium only
```

## Project Structure

```
├── pages/              # Page Object Models
├── tests/              # Test specifications
├── scripts/            # Automation scripts (Linux/WSL)
├── utils/              # Test utilities and data
└── playwright.config.js
```

## Available Test Suites

| Command                      | Description         |
| ---------------------------- | ------------------- |
| `npm test`                   | Run all tests       |
| `npm run test:homepage`      | Homepage tests      |
| `npm run test:accessibility` | WCAG compliance     |
| `npm run test:performance`   | Performance metrics |
| `npm run test:responsive`    | Responsive design   |
| `npm run test:visual`        | Visual regression   |
| `npm run test:browsers`      | Cross-browser       |

## Test Coverage

- **Functional** — Navigation, forms, search, content validation
- **Accessibility** — WCAG 2.1 compliance, ARIA validation
- **Performance** — Core Web Vitals, load time metrics
- **Visual** — Screenshot comparison, UI consistency
- **Responsive** — Mobile, tablet, desktop viewports

## Reports

```bash
npm run report          # Open HTML report
npm run cleanup         # Clean test artifacts
```

## Configuration

Key settings in `playwright.config.js`:

- Parallel execution with optimized workers
- Retry logic for flaky tests
- HTML reporting with trace viewer
- Multi-browser project configuration

## Note on Live Site Testing

Tests run against the live ifs.com website. Some intermittent failures are expected due to:

- Cookie consent overlays
- Dynamic content loading
- Network variability

A 60-80% pass rate against a live website is normal.

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/enhancement`
3. Run tests: `npm test`
4. Commit: `git commit -m "feat: add enhancement"`
5. Push and create Pull Request

## License

[ISC](LICENSE)

---
