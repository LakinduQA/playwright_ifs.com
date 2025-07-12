#!/bin/bash

echo "Performing system health check..."

# Check Node.js version
echo "Node.js version: $(node --version)"

# Check npm version
echo "npm version: $(npm --version)"

# Check Playwright installation
echo "Playwright version:"
npx playwright --version

# Check available browsers
echo "Checking browser installations..."
npx playwright install --dry-run

# Test basic functionality with a quick smoke test
echo "Running smoke test..."
npx playwright test tests/homepage.spec.js

echo "Health check completed!"
