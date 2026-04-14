// playwright.config.js
// PixelsSuite SQA Assignment - Playwright Configuration

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // Test file location
  testDir: '.',

  // Run tests in parallel (set to false to run one at a time - easier for beginners)
  workers: 1,

  // Retry failed tests once
  retries: 1,

  // Timeout per test (60 seconds)
  timeout: 60000,

  // Reporter: generates HTML report you can open in browser
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']  // also shows results in terminal
  ],

  use: {
    // Always run in headed mode so you can see the browser
    headless: false,

    // Wait for 500ms between actions (easier to follow)
    actionTimeout: 15000,

    // Take screenshot on test failure automatically
    screenshot: 'on',

    // Record video on failure
    video: 'retain-on-failure',

    // Browser viewport size
    viewport: { width: 1280, height: 720 },

    // Base URL (you can use page.goto('/') instead of full URL)
    baseURL: 'https://www.pixelssuite.com',
  },

  // Screenshot output directory
  outputDir: 'screenshots',

  // Projects: run on Chromium only (easiest for beginners)
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: false,
      },
    },
  ],
});
