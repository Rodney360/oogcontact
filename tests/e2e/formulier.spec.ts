/**
 * Het aanvraagformulier en de boekingsmodule.
 *
 * Er zijn geen API-sleutels nodig: de site draait dan in testmodus, waarin er
 * niets echt verstuurd of geboekt wordt. Precies wat je in een test wilt.
 */

import { test, expect } from '@playwright/test'

test.describe('Aanvraagformulier', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact/')
  })

  test('geeft duidelijke Nederlandse foutmeldingen bij een leeg formulier', async ({ page }) => {
    await page.getByRole('button', { name: 'Versturen' }).click()

    await expect(page.getByText('Vul je voornaam in.')).toBeVisible()
    await expect(page.getByText('Vul je e-mailadres in.')).toBeVisible()
    // Nergens de u-vorm.
    const meldingen = await page.locator('[role="alert"], p:has-text("Vul je")').allTextContents()
    for (const melding of meldingen) {
      expect(melding, `foutmelding spreekt met "u": ${melding}`).not.toMatch(/\b(u|uw)\b/i)
    }
  })

  test('voorkeursdag verschijnt pas als je een afspraak wilt', async ({ page }) => {
    const dagvraag = page.getByRole('group', { name: /voorkeur voor een dag/i })
    await expect(dagvraag).toBeHidden()

    await page.getByRole('radio', { name: 'Ik wil graag een afspraak maken' }).check()
    await expect(dagvraag).toBeVisible()

    await page.getByRole('radio', { name: 'Ik wil graag meer informatie' }).check()
    await expect(dagvraag).toBeHidden()
  })

  test('een volledig ingevuld formulier komt aan', async ({ page }) => {
    await page.getByLabel('Voornaam').fill('Jantine')
    await page.getByLabel('Achternaam').fill('de Vries')
    await page.getByLabel('Telefoonnummer').fill('06 12 34 56 78')
    await page.getByLabel('E-mailadres').fill('jantine@voorbeeld.nl')
    await page.getByRole('radio', { name: 'Ik wil graag een afspraak maken' }).check()
    await page.getByRole('checkbox', { name: 'Woensdag' }).check()
    await page.getByRole('checkbox', { name: 'Oogmeting' }).check()
    await page.getByRole('checkbox', { name: /privacyverklaring/ }).check()

    await page.getByRole('button', { name: 'Versturen' }).click()

    await expect(page.getByText(/we hebben je bericht/i)).toBeVisible({ timeout: 15_000 })
  })

  test('een onjuist e-mailadres wordt tegengehouden', async ({ page }) => {
    await page.getByLabel('E-mailadres').fill('geen-adres')
    await page.getByRole('button', { name: 'Versturen' }).click()
    await expect(page.getByText(/geen geldig e-mailadres/i)).toBeVisible()
  })
})

test.describe('Afspraak maken', () => {
  test('je kunt de hele boeking doorlopen', async ({ page }) => {
    await page.goto('/afspraak-maken/')

    // Stap 1: waarvoor kom je
    const dienst = page.getByRole('button', { name: /Oogmeting en montuuradvies/ })
    await expect(dienst).toBeVisible({ timeout: 15_000 })
    await dienst.click()

    // Stap 2: wanneer
    await expect(page.getByRole('heading', { name: 'Wanneer schikt het?', exact: true })).toBeVisible()
    const eersteDag = page.locator('button[aria-pressed]').filter({ hasText: /dag|tijden/ }).first()
    await expect(eersteDag).toBeVisible({ timeout: 15_000 })

    const tijd = page.getByRole('button', { name: /^\d{1,2}\.\d{2} uur$/ }).first()
    await expect(tijd).toBeVisible()
    await tijd.click()

    await page.getByRole('button', { name: /^Verder met/ }).click()

    // Stap 3: je gegevens
    await expect(page.getByRole('heading', { name: 'Je gegevens', exact: true })).toBeVisible()

    const boeking = page.locator('form').filter({ hasText: 'Afspraak vastleggen' })
    await boeking.getByLabel('Voornaam').fill('Jantine')
    await boeking.getByLabel('Achternaam').fill('de Vries')
    await boeking.getByLabel('E-mailadres').fill('jantine@voorbeeld.nl')
    await boeking.getByLabel('Telefoonnummer').fill('06 12 34 56 78')
    await boeking.getByRole('checkbox', { name: /privacyverklaring/ }).check()
    await boeking.getByRole('button', { name: 'Afspraak vastleggen' }).click()

    // Stap 4: klaar
    await expect(page.getByRole('heading', { name: 'Tot ziens', exact: true })).toBeVisible({ timeout: 20_000 })
    await expect(page.getByRole('link', { name: 'Zet in mijn agenda' })).toBeVisible()
  })

  test('zonder gegevens kun je niet vastleggen', async ({ page }) => {
    await page.goto('/afspraak-maken/')
    const dienst = page.getByRole('button', { name: /Oogmeting/ }).first()
    await expect(dienst).toBeVisible({ timeout: 15_000 })
    await dienst.click()

    const tijd = page.getByRole('button', { name: /^\d{1,2}\.\d{2} uur$/ }).first()
    await expect(tijd).toBeVisible({ timeout: 15_000 })
    await tijd.click()
    await page.getByRole('button', { name: /^Verder met/ }).click()

    const boeking = page.locator('form').filter({ hasText: 'Afspraak vastleggen' })
    await boeking.getByRole('button', { name: 'Afspraak vastleggen' }).click()
    await expect(boeking.getByText('Vul je voornaam in.')).toBeVisible()
  })
})
