/**
 * Twee wegen terug: het logo linksboven en het zwevende knopje linksonder.
 *
 * Buiten de homepage brengen ze je naar de homepage. Sta je al op de
 * homepage, dan brengen ze je naar de bovenkant van de pagina - dat deed het
 * logo eerst niet, en dan gebeurde er bij een klik dus helemaal niets.
 *
 * Het zwevende knopje is er alleen vanaf tablet. Op een telefoon staat onderin
 * al een vaste balk, en dan kwam dit knopje telkens over een knop of over een
 * regel tekst te liggen. Het logo doet daar hetzelfde werk.
 */

import { test, expect } from '@playwright/test'

const SUBPAGINAS = ['/contactlenzen/', '/over-ons/', '/contact/', '/nieuws/']

/** Een eind naar beneden, zoals iemand die de pagina doorleest. */
async function scrollOmlaag(page: import('@playwright/test').Page, tot = 3000) {
  await page.evaluate((y) => window.scrollTo(0, y), tot)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(tot / 2)
}

test('bovenaan de homepage staat er geen knopje linksonder', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Naar de homepage', exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Naar boven', exact: true })).toHaveCount(0)
})

test('het logo brengt je op de homepage terug naar boven', async ({ page }) => {
  await page.goto('/')
  await scrollOmlaag(page)

  const logo = page.locator('header a[aria-label^="Oogcontact"]')
  await expect(logo).toHaveAttribute('aria-label', 'Oogcontact bij Gerard, terug naar boven')
  await logo.click()

  await expect.poll(() => page.evaluate(() => window.scrollY), {
    message: 'na een klik op het logo hoor je bovenaan te staan',
    timeout: 5000,
  }).toBeLessThan(5)
  expect(new URL(page.url()).pathname).toBe('/')
})

test('het knopje linksonder wordt op de homepage een pijl naar boven', async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), 'het knopje is er alleen vanaf tablet')

  await page.goto('/')
  await scrollOmlaag(page)

  const naarBoven = page.getByRole('link', { name: 'Naar boven', exact: true })
  await expect(naarBoven).toBeVisible()
  await naarBoven.click()

  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBeLessThan(5)
  // En daarna is hij weer weg, want je staat al boven.
  await expect(naarBoven).toBeHidden()
})

test('de pijl brengt je vanaf elke pagina naar de homepage', async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), 'het knopje is er alleen vanaf tablet')

  for (const pad of SUBPAGINAS) {
    await page.goto(pad)
    const pijl = page.getByRole('link', { name: 'Naar de homepage', exact: true })
    await expect(pijl, `${pad} hoort de pijl te tonen`).toBeVisible()
    await pijl.click()
    await page.waitForURL((u) => u.pathname === '/')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5)
  }
})

test('het logo brengt je vanaf elke pagina naar de homepage', async ({ page }) => {
  for (const pad of SUBPAGINAS) {
    await page.goto(pad)
    await scrollOmlaag(page, 1200)
    await page.locator('header a[aria-label$="naar de homepage"]').click()
    await page.waitForURL((u) => u.pathname === '/')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5)
  }
})

test('de pijl blijft staan tijdens het scrollen', async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), 'het knopje is er alleen vanaf tablet')

  await page.goto('/contactlenzen/')
  const pijl = page.getByRole('link', { name: 'Naar de homepage', exact: true })
  const voor = await pijl.boundingBox()
  if (!voor) throw new Error('de pijl heeft geen afmetingen')

  // Groot genoeg om aan te tikken (WCAG 2.2: 44 bij 44).
  expect(voor.width).toBeGreaterThanOrEqual(44)
  expect(voor.height).toBeGreaterThanOrEqual(44)

  await page.mouse.wheel(0, 1200)
  await page.waitForTimeout(700)
  await expect(pijl, 'de pijl hoort te blijven zweven').toBeVisible()
  const na = await pijl.boundingBox()
  const scherm = page.viewportSize()
  if (!na || !scherm) throw new Error('geen afmetingen na het scrollen')
  // Hij hoort in de onderste helft van het scherm te blijven staan. Op een
  // nagebootste telefoon schuift het zichtbare venster een paar pixels, dus
  // wordt er niet op de pixel nauwkeurig gemeten.
  expect(na.y).toBeGreaterThan(scherm.height / 2)
  expect(na.y + na.height).toBeLessThanOrEqual(scherm.height)
})

test('op een telefoon staat het zwevende knopje er niet', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'alleen op een telefoon')

  for (const pad of ['/', '/contactlenzen/']) {
    await page.goto(pad)
    await page.evaluate(() => window.scrollTo(0, 3000))
    await page.waitForTimeout(400)
    await expect(page.getByRole('link', { name: 'Naar de homepage', exact: true })).toBeHidden()
    await expect(page.getByRole('link', { name: 'Naar boven', exact: true })).toBeHidden()
  }

  // Het logo doet daar het werk, en dat staat er wel.
  await expect(page.locator('header a[aria-label^="Oogcontact"]')).toBeVisible()
})
