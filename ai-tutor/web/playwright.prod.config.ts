import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/prod",
  // 3 minutes: the 3-slide intro (welcome + EXPLAIN + DEMO + GUIDED) + first
  // teaching board each make real Sarvam TTS calls and can take 90-120s total
  // before #answerInput appears. Individual expect() assertions have their own
  // timeout, so this is the ceiling for the full test function.
  timeout: 180_000,
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
    launchOptions: {
      // In headless Chromium, AudioContext starts "suspended" and ctx.resume()
      // may never resolve without a real audio device + user gesture.
      // These flags allow AudioContext to run and fire onended on the virtual device.
      args: [
        "--autoplay-policy=no-user-gesture-required",
        "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
      ],
    },
  },
  reporter: [
    ["line"],
    ["json", { outputFile: "../../docs/vedic_math/playwright_prod/l1-results.json" }],
  ],
});

