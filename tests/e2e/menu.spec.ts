/**
 * De menubalk.
 *
 * Elk onderdeel moet je ook echt ergens brengen: op desktop via het
 * uitklapmenu onder "Aanbod", op mobiel via het menu achter de hamburger.
 * Deze test liep eerder mis omdat de link pas na een korte tussenstap van
 * adres verandert; vandaar dat er op de nieuwe URL gewacht wordt en niet op
 * het laden van de pagina.
 */

import { test, expect } from '@playwright/test'

import { HOOFDMENU, AANBOD } from '../../src/content/navigatie.ts'

test.describe('de menubalk op desktop', () => {
  test.skip(({ isMobile }) => Boolean(isMobile), 'alleen op een breed scherm')

  const menubalk = (page: import('@playwright/test').Page) =>
    page.getByRole('navigation', { name: 'Hoofdmenu' })

  test('elk onderdeel brengt je naar de juiste pagina', async ({ page }) => {
    for (const item of HOOFDMENU) {
      await page.goto('/')
      await menubalk(page).getByRole('link', { name: item.naam, exact: true }).click()
      await page.waitForURL(`**${item.pad}`)
    }
  })

  test('het uitklapmenu onder Aanbod opent en elke link werkt', async ({ page }) => {
    for (const kind of AANBOD) {
      await page.goto('/')
      await menubalk(page).getByRole('link', { name: 'Aanbod', exact: true }).hover()
      const link = menubalk(page).getByRole('link', { name: new RegExp(`^${kind.naam}`) }).first()
      await expect(link).toBeVisible()
      await link.click()
      await page.waitForURL(`**${kind.pad}`)
    }
  })

  test('het uitklapmenu blijft open als je er met de muis naartoe gaat', async ({ page }) => {
    await page.goto('/')
    const knop = menubalk(page).getByRole('link', { name: 'Aanbod', exact: true })
    await knop.hover()
    const lijst = menubalk(page).locator('li > div ul')
    await expect(lijst).toBeVisible()

    // Van de knop naar de onderste regel van het uitklapmenu bewegen: onderweg
    // mag het niet dichtklappen, anders is er niets aan te klikken.
    const vak = await lijst.boundingBox()
    if (!vak) throw new Error('het uitklapmenu heeft geen afmetingen')
    await page.mouse.move(vak.x + vak.width / 2, vak.y + vak.height - 8, { steps: 10 })
    await expect(lijst).toBeVisible()

    // En weg met de muis: dan hoort het dicht te gaan.
    await page.mouse.move(10, 500, { steps: 6 })
    await expect(lijst).toBeHidden()
  })

  test('met het toetsenbord: openen, erlangs lopen en met Escape weer sluiten', async ({ page }) => {
    await page.goto('/')
    const knop = menubalk(page).getByRole('link', { name: 'Aanbod', exact: true })
    await knop.focus()

    const lijst = menubalk(page).locator('li > div ul')
    await expect(lijst).toBeVisible()
    await expect(knop).toHaveAttribute('aria-expanded', 'true')

    // De eerste Tab brengt je in het uitklapmenu.
    await page.keyboard.press('Tab')
    await expect(page.locator(`a[href="${AANBOD[0]?.pad}"]:focus`)).toHaveCount(1)

    // Escape sluit het en zet de aandacht terug op de knop.
    await page.keyboard.press('Escape')
    await expect(lijst).toBeHidden()
    await expect(knop).toBeFocused()
  })
})

test.describe('het menu op mobiel', () => {
  test.skip(({ isMobile }) => !isMobile, 'alleen op een telefoon')

  test('elk onderdeel, ook het aanbod, brengt je naar de juiste pagina', async ({ page }) => {
    for (const item of [...HOOFDMENU, ...AANBOD]) {
      await page.goto('/')
      await page.getByRole('button', { name: 'Menu openen' }).click()
      const menu = page.getByRole('navigation', { name: 'Menu' })
      await menu.getByRole('link', { name: item.naam, exact: true }).click()
      await page.waitForURL(`**${item.pad}`)
      // Na het klikken hoort het menu vanzelf dicht te zijn.
      await expect(menu).toBeHidden()
    }
  })

  test('Escape sluit het menu en de aandacht gaat terug naar de knop', async ({ page }) => {
    await page.goto('/')
    const knop = page.getByRole('button', { name: 'Menu openen' })
    await knop.click()
    await expect(page.getByRole('navigation', { name: 'Menu' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: 'Menu' })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Menu openen' })).toBeFocused()
  })
})

/**
 * De terugknop van de browser.
 *
 * Dit ging eerder mis: het menu onthield op welke pagina het geopend was, en
 * kwam je met de terugknop op diezelfde pagina terug, dan stond het opeens
 * weer open - met een scherm dat niet meer wilde scrollen tot gevolg.
 */
test.describe('terug met de browserknop', () => {
  test('op mobiel blijft het menu dicht en kun je gewoon verder scrollen', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'alleen op een telefoon')

    await page.goto('/')
    await page.getByRole('button', { name: 'Menu openen' }).click()
    const menu = page.getByRole('navigation', { name: 'Menu' })
    await expect(menu).toBeVisible()
    await menu.getByRole('link', { name: 'Over ons', exact: true }).click()
    await page.waitForURL('**/over-ons/')

    await page.goBack()
    await page.waitForURL((u) => u.pathname === '/')
    await expect(menu).toBeHidden()

    // En de pagina mag niet op slot zitten.
    const voor = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 600)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(voor)
  })

  test('op desktop staat het uitklapmenu niet vanzelf weer open', async ({ page, isMobile }) => {
    test.skip(Boolean(isMobile), 'alleen op een breed scherm')

    await page.goto('/')
    const balk = page.getByRole('navigation', { name: 'Hoofdmenu' })
    await balk.getByRole('link', { name: 'Aanbod', exact: true }).hover()
    await balk.getByRole('link', { name: new RegExp(`^${AANBOD[0]?.naam}`) }).first().click()
    await page.waitForURL(`**${AANBOD[0]?.pad}`)

    // De muis weg van de menubalk, zodat alleen de terugknop nog iets doet.
    await page.mouse.move(700, 600)
    await page.goBack()
    await page.waitForURL((u) => u.pathname === '/')
    await expect(balk.locator('li > div ul')).toBeHidden()
  })
})

/**
 * Het menu weer dicht krijgen.
 *
 * Dit ging mis: het opengeklapte menu bedekt het hele scherm en lag daarmee
 * ook over de sluitknop heen. Je zag de knop wel, maar hij was niet aan te
 * tikken - op een telefoon kwam je het menu daardoor alleen nog uit door
 * ergens naartoe te gaan.
 */
test.describe('het menu weer dicht krijgen', () => {
  test.skip(({ isMobile }) => !isMobile, 'alleen op een telefoon')

  const knop = (page: import('@playwright/test').Page) => page.locator('header button[aria-controls]')

  test('met dezelfde knop rechtsboven', async ({ page }) => {
    await page.goto('/')
    const menu = page.getByRole('navigation', { name: 'Menu' })

    await knop(page).click()
    await expect(menu).toBeVisible()
    await expect(knop(page)).toHaveAttribute('aria-expanded', 'true')

    await knop(page).click({ timeout: 5000 })
    await expect(menu).toBeHidden()
    await expect(knop(page)).toHaveAttribute('aria-expanded', 'false')
  })

  test('door naast de onderdelen te tikken', async ({ page }) => {
    await page.goto('/')
    const menu = page.getByRole('navigation', { name: 'Menu' })
    await knop(page).click()
    await expect(menu).toBeVisible()

    const scherm = page.viewportSize()
    if (!scherm) throw new Error('geen schermmaat')
    await page.mouse.click(Math.round(scherm.width / 2), scherm.height - 40)
    await expect(menu).toBeHidden()
  })

  test('de pagina scrolt niet achter het menu door', async ({ page }) => {
    await page.goto('/')
    await knop(page).click()
    await expect(page.getByRole('navigation', { name: 'Menu' })).toBeVisible()

    const voor = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(700)
    expect(await page.evaluate(() => window.scrollY)).toBe(voor)
  })
})

/**
 * De kop op de homepage schuift woord voor woord in beeld. Het vakje dat
 * daarvoor afsnijdt moet ruimer zijn dan de regel zelf, anders worden de
 * staarten van letters als de g en de p onderaan recht afgesneden.
 */
test('de staarten van de letters in de kop worden niet afgesneden', async ({ page }) => {
  await page.goto('/')
  const ruimte = await page.evaluate(() => {
    const buiten = document.querySelector('h1 > span') as HTMLElement | null
    const binnen = buiten?.firstElementChild as HTMLElement | null
    if (!buiten || !binnen) return null
    const maat = parseFloat(getComputedStyle(buiten).fontSize)
    return { onder: buiten.clientHeight - binnen.offsetHeight, maat }
  })
  expect(ruimte, 'de kop hoort uit losse woorden te bestaan').not.toBeNull()
  // Ruim genoeg voor een g of een p: minstens 0,15 keer de letterhoogte.
  expect(ruimte!.onder).toBeGreaterThan(ruimte!.maat * 0.15)
})
