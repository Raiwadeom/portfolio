import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests for the main flows. Run with `npm run test:e2e`.
 * Uses the dev server on :3000 (starts one if none is running) and the
 * Chrome already installed on this machine, so no browser download.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  fullyParallel: true,
  /* the dev server compiles pages on first visit; more at once swamps it */
  workers: 2,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
