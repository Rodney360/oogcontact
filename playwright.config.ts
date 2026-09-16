import { existsSync } from 'node:fs'

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
/**
 * In deze cloudomgeving staat Chromium al klaar op een vaste plek, maar met een
 * ander versienummer dan Playwright zelf zou ophalen. Door hem hier aan te
 * wijzen hoeft er niets gedownload te worden. Lokaal en in de CI is dit pad er
 * niet en pakt Playwright gewoon zijn eigen browser.
 */
const VOORGEINSTALLEERD = '/opt/pw-browsers/chromium'
const browser = existsSync(VOORGEINSTALLEERD) ? { launchOptions: { executablePath: VOORGEINSTALLEERD } } : {}

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
    { name: 'desktop', use: { ...devices['Desktop Chrome'], ...browser, viewport: { width: 1440, height: 900 } } },
    { name: 'mobiel', use: { ...devices['Pixel 7'], ...browser } },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    // Let op: de snelheidsbegrenzer van de formulieren telt in het geheugen van
    // de server (5 inzendingen per 10 minuten per bezoeker). Hergebruik je
    // lokaal steeds dezelfde server, dan stapelen die tellingen zich op over
    // meerdere testruns en krijg je een terechte 429. Herstart de server dan
    // even. In de CI start er altijd een verse.
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
