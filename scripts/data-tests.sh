#!/bin/bash
set -e

echo "Running data-driven tests..."

# Run data-driven tests specifically
npx playwright test tests/data-driven.spec.js

echo "Data-driven tests completed!"
