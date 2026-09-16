/**
 * Controleert of elke oude URL het na de overstap nog doet.
 *
 * De lijst komt uit config/url-map.mjs, dezelfde bron die next.config.ts
 * gebruikt. Er kan dus geen regel in de documentatie staan die de site niet
 * echt heeft, of andersom.
 */

import { test, expect } from '@playwright/test'

import { ONGEWIJZIGD, NIEUW, REDIRECTS } from '../../config/url-map.mjs'

test.describe('URL’s van de oude site', () => {
  for (const pagina of ONGEWIJZIGD) {
    test(`${pagina.url} werkt nog gewoon (${pagina.titel})`, async ({ page }) => {
      const antwoord = await page.goto(pagina.url)
      expect(antwoord?.status(), `${pagina.url} hoort 200 te geven`).toBe(200)
      // Geen stille doorverwijzing: het adres hoort hetzelfde te blijven.
      expect(new URL(page.url()).pathname).toBe(pagina.url)
      await expect(page.locator('h1')).toBeVisible()
    })
  }

  for (const nieuw of NIEUW) {
    test(`${nieuw.url} bestaat (${nieuw.titel})`, async ({ page }) => {
      const antwoord = await page.goto(nieuw.url)
      expect(antwoord?.status()).toBe(200)
      await expect(page.locator('h1')).toBeVisible()
    })
  }
})

test.describe('Doorverwijzingen', () => {
  // Regels met een jokerteken (:pad*) testen we met een echt voorbeeld.
  const voorbeelden: Record<string, string> = {
    '/wp-admin/:pad*': '/wp-admin/post.php',
    '/author/:pad*': '/author/gerard/',
    '/tag/:pad*': '/tag/brillen/',
  }

  for (const regel of REDIRECTS) {
    const van = voorbeelden[regel.van] ?? regel.van
    test(`${van} gaat naar ${regel.naar}`, async ({ page }) => {
      const antwoord = await page.goto(van)
      expect(antwoord?.status(), `${van} hoort uit te komen op een bestaande pagina`).toBeLessThan(400)

      const gekomen = new URL(page.url())
      const verwacht = regel.naar.replace(/:pad\*/, '')
      expect(
        gekomen.pathname.startsWith(verwacht) || gekomen.pathname === verwacht,
        `${van} kwam uit op ${gekomen.pathname}, verwacht ${verwacht}`,
      ).toBe(true)
    })
  }
})

test('een adres dat niet bestaat geeft een nette 404', async ({ page }) => {
  const antwoord = await page.goto('/dit-bestaat-echt-niet/')
  expect(antwoord?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
