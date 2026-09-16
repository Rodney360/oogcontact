/**
 * Verkleint de originele bestanden die onnodig groot zijn.
 *
 *   node scripts/verklein-originelen.mjs            # laat zien wat er zou gebeuren
 *   node scripts/verklein-originelen.mjs --doen     # voert het echt uit
 *
 * Waarom dit nodig was: tussen de bestanden van de oude site zaten een paar
 * enorme exemplaren. Een persfoto van een leverancier van 47,5 MB
 * (5792 x 8688 pixels), een winkelfoto van 22 MB als PNG, en twee video's van
 * ruim 22 MB. Die maakten de hele repo zwaar om binnen te halen, terwijl de
 * site nooit meer dan 1920 pixels breed vraagt.
 *
 * Wat er WEL verandert: het aantal pixels en de compressie.
 * Wat er NIET verandert: wat er op de foto staat. Er wordt niets bijgesneden,
 * niets weggepoetst en niets toegevoegd. De bestandsnaam blijft ook hetzelfde,
 * zodat config/beeld.mjs en het media-overzicht blijven kloppen.
 *
 * 2560 pixels is ruim gekozen: de site vraagt maximaal 1920, dus er is nog
 * marge voor een groter beeldscherm of een nieuwe plek op de site.
 */

import sharp from 'sharp'
import { readdir, stat, rename, unlink, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import path from 'node:path'
import { promisify } from 'node:util'

const uitvoeren = promisify(execFile)

const ROOT = path.resolve(import.meta.dirname, '..')
const MAP = path.join(ROOT, 'assets-original')
const VERSLAG = path.join(ROOT, 'content-archive', 'verkleind.json')

/** Vanaf deze grootte kijken we of het kleiner kan. */
const DREMPEL_BYTES = 2 * 1024 * 1024

/** De langste zijde die we bewaren. De site vraagt er maximaal 1920. */
const MAX_ZIJDE = 2560

const DOEN = process.argv.includes('--doen')

/** ffmpeg van Playwright, of een systeembrede als die er is. */
const FFMPEG = process.env.FFMPEG_PAD ?? '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux'

const mb = (n) => (n / 1048576).toFixed(1)

async function alleBestanden(map) {
  const uit = []
  for (const item of await readdir(map, { withFileTypes: true })) {
    const p = path.join(map, item.name)
    if (item.isDirectory()) uit.push(...(await alleBestanden(p)))
    else uit.push(p)
  }
  return uit
}

/** Verkleint een foto, met behoud van formaat en bestandsnaam. */
async function verkleinFoto(bestand, info) {
  const ext = path.extname(bestand).toLowerCase()
  const tijdelijk = `${bestand}.tijdelijk`

  let pijp = sharp(bestand, { failOn: 'none' })
    // Een enkele foto staat gedraaid in de metagegevens; die draaien we mee.
    .rotate()
    // Persfoto's staan soms in CMYK, wat browsers niet goed aankunnen.
    .toColorspace('srgb')

  if ((info.width ?? 0) > MAX_ZIJDE || (info.height ?? 0) > MAX_ZIJDE) {
    pijp = pijp.resize(MAX_ZIJDE, MAX_ZIJDE, { fit: 'inside', withoutEnlargement: true })
  }

  if (ext === '.png') {
    // Een foto als PNG bewaren is zonde van de ruimte, maar we laten het
    // formaat staan zodat verwijzingen naar de bestandsnaam blijven kloppen.
    await pijp.png({ compressionLevel: 9, effort: 8 }).toFile(tijdelijk)
  } else if (ext === '.webp') {
    await pijp.webp({ quality: 88 }).toFile(tijdelijk)
  } else {
    await pijp.jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(tijdelijk)
  }

  return tijdelijk
}

/** Zet een video om naar een formaat dat op een website thuishoort. */
async function verkleinVideo(bestand) {
  const tijdelijk = `${bestand}.tijdelijk.mp4`
  await uitvoeren(FFMPEG, [
    '-y', '-i', bestand,
    // Niet groter dan 1280 breed, en een even aantal pixels (eis van H.264).
    '-vf', 'scale=min(1280\\,iw):-2',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '24',
    '-c:a', 'aac', '-b:a', '128k',
    // Zorgt dat de video meteen begint met afspelen in plaats van eerst
    // helemaal gedownload te moeten worden.
    '-movflags', '+faststart',
    tijdelijk,
  ])
  return tijdelijk
}

async function main() {
  const bestanden = (await alleBestanden(MAP)).sort()
  const verslag = []
  let bespaard = 0

  for (const bestand of bestanden) {
    const voor = (await stat(bestand)).size
    if (voor < DREMPEL_BYTES) continue

    const ext = path.extname(bestand).toLowerCase()
    const relatief = path.relative(ROOT, bestand)

    let tijdelijk = null
    let details = ''

    try {
      if (ext === '.mp4') {
        tijdelijk = await verkleinVideo(bestand)
        details = 'video, max 1280 breed'
      } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        const info = await sharp(bestand, { failOn: 'none' }).metadata()
        tijdelijk = await verkleinFoto(bestand, info)
        const na = await sharp(tijdelijk).metadata()
        details = `${info.width}x${info.height} -> ${na.width}x${na.height}`
      } else {
        continue
      }

      const naGrootte = (await stat(tijdelijk)).size

      // Alleen vervangen als het echt scheelt. Anders blijft het origineel staan.
      if (naGrootte >= voor * 0.9) {
        await unlink(tijdelijk)
        console.log(`  overgeslagen (scheelt te weinig): ${relatief}`)
        continue
      }

      console.log(`  ${mb(voor).padStart(6)} MB -> ${mb(naGrootte).padStart(6)} MB  ${relatief}  (${details})`)
      bespaard += voor - naGrootte
      verslag.push({ bestand: relatief, voorBytes: voor, naBytes: naGrootte, wat: details })

      if (DOEN) {
        await rename(tijdelijk, bestand)
      } else {
        await unlink(tijdelijk)
      }
    } catch (fout) {
      if (tijdelijk) await unlink(tijdelijk).catch(() => {})
      console.error(`  MISLUKT: ${relatief} - ${fout.message?.slice(0, 120)}`)
    }
  }

  console.log('')
  console.log(`${verslag.length} bestanden, samen ${mb(bespaard)} MB kleiner`)

  if (DOEN) {
    await writeFile(
      VERSLAG,
      JSON.stringify(
        {
          uitgevoerd: 'bij de overstap naar de nieuwe site',
          waarom:
            'Een paar bestanden van de oude site waren onnodig groot voor gebruik op een ' +
            'website. Alleen het aantal pixels en de compressie zijn aangepast; er is niets ' +
            'aan de inhoud van de foto’s veranderd.',
          maxZijde: MAX_ZIJDE,
          bestanden: verslag,
        },
        null,
        2,
      ) + '\n',
    )
    console.log(`Vastgelegd in ${path.relative(ROOT, VERSLAG)}`)
  } else {
    console.log('Dit was een proef. Draai met --doen om het echt uit te voeren.')
  }
}

main().catch((err) => { console.error('mislukt:', err); process.exitCode = 1 })
