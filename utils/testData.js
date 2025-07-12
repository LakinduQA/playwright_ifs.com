/**
 * Test data for the IFS website tests
 */

// Industry data for testing industry pages
const industries = [
  {
    name: "Manufacturing",
    url: "/industries/manufacturing",
    expectedHeading: "Manufacturing",
  },
  {
    name: "Construction and Engineering",
    url: "/industries/construction-and-engineering",
    expectedHeading: "Construction, Engineering, Shipbuilding & Maritime",
  },
  {
    name: "Aerospace & Defense",
    url: "/industries/aerospace-and-defense",
    expectedHeading: "Aerospace and Defense Software",
  },
  {
    name: "Energy Utilities and Resources",
    url: "/industries/energy-utilities-and-resources",
    expectedHeading: "Enterprise Software for Energy, Utilities and Resources",
  },
  {
    name: "Service Industries",
    url: "/industries/service-industries",
    expectedHeading: "Service Industry Software",
  },
  {
    name: "Telecommunications",
    url: "/industries/telecommunications",
    expectedHeading: "Telecommunications",
  },
];

// Solution data for testing solution pages
const solutions = [
  {
    name: "Enterprise Resource Planning",
    url: "/solutions/enterprise-resource-planning",
    expectedHeading: "Enterprise Resource Planning",
  },
  {
    name: "Enterprise Asset Management",
    url: "/solutions/enterprise-asset-management",
    expectedHeading: "Enterprise Asset Management",
  },

  {
    name: "Enterprise Service Management",
    url: "/solutions/enterprise-service-management",
    expectedHeading: "Enterprise Service Management",
  },
  {
    name: "Energy & Resources Software",
    url: "/solutions/energy-and-resources-software",
    expectedHeading: "IFS Energy and Resources Software",
  },
];

// Search queries for testing search functionality
const searchQueries = [
  {
    query: "cloud",
    expectedResults: true,
    expectedMinResults: 3,
  },
  {
    query: "ERP",
    expectedResults: true,
    expectedMinResults: 2,
  },
  {
    query: "sustainability",
    expectedResults: true,
    expectedMinResults: 1,
  },
  {
    query: "manufacturing",
    expectedResults: true,
    expectedMinResults: 2,
  },
];

// Form data for testing contact forms
const contactFormData = {
  validData: {
    firstName: "Test",
    lastName: "User",
    email: "test.user@example.com",
    company: "Test Company",
    phone: "1234567890",
    country: "United States",
    message: "This is a test message from a Playwright test",
  },
  invalidData: {
    firstName: "",
    lastName: "",
    email: "invalid-email",
    company: "",
    phone: "abc",
    country: "",
    message: "",
  },
};

module.exports = {
  industries,
  solutions,
  searchQueries,
  contactFormData,
};
