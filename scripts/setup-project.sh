#!/bin/bash
set -e

echo "Setting up Playwright project..."

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Verify installation
npx playwright --version

echo "Project setup complete!"
