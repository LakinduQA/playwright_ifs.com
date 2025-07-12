#!/bin/bash
set -e

echo "Running responsive design tests across all viewports..."

# Run responsive tests
npm run test:responsive

echo "Responsive design tests completed!"
