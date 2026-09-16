/**
 * Controleert of alle kleurcombinaties van de huisstijl voldoen aan WCAG 2.2 AA.
 *
 *   node scripts/check-contrast.mjs
 *
 * Draait mee in de CI. Verandert er iets aan de kleuren, dan zie je het meteen
 * als een combinatie niet meer leesbaar genoeg is.
 */

import { KLEUREN, CONTRAST_PAREN } from '../src/content/kleuren.mjs'

/** sRGB-kanaal naar lineair licht, volgens de WCAG-formule. */
function kanaal(waarde) {
  const v = waarde / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function luminantie(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return 0.2126 * kanaal(r) + 0.7152 * kanaal(g) + 0.0722 * kanaal(b)
}

export function contrast(voorgrond, achtergrond) {
  const a = luminantie(voorgrond)
  const b = luminantie(achtergrond)
  const [licht, donker] = a > b ? [a, b] : [b, a]
  return (licht + 0.05) / (donker + 0.05)
}

const EIS = {
  tekst: 4.5,      // gewone tekst
  grote_tekst: 3,  // vanaf 24px, of 18.66px vet
  ui: 3,           // randen, iconen, focusring
}

function main() {
  let fouten = 0
  console.log('Contrastcontrole huisstijl (WCAG 2.2 AA)\n')

  for (const paar of CONTRAST_PAREN) {
    const voor = KLEUREN[paar.voorgrond]
    const achter = KLEUREN[paar.achtergrond]
    if (!voor || !achter) {
      console.error(`  ONBEKENDE KLEUR in ${paar.voorgrond} op ${paar.achtergrond}`)
      fouten += 1
      continue
    }
    const ratio = contrast(voor, achter)
    const eis = EIS[paar.soort]
    const ok = ratio >= eis
    if (!ok) fouten += 1
    const merk = ok ? 'ok  ' : 'FOUT'
    console.log(
      `  ${merk} ${ratio.toFixed(2)}:1  (eis ${eis}:1)  ${paar.voorgrond} op ${paar.achtergrond}` +
      `  - ${paar.gebruik}`,
    )
  }

  console.log('')
  if (fouten > 0) {
    console.error(`${fouten} combinatie(s) voldoen niet aan WCAG AA.`)
    process.exit(1)
  }
  console.log('Alle combinaties voldoen aan WCAG AA.')
}

main()
