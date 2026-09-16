/**
 * Maakt van het bestaande logo (een PNG) een scherpe SVG-versie.
 *
 *   node scripts/maak-logo.mjs
 *
 * Het origineel is een platte vorm in een kleur, dus het overtrekken levert
 * een exacte kopie op die op elk formaat scherp blijft. Er komen twee varianten
 * uit: een lichte (voor donkere achtergronden, zoals het origineel) en een
 * donkere (voor lichte achtergronden). Daarnaast de losse brilvorm, die als
 * los merkteken en als favicon gebruikt wordt.
 *
 * Draai dit alleen opnieuw als het logo zelf verandert; de uitkomst staat in
 * de repo zodat een build geen tekenwerk hoeft te doen.
 */

import { trace } from 'potrace'
import sharp from 'sharp'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

const traceAsync = promisify(trace)

const ROOT = path.resolve(import.meta.dirname, '..')
const BRON = path.join(ROOT, 'assets-original', '2021-04', 'Oogcontact-bij-Gerard-logo-licht.png')
const UIT = path.join(ROOT, 'public', 'logo')

const IVOOR = '#FBF2E6'
const INKT = '#11151C'

/**
 * Het overtrekken werkt op zwart-wit, en pakt de donkere vlakken als vorm.
 * Het origineel is juist een lichte vorm op niets (doorzichtig). Daarom zetten
 * we hem eerst op zwart en draaien daarna de helderheid om: dan is het logo
 * donker op wit en trekt potrace precies het logo over.
 */
async function naarPad(bron, opties = {}) {
  const groot = await sharp(bron)
    .resize({ width: 3000, kernel: 'lanczos3' })
    .flatten({ background: '#000000' })
    .greyscale()
    .negate({ alpha: false })
    .png()
    .toBuffer()

  const svg = await traceAsync(groot, {
    threshold: 110,
    turdSize: 2,      // spikkels kleiner dan dit weglaten
    optCurve: true,
    optTolerance: 0.2,
    alphaMax: 1,
  })

  const pad = /\sd="([^"]+)"/.exec(svg)?.[1]
  const maten = /viewBox="([^"]+)"/.exec(svg)?.[1] ?? '0 0 3000 634'
  if (!pad) throw new Error('overtrekken leverde geen pad op')
  return { pad, viewBox: maten, ...opties }
}

function svgBestand({ pad, viewBox, kleur, titel }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${titel}">
  <title>${titel}</title>
  <path fill="${kleur}" fill-rule="evenodd" d="${pad}"/>
</svg>
`
}

async function main() {
  await mkdir(UIT, { recursive: true })

  const getrokken = await naarPad(BRON)

  await writeFile(
    path.join(UIT, 'oogcontact-bij-gerard-licht.svg'),
    svgBestand({ ...getrokken, kleur: IVOOR, titel: 'Oogcontact bij Gerard' }),
  )
  await writeFile(
    path.join(UIT, 'oogcontact-bij-gerard-donker.svg'),
    svgBestand({ ...getrokken, kleur: INKT, titel: 'Oogcontact bij Gerard' }),
  )

  // De brilvorm apart: alleen het linkerdeel van het logo.
  const brilBron = await sharp(BRON).extract({ left: 0, top: 0, width: 365, height: 200 }).png().toBuffer()
  const bril = await naarPad(brilBron)
  await writeFile(
    path.join(UIT, 'brilvorm-licht.svg'),
    svgBestand({ ...bril, kleur: IVOOR, titel: 'Oogcontact bij Gerard' }),
  )
  await writeFile(
    path.join(UIT, 'brilvorm-donker.svg'),
    svgBestand({ ...bril, kleur: INKT, titel: 'Oogcontact bij Gerard' }),
  )

  await maakIconen(bril)

  console.log('[logo] svg-bestanden en iconen gemaakt')
}

/**
 * De iconen voor het tabblad en het beginscherm van de telefoon: de brilvorm
 * in ivoor, op een inktkleurig vlak met wat lucht eromheen.
 */
async function maakIconen(bril) {
  const APP = path.join(ROOT, 'src', 'app')
  const svg = svgBestand({ ...bril, kleur: IVOOR, titel: 'Oogcontact bij Gerard' })

  /** Tekent de brilvorm gecentreerd op een vierkant inktvlak. */
  async function vierkant(formaat, marge, achtergrond, kleur) {
    const inhoud = Math.round(formaat * (1 - marge * 2))
    const vorm = await sharp(Buffer.from(svgBestand({ ...bril, kleur, titel: 'Oogcontact bij Gerard' })))
      .resize({ width: inhoud, fit: 'inside' })
      .png()
      .toBuffer()
    const m = await sharp(vorm).metadata()
    return sharp({
      create: { width: formaat, height: formaat, channels: 4, background: achtergrond },
    })
      .composite([{ input: vorm, left: Math.round((formaat - (m.width ?? 0)) / 2), top: Math.round((formaat - (m.height ?? 0)) / 2) }])
      .png()
      .toBuffer()
  }

  const inkt = { r: 0x11, g: 0x15, b: 0x1c, alpha: 1 }

  await writeFile(path.join(APP, 'icon.png'), await vierkant(512, 0.14, inkt, IVOOR))
  await writeFile(path.join(APP, 'apple-icon.png'), await vierkant(180, 0.13, inkt, IVOOR))
  await writeFile(path.join(UIT, 'icoon-192.png'), await vierkant(192, 0.14, inkt, IVOOR))
  await writeFile(path.join(UIT, 'icoon-512.png'), await vierkant(512, 0.14, inkt, IVOOR))
  // Voor het beginscherm van Android, dat zelf een vorm uitknipt: meer marge.
  await writeFile(path.join(UIT, 'icoon-maskeerbaar-512.png'), await vierkant(512, 0.22, inkt, IVOOR))

  // Het losse merkteken zonder achtergrond, voor gebruik in de site zelf.
  await writeFile(path.join(UIT, 'brilvorm-licht.svg'), svg)
}

main().catch((err) => { console.error('[logo] mislukt:', err); process.exitCode = 1 })
