#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./scripts/run-specific-test.sh <test-name>"
    echo "Available tests:"
    echo "  homepage"
    echo "  search"
    echo "  accessibility"
    echo "  responsive"
    echo "  language"
    echo "  privacy"
    echo "  performance"
    echo "  contact"
    echo "  industries"
    echo "  solutions"
    echo "  visual"
    echo "  data-driven"
    exit 1
fi

echo "Running $1 tests..."
npm run "test:$1"

if [ $? -ne 0 ]; then
    echo "Test failed. Opening report for debugging..."
    npm run report
fi
