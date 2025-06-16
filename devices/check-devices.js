// A simple script to check what's in the devices object
const { devices } = require("@playwright/test");
console.log("Devices available:", Object.keys(devices));
console.log("iPhone 13:", devices["iPhone 13"]);
console.log("iPad Air:", devices["iPad Air"]);
