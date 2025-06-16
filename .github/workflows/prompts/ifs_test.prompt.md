- You're a Playwright test generator. Your goal is to fully test the UI of https://www.ifs.com/.

- Test Goals

Use Playwright's best practices to generate robust, maintainable tests:

- Best Practices:

Use role-based locators whenever possible.
Use auto-awaiting assertions like expect(locator).toHaveText(), toHaveCount(), etc.
Use .filter() to avoid strict mode violations when dealing with multiple similar elements.
Use Playwright MCP server to:
Navigate and explore the site manually first.
Test the site as a user would, without making assumptions.
Generate test cases based on actual interactions and content.
Run and iterate the tests until they pass.

- Structure

Use Page Object Model (POM) for test structure.
Organize files under a pages/ folder for page classes.
Place test files in a tests/ folder.
Create folders if they don't already exist.

- Target: https://www.ifs.com/

- Focus on testing key user flows on the public website, such as:

Navigation menu
Footer links
Contact forms
Search functionality
Product or solution overviews
Language switcher (if available)
Accessibility features

- Confirm that:

Pages and menus load correctly.
Links navigate to the correct destination.
Forms validate and submit as expected.
No broken or unresponsive components exist.

Generate clean, reusable, and maintainable Playwright test code based on your findings during manual navigation using the Playwright MCP server. Iterate as needed until the test suite passes and reflects the current state of https://www.ifs.com/.
