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
  /*
    De boeking zelf gebeurt in de agenda van OO2, die in de pagina geladen
    wordt. Wat daarbinnen gebeurt is van hen; wij kunnen er niet in klikken en
    hoeven dat ook niet te testen. Wat wij wel moeten weten: staat het vlak er,
    wijst het naar de goede agenda, en is er een weg terug als het niet laadt.

    Onze eigen boekingsmodule staat nog in de repo voor als er ooit een API
    komt, maar hij staat op geen enkele pagina meer - dus valt er ook niets
    van te doorlopen.
  */
  test('de agenda van OO2 staat op de pagina', async ({ page }) => {
    await page.goto('/afspraak-maken/')

    const agenda = page.locator('iframe[title="Online agenda van Oogcontact bij Gerard"]')
    await expect(agenda).toBeVisible({ timeout: 15_000 })
    await expect(agenda).toHaveAttribute('src', /^https:\/\/oogcontactbijgerard\.oo2\.online/)

    // De uitweg voor wie het vlak niet geladen krijgt.
    await expect(
      page.getByRole('link', { name: 'Open de agenda in een nieuw tabblad' }),
    ).toBeVisible()
  })

  test('je kunt ook om een terugbelverzoek vragen', async ({ page }) => {
    await page.goto('/afspraak-maken/#terugbellen')
    await expect(page.getByRole('heading', { name: 'Laat je gegevens achter' })).toBeVisible()
  })
})
