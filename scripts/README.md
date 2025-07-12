# Scripts Directory

This directory contains shell scripts to help manage and run your Playwright tests efficiently in a Linux environment.

## Available Scripts

### Project Setup
- **setup-project.sh** - Initial project setup with dependencies and browser installation
- **update-browsers.sh** - Update Playwright and browser installations

### Test Execution
- **run-all-tests.sh** - Execute complete test suite with cleanup and reporting
- **run-specific-test.sh** - Run individual test files (usage: `./scripts/run-specific-test.sh homepage`)
- **dev-test.sh** - Development mode testing with visible browser
- **ci-test.sh** - CI-optimized test execution

### Specialized Testing
- **compliance-tests.sh** - Run accessibility and privacy tests
- **responsive-tests.sh** - Test responsive design across viewports
- **performance-test.sh** - Execute performance testing
- **browser-tests.sh** - Cross-browser compatibility testing
- **visual-tests.sh** - Visual regression testing
- **data-tests.sh** - Data-driven testing

### Maintenance
- **cleanup.sh** - Clean up test artifacts and cache
- **health-check.sh** - System health verification and smoke test

## Usage

All scripts are now integrated into package.json and can be run using npm commands:

### Project Setup & Maintenance
```bash
npm run setup          # Initial project setup
npm run health         # System health check
npm run update:browsers # Update Playwright browsers
npm run cleanup        # Clean up test artifacts
```

### Test Execution
```bash
npm run test:all       # Complete test suite
npm run test:dev       # Development mode (visible browser)
npm run test:ci        # CI-optimized testing
```

### Specialized Testing
```bash
npm run test:compliance      # Accessibility & privacy tests
npm run test:responsive-full # Responsive design tests
npm run test:browsers        # Cross-browser compatibility
npm run test:visual          # Visual regression tests
npm run test:data           # Data-driven tests
npm run test:perf           # Performance tests
```

### Direct Script Execution (Alternative)
You can still run scripts directly if needed:
```bash
./scripts/setup-project.sh
./scripts/run-specific-test.sh homepage
```

### View All Available Commands
```bash
npm run  # Shows all available npm scripts
```
