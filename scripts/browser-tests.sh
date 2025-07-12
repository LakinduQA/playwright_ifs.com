#!/bin/bash
set -e

echo "Running browser compatibility tests..."

# Run tests on chromium
echo "Testing on Chromium..."
npm run test:chrome

# Run tests on all browsers (if needed)
echo "Testing on all browsers..."
npx playwright test

echo "Browser compatibility tests completed!"
