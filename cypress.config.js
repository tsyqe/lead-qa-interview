const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  env: {
      mainUrl: 'http://localhost:3000',
      apiUrl: 'http://localhost:4000'
    }
  },
});
