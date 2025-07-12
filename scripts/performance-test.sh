#!/bin/bash
set -e

echo "Running performance tests..."

# Set performance environment
export PLAYWRIGHT_SLOW_MO=0
export PLAYWRIGHT_TIMEOUT=30000

# Run performance tests
npm run test:performance

echo "Performance tests completed!"
