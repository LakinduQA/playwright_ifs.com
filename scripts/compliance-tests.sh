#!/bin/bash
set -e

echo "Running accessibility and privacy compliance tests..."

# Run accessibility tests
echo "Running accessibility tests..."
npm run test:accessibility

# Run privacy tests 
echo "Running privacy tests..."
npm run test:privacy

echo "Compliance tests completed!"
