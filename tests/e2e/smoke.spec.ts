/**
 * De basiscontrole: doet de site het, en is hij te bedienen?
 *
 * Draait op desktop én op mobiel (zie playwright.config.ts).
 */

import { test, expect } from '@playwright/test'

test('de homepage laadt met een duidelijke titel en kop', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Oogcontact bij Gerard/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('elke pagina heeft precies één h1', async ({ page }) => {
  const paginas = [
    '/', '/aanbod/', '/brillen/', '/contactlenzen/', '/zonnebrillen/',
    '/kinderbrillen/', '/loepbrillen/', '/collectie/', '/over-ons/',
    '/contact/', '/afspraak-maken/', '/nieuws/', '/ultiem-nauwkeurig-zicht/',
  ]
  for (const pad of paginas) {
    await page.goto(pad)
    await expect(page.locator('h1'), `${pad} hoort precies één h1 te hebben`).toHaveCount(1)
  }
})

test('je kunt met de tabtoets meteen naar de inhoud springen', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: /direct naar de inhoud/i })
  await expect(skip).toBeFocused()
  await skip.press('Enter')
  await expect(page.locator('#hoofd')).toBeVisible()
})

test('de knop Afspraak maken staat altijd in beeld', async ({ page }) => {
  await page.goto('/')
  const knop = page.getByRole('link', { name: 'Afspraak maken', exact: true }).first()
  await expect(knop).toBeVisible()
  await knop.click()
  await expect(page).toHaveURL(/\/afspraak-maken\//)
})

test('alle afbeeldingen hebben een alt-tekst', async ({ page }) => {
  for (const pad of ['/', '/over-ons/', '/aanbod/', '/collectie/']) {
    await page.goto(pad)
    const zonderAlt = await page.locator('img:not([alt])').count()
    expect(zonderAlt, `${pad} heeft afbeeldingen zonder alt-tekst`).toBe(0)
  }
})

test('er staat gestructureerde data over de winkel op de pagina', async ({ page }) => {
  await page.goto('/')
  const blokken = await page.locator('script[type="application/ld+json"]').allTextContents()
  const gegevens = blokken.map((b) => JSON.parse(b))
  const winkel = gegevens.find((g) => g['@type'] === 'Optician')
  expect(winkel, 'er hoort een Optician-blok te staan').toBeTruthy()
  expect(winkel.address.streetAddress).toBe('Overwinningsplein 100')
  expect(winkel.openingHoursSpecification).toHaveLength(4)
})

test('llms.txt vertelt wat voor zaak dit is', async ({ request }) => {
  const antwoord = await request.get('/llms.txt')
  expect(antwoord.status()).toBe(200)
  const tekst = await antwoord.text()
  expect(tekst).toContain('Oogcontact bij Gerard')
  expect(tekst).toContain('Overwinningsplein 100')
  expect(tekst).toContain('woensdag')
})

test('de sitemap noemt alle pagina’s', async ({ request }) => {
  const antwoord = await request.get('/sitemap.xml')
  expect(antwoord.status()).toBe(200)
  const xml = await antwoord.text()
  for (const pad of ['/brillen/', '/afspraak-maken/', '/over-ons/', '/collectie/']) {
    expect(xml, `${pad} hoort in de sitemap te staan`).toContain(pad)
  }
})

test('de beveiligingsheaders staan goed', async ({ request }) => {
  const antwoord = await request.get('/')
  const koppen = antwoord.headers()
  expect(koppen['content-security-policy']).toContain("default-src 'self'")
  expect(koppen['x-content-type-options']).toBe('nosniff')
  expect(koppen['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(koppen['strict-transport-security']).toContain('max-age=')
})
