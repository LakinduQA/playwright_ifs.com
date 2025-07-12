#!/bin/bash
set -e

echo "Running visual regression tests..."

# Run visual tests
npx playwright test tests/visual.spec.js

echo "Visual regression tests completed!"
