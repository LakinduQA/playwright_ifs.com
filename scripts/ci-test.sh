#!/bin/bash
set -e

echo "Running CI tests..."

# Set CI environment variables
export CI=true

# Clean previous reports
rm -rf playwright-report/ test-results/

# Run tests with CI configuration
npx playwright test --reporter=html

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "All tests passed!"
else
    echo "Some tests failed. Check the report."
    exit 1
fi
