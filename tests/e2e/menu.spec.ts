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
