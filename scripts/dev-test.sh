#!/bin/bash

echo "Running development tests with browser visible..."

# Clean previous reports
rm -rf playwright-report/ test-results/

# Run tests in headed mode for debugging
npm run test:headed

# Automatically open report if tests fail
if [ $? -ne 0 ]; then
    echo "Opening test report for debugging..."
    npm run report
fi
