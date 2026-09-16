import { defineConfig, devices } from '@playwright/test'

/**
 * De browsertests.
 *
 *   npm run test:e2e
 *
 * Playwright start zelf de site op (de gebouwde versie, zoals hij live ook
 * draait) en sluit hem daarna weer af. Er zijn geen API-sleutels nodig: alles
 * draait dan in testmodus.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['html'], ['list']] : 'list',

  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'nl-NL',
    timezoneId: 'Europe/Amsterdam',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobiel', use: { ...devices['Pixel 7'] } },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
