/**
 * Maakt van de originele foto's de bestanden die de site echt gebruikt.
 *
 *   npm run images
 *
 * Per plek uit config/beeld.mjs:
 *   - bijsnijden op de juiste verhouding
 *   - een lichte, consistente kleurcorrectie zodat alle foto's als een set voelen
 *   - iets verscherpen (dat gaat verloren bij het verkleinen)
 *   - wegschrijven als AVIF en WebP in meerdere breedtes
 *   - een piepklein wazig plaatje maken dat alvast getoond wordt tijdens het laden
 *
 * De resultaten komen in public/beeld/ en staan niet in de repo: ze worden
 * opnieuw gemaakt bij elke build. De maten en de wazige plaatjes komen in
 * src/content/beeld-gegenereerd.json, want die heeft de site wel nodig.
 *
 * Nieuwe foto's? Zet ze in assets-new/, wijs ze aan in config/beeld.mjs en
 * draai dit script opnieuw. Zie assets-new/README.md.
 */

import sharp from 'sharp'
import { mkdir, writeFile, rm, access } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'

import { BEELDEN } from '../config/beeld.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const UIT = path.join(ROOT, 'public', 'beeld')
const GEGEVENS = path.join(ROOT, 'src', 'content', 'beeld-gegenereerd.json')

/** Nieuwe foto's gaan voor: staat een bestand in assets-new, dan wint die. */
const BRONMAPPEN = [path.join(ROOT, 'assets-new'), path.join(ROOT, 'assets-original')]

/**
 * De cloud-machine heeft weinig geheugen en rekenkracht. Meer dan een paar
 * foto's tegelijk levert niets op en kan de machine omleggen.
 */
const TEGELIJK = Math.max(1, Math.min(3, os.cpus().length - 1))

const log = (...a) => console.log('[beeld]', ...a)

async function bestaat(p) {
  try { await access(p); return true } catch { return false }
}

async function vindBron(relatiefPad) {
  for (const map of BRONMAPPEN) {
    const p = path.join(map, relatiefPad)
    if (await bestaat(p)) return p
  }
  return null
}

/**
 * De kleurcorrectie die alle foto's dezelfde sfeer geeft: net iets warmer en
 * iets meer contrast, zoals de winkel er in het echt uitziet. Bewust licht -
 * we veranderen niet wat er op de foto staat.
 */
function kleurcorrectie(pijp, stijl) {
  if (stijl === 'zwartwit') {
    return pijp.greyscale().linear(1.06, -8).modulate({ brightness: 1.02 })
  }
  if (stijl === 'neutraal') {
    return pijp.modulate({ brightness: 1.01, saturation: 1.02 }).linear(1.03, -4)
  }
  // 'warm' (de standaard): iets meer verzadiging en een subtiele warme draai.
  return pijp
    .modulate({ brightness: 1.02, saturation: 1.08, hue: -3 })
    .linear(1.05, -6)
}

/** Maakt het kleine wazige plaatje dat tijdens het laden getoond wordt. */
async function blurPlaatje(bron, verhouding, zwaartepunt, stijl) {
  let pijp = sharp(bron).rotate()
  if (verhouding) {
    const h = Math.round((20 * verhouding[1]) / verhouding[0])
    pijp = pijp.resize(20, h, { fit: 'cover', position: zwaartepunt ?? 'attention' })
  } else {
    pijp = pijp.resize(20, null, { fit: 'inside' })
  }
  const buf = await kleurcorrectie(pijp, stijl).webp({ quality: 40 }).toBuffer()
  return `data:image/webp;base64,${buf.toString('base64')}`
}

async function verwerkEen(slot, beeld) {
  const bron = await vindBron(beeld.bron)
  if (!bron) throw new Error(`bronbestand niet gevonden: ${beeld.bron}`)

  const origineel = await sharp(bron).metadata()
  const maxBreedte = origineel.width ?? 0

  // Nooit opblazen: een foto groter maken dan het origineel geeft alleen
  // een wazig resultaat en een zwaarder bestand.
  const breedtes = beeld.breedtes.filter((b) => b <= maxBreedte)
  if (breedtes.length === 0) breedtes.push(maxBreedte)
  const grootste = Math.max(...breedtes)

  const teKlein = beeld.breedtes.filter((b) => b > maxBreedte)

  const bestanden = []
  for (const breedte of breedtes) {
    let pijp = sharp(bron).rotate()
    if (beeld.verhouding) {
      const hoogte = Math.round((breedte * beeld.verhouding[1]) / beeld.verhouding[0])
      pijp = pijp.resize(breedte, hoogte, { fit: 'cover', position: beeld.zwaartepunt ?? 'attention' })
    } else {
      pijp = pijp.resize(breedte, null, { fit: 'inside' })
    }
    pijp = kleurcorrectie(pijp, beeld.stijl)
    // Verkleinen maakt een foto altijd iets zachter; dit zet dat terug.
    pijp = pijp.sharpen({ sigma: 0.7, m1: 0.6, m2: 0.4 })

    await pijp.clone().avif({ quality: 58, effort: 4 }).toFile(path.join(UIT, `${slot}-${breedte}.avif`))
    await pijp.clone().webp({ quality: 78, effort: 4 }).toFile(path.join(UIT, `${slot}-${breedte}.webp`))
    bestanden.push(breedte)
  }

  const hoogte = beeld.verhouding
    ? Math.round((grootste * beeld.verhouding[1]) / beeld.verhouding[0])
    : Math.round(((origineel.height ?? 1) * grootste) / (origineel.width || 1))

  return {
    slot,
    gegevens: {
      alt: beeld.alt,
      breedte: grootste,
      hoogte,
      breedtes: bestanden,
      blur: await blurPlaatje(bron, beeld.verhouding, beeld.zwaartepunt, beeld.stijl),
      bron: beeld.bron,
    },
    teKlein: teKlein.length ? { slot, bron: beeld.bron, origineel: maxBreedte, gevraagd: teKlein } : null,
  }
}

/** Voert de taken uit in kleine groepjes, zodat het geheugen het aankan. */
async function inBatches(taken, grootte) {
  const uit = []
  for (let i = 0; i < taken.length; i += grootte) {
    const groep = taken.slice(i, i + grootte)
    uit.push(...(await Promise.all(groep.map((t) => t()))))
    log(`${Math.min(i + grootte, taken.length)}/${taken.length} verwerkt`)
  }
  return uit
}

async function main() {
  await rm(UIT, { recursive: true, force: true })
  await mkdir(UIT, { recursive: true })

  const slots = Object.entries(BEELDEN)
  log(`${slots.length} plekken, ${TEGELIJK} tegelijk`)

  const resultaten = await inBatches(
    slots.map(([slot, beeld]) => () => verwerkEen(slot, beeld)),
    TEGELIJK,
  )

  const gegenereerd = {}
  for (const r of resultaten) gegenereerd[r.slot] = r.gegevens
  await writeFile(GEGEVENS, JSON.stringify(gegenereerd, null, 2) + '\n')

  const teKlein = resultaten.map((r) => r.teKlein).filter(Boolean)
  if (teKlein.length) {
    log('')
    log('Deze foto’s zijn kleiner dan wat de site het liefst zou tonen.')
    log('Ze werken prima, maar scherper kan als er een groter bestand komt:')
    for (const t of teKlein) {
      log(`  - ${t.slot} (${t.bron}) is ${t.origineel}px breed, gevraagd: ${t.gevraagd.join(', ')}px`)
    }
    log('Zie docs/open-punten.md.')
  }

  log(`klaar - ${resultaten.length} plekken in public/beeld/`)
}

main().catch((err) => { console.error('[beeld] mislukt:', err); process.exitCode = 1 })
