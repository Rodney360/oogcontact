/**
 * Twee wegen terug naar de homepage: het logo linksboven en de zwevende pijl
 * linksonder. Allebei moeten ze het op elke pagina doen.
 */

import { test, expect } from '@playwright/test'

const SUBPAGINAS = ['/contactlenzen/', '/over-ons/', '/contact/', '/nieuws/']

test('de pijl staat niet op de homepage zelf', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Naar de homepage', exact: true })).toHaveCount(0)
})

test('de pijl brengt je vanaf elke pagina naar de homepage', async ({ page }) => {
  for (const pad of SUBPAGINAS) {
    await page.goto(pad)
    const pijl = page.getByRole('link', { name: 'Naar de homepage', exact: true })
    await expect(pijl, `${pad} hoort de pijl te tonen`).toBeVisible()
    await pijl.click()
    await page.waitForURL((u) => u.pathname === '/')
  }
})

test('het logo brengt je vanaf elke pagina naar de homepage', async ({ page }) => {
  for (const pad of SUBPAGINAS) {
    await page.goto(pad)
    await page.locator('header a[aria-label*="homepage"]').click()
    await page.waitForURL((u) => u.pathname === '/')
  }
})

test('de pijl blijft staan tijdens het scrollen en dekt niets belangrijks af', async ({
  page,
  isMobile,
}) => {
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

  // Op een telefoon mag hij de vaste balk onderin niet overlappen.
  if (isMobile) {
    const balk = await page.locator('nav[aria-label="Snel contact"] ul').boundingBox()
    if (balk) expect(voor.y + voor.height).toBeLessThanOrEqual(balk.y)
  }
})
