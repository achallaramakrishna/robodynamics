import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/prod",
  timeout: 60_000,
  expect: {
    timeout: 20_000,
  },
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "https://robodynamics.in",
    headless: true,
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    video: "off",
    screenshot: "only-on-failure",
  },
  reporter: [
    ["line"],
    ["json", { outputFile: "../../docs/vedic_math/playwright_prod/l1-results.json" }],
  ],
});

