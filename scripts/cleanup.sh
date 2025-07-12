#!/bin/bash

echo "Cleaning up project artifacts..."

# Remove test artifacts
rm -rf playwright-report/
rm -rf test-results/
rm -rf test-results-png/

# Clean auth folder if it exists
if [ -d "auth" ]; then
    rm -rf auth/
fi

# Clear npm cache
npm cache clean --force

echo "Cleanup completed!"
