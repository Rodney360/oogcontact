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

  // Het tabblad van de browser. Daar is het icoon maar 16 of 32 pixels groot,
  // en dan verdwijnen de dunne lijnen van het logo in een grijs vlekje. Voor
  // die maten staat de bril daarom groter in het vlak en zijn de lijnen
  // dikker; de vorm zelf blijft precies die van het logo. Een witte bril op
  // zwart: zo springt hij er tussen de andere tabbladen het meest uit.
  const klein = await kleineIconen(bril, { r: 0, g: 0, b: 0, alpha: 1 }, '#FFFFFF')
  await writeFile(
    path.join(APP, 'favicon.ico'),
    naarIco([await klein(16, 1.3, 0.03), await klein(32, 2.2, 0.05), await klein(48, 2.8, 0.06)]),
  )
  // Wordt ook vooral klein getoond (tabblad, zoekresultaten van Google), dus
  // dezelfde stevige versie. Google wil een veelvoud van 48 pixels.
  await writeFile(path.join(APP, 'icon.png'), await klein(192, 13, 0.05))

  // Het beginscherm van de telefoon toont het icoon groot genoeg voor de
  // dunne lijnen van het logo.
  await writeFile(path.join(APP, 'apple-icon.png'), await vierkant(180, 0.13, inkt, IVOOR))
  await writeFile(path.join(UIT, 'icoon-192.png'), await vierkant(192, 0.14, inkt, IVOOR))
  await writeFile(path.join(UIT, 'icoon-512.png'), await vierkant(512, 0.14, inkt, IVOOR))
  // Voor het beginscherm van Android, dat zelf een vorm uitknipt: meer marge.
  await writeFile(path.join(UIT, 'icoon-maskeerbaar-512.png'), await vierkant(512, 0.22, inkt, IVOOR))

  // Het losse merkteken zonder achtergrond, voor gebruik in de site zelf.
  await writeFile(path.join(UIT, 'brilvorm-licht.svg'), svg)
}

/**
 * Geeft een functie terug die de brilvorm tekent voor kleine maten: zo breed
 * als het vlak toelaat, met lijnen van een vaste dikte in pixels.
 *
 * Dikker maken gaat door de vorm op groot formaat aan alle kanten even veel
 * te laten uitdijen (het "dilate" van sharp) en hem pas daarna te verkleinen.
 * Rondingen, de brug en het open rechterglas (de C van Oogcontact) blijven zo
 * op hun plek.
 */
async function kleineIconen(bril, achtergrond, kleur) {
  const stap = async (invoer, bewerk) => bewerk(sharp(invoer)).png().toBuffer()

  // Sharp ziet zwart als de vorm en wit als de achtergrond, dus zwart op wit.
  let vorm = await stap(Buffer.from(svgBestand({ ...bril, kleur: '#000000', titel: '' })), (s) =>
    s.resize({ width: 2048 }).flatten({ background: '#ffffff' }))
  vorm = await stap(vorm, (s) => s.greyscale().threshold(128))
  vorm = await stap(vorm, (s) => s.trim({ background: '#ffffff', threshold: 10 }))
  const { width: breedte } = await sharp(vorm).metadata()

  // Hoe dik de lijn nu is: tel de zwarte pixels bovenin het linkerglas, recht
  // boven het midden ervan.
  const { data } = await sharp(vorm).greyscale().raw().toBuffer({ resolveWithObject: true })
  const x = Math.round(breedte * 0.27)
  let y = 0
  while (data[y * breedte + x] >= 128) y++
  let lijn = 0
  while (data[(y + lijn) * breedte + x] < 128) lijn++

  return async function (formaat, lijnPx, marge) {
    const inhoud = Math.round(formaat * (1 - marge * 2))
    const erbij = Math.max(0, Math.round((lijnPx * (breedte / inhoud) - lijn) / 2))

    let masker = vorm
    if (erbij > 0) {
      masker = await stap(masker, (s) =>
        s.extend({ top: erbij, bottom: erbij, left: erbij, right: erbij, background: '#ffffff' }))
      masker = await stap(masker, (s) => s.dilate(erbij))
    }
    const { data: dekking, info } = await sharp(masker)
      .greyscale()
      .negate()
      .resize({ width: inhoud, height: inhoud, fit: 'inside', kernel: 'lanczos3' })
      .raw()
      .toBuffer({ resolveWithObject: true })

    const kleurlaag = await sharp({
      create: { width: info.width, height: info.height, channels: 3, background: kleur },
    })
      .joinChannel(dekking, { raw: { width: info.width, height: info.height, channels: 1 } })
      .png()
      .toBuffer()

    return sharp({ create: { width: formaat, height: formaat, channels: 4, background: achtergrond } })
      .composite([{
        input: kleurlaag,
        left: Math.round((formaat - info.width) / 2),
        top: Math.round((formaat - info.height) / 2),
      }])
      .png()
      .toBuffer()
  }
}

/**
 * Zet een paar PNG's samen in één .ico-bestand. Sharp kan dat niet zelf, maar
 * het formaat is eenvoudig: een kopje, per afbeelding een regel met maat en
 * plek, en daarna de PNG's achter elkaar. Elke browser van na 2010 leest dit.
 */
function naarIco(pngs) {
  const kop = Buffer.alloc(6)
  kop.writeUInt16LE(0, 0) // gereserveerd
  kop.writeUInt16LE(1, 2) // 1 = icoon
  kop.writeUInt16LE(pngs.length, 4)

  let plek = 6 + 16 * pngs.length
  const regels = pngs.map((png) => {
    const formaat = png.readUInt32BE(16) // breedte uit het IHDR-blok van de PNG
    const regel = Buffer.alloc(16)
    regel.writeUInt8(formaat >= 256 ? 0 : formaat, 0)
    regel.writeUInt8(formaat >= 256 ? 0 : formaat, 1)
    regel.writeUInt8(0, 2) // geen palet
    regel.writeUInt8(0, 3)
    regel.writeUInt16LE(1, 4) // vlakken
    regel.writeUInt16LE(32, 6) // bits per pixel
    regel.writeUInt32LE(png.length, 8)
    regel.writeUInt32LE(plek, 12)
    plek += png.length
    return regel
  })

  return Buffer.concat([kop, ...regels, ...pngs])
}

main().catch((err) => { console.error('[logo] mislukt:', err); process.exitCode = 1 })
