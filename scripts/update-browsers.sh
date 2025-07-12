#!/bin/bash

echo "Updating Playwright and dependencies..."

# Update Playwright to latest version
npm update @playwright/test

# Install latest browsers
npx playwright install --with-deps

# Verify the update
echo "Updated to Playwright version:"
npx playwright --version

echo "Update completed!"
