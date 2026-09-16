/**
 * Toegankelijkheid: is de site met een toetsenbord te bedienen, en klopt de
 * opbouw voor wie een schermlezer gebruikt?
 */

import { test, expect } from '@playwright/test'

const PAGINAS = ['/', '/aanbod/', '/brillen/', '/over-ons/', '/contact/', '/afspraak-maken/']

test('de koppen lopen in een logische volgorde', async ({ page }) => {
  for (const pad of PAGINAS) {
    await page.goto(pad)
    const niveaus = await page.locator('h1, h2, h3, h4').evaluateAll((koppen) =>
      koppen.map((k) => Number(k.tagName.slice(1))),
    )
    expect(niveaus[0], `${pad} hoort met een h1 te beginnen`).toBe(1)
    for (let i = 1; i < niveaus.length; i += 1) {
      const sprong = (niveaus[i] ?? 0) - (niveaus[i - 1] ?? 0)
      expect(sprong, `${pad} slaat een kopniveau over bij kop ${i + 1}`).toBeLessThanOrEqual(1)
    }
  }
})

test('de taal van de pagina staat op Nederlands', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl')
})

test('je kunt inzoomen', async ({ page }) => {
  await page.goto('/')
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
  expect(viewport ?? '').not.toContain('maximum-scale')
  expect(viewport ?? '').not.toContain('user-scalable=no')
})

test('elke knop en link is groot genoeg om aan te tikken', async ({ page }) => {
  await page.goto('/')
  const teKlein: string[] = []

  for (const element of await page.locator('a, button').all()) {
    if (!(await element.isVisible())) continue
    const vak = await element.boundingBox()
    if (!vak) continue
    // Links midden in een lopende tekst vallen buiten deze eis (WCAG 2.2, 2.5.8).
    const inTekst = await element.evaluate((el) => {
      const ouder = el.parentElement
      return ouder ? ['P', 'LI', 'SPAN', 'ADDRESS'].includes(ouder.tagName) : false
    })
    if (inTekst) continue

    if (vak.width < 44 || vak.height < 44) {
      teKlein.push(`${await element.innerText()} (${Math.round(vak.width)}x${Math.round(vak.height)})`)
    }
  }

  expect(teKlein, `deze zijn kleiner dan 44x44: ${teKlein.join(', ')}`).toHaveLength(0)
})

test('met minder beweging staat alles meteen op zijn plek', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  // Alles wat normaal pas bij het scrollen verschijnt, is nu meteen zichtbaar.
  const verborgen = await page
    .locator('[data-verschijnt]')
    .evaluateAll((els) => els.filter((el) => Number(getComputedStyle(el).opacity) < 1).length)
  expect(verborgen, 'met reduced motion hoort niets onzichtbaar te zijn').toBe(0)
})

test('het menu op mobiel is met het toetsenbord te bedienen', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'alleen op mobiel')
  await page.goto('/')

  const menuknop = page.getByRole('button', { name: 'Menu openen' })
  await menuknop.click()
  await expect(page.getByRole('navigation', { name: 'Menu' })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('navigation', { name: 'Menu' })).toBeHidden()
  await expect(menuknop).toBeFocused()
})
