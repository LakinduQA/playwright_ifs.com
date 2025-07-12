#!/bin/bash
set -e

echo "Starting complete test suite..."

# Clean previous reports
rm -rf playwright-report/ test-results/

# Run all tests
npm test

# Generate and open report
npm run report

echo "Test suite completed!"
