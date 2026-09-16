/**
 * Zet de nieuwsberichten uit het WordPress-archief om naar berichten die in
 * het beheerscherm te bewerken zijn.
 *
 *   node scripts/migreer-nieuws.mjs
 *
 * Dit draai je één keer, bij de overstap. De oude berichten houden hun datum
 * en hun webadres, zodat elke bestaande link naar een bericht blijft werken.
 *
 * De teksten worden bewust niet herschreven: het zijn berichten van toen, met
 * de datum erbij. Wat achterhaald is, mag Gerard in het beheerscherm op
 * onzichtbaar zetten of weggooien.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const BRON = path.join(ROOT, 'content-archive', '_raw', 'posts.json')
const DOEL = path.join(ROOT, 'src', 'content', 'beheer', 'nieuws')

const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#039;': "'", '&#8217;': '’', '&#8216;': '‘', '&#8220;': '“',
  '&#8221;': '”', '&#8211;': '–', '&#8212;': '—', '&#8230;': '…',
  '&hellip;': '…',
}

function decodeer(s) {
  let uit = s
  for (const [k, v] of Object.entries(ENTITIES)) uit = uit.split(k).join(v)
  return uit
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .normalize('NFC')
}

/** Van de HTML van WordPress naar Markdown, zoals Keystatic hem bewaart. */
function naarMarkdown(html) {
  let s = html
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '')
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '')
  s = s.replace(/<!--[\s\S]*?-->/g, '')

  s = s.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = /\bsrc="([^"]*)"/i.exec(tag)?.[1] ?? ''
    const alt = /\balt="([^"]*)"/i.exec(tag)?.[1] ?? ''
    // De afbeeldingen staan straks niet meer op de oude server.
    return src ? `\n\n<!-- afbeelding uit het archief: ${src} (alt: ${alt}) -->\n\n` : ''
  })

  s = s.replace(/<br\s*\/?>/gi, '\n')
  s = s.replace(/<\/(p|div|li|tr)>/gi, '\n\n')
  s = s.replace(/<li\b[^>]*>/gi, '- ')
  s = s.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi,
    (_, lvl, inner) => `\n\n${'#'.repeat(Math.min(6, Number(lvl) + 1))} ${inner.replace(/<[^>]+>/g, '').trim()}\n\n`)
  s = s.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, i) => `**${i.replace(/<[^>]+>/g, '').trim()}**`)
  s = s.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, i) => `*${i.replace(/<[^>]+>/g, '').trim()}*`)
  s = s.replace(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, inner) => {
    const tekst = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    return tekst ? `[${tekst}](${href})` : ''
  })

  s = s.replace(/<[^>]+>/g, '')
  s = decodeer(s)
  s = s.split('\n').map((r) => r.trim()).join('\n')
  s = s.replace(/\n{3,}/g, '\n\n')
  return s.trim()
}

/** Een korte samenvatting, uit de excerpt van WordPress of uit de tekst zelf. */
function samenvatting(bericht, tekst) {
  const uitWp = naarMarkdown(bericht.excerpt?.rendered ?? '')
    .replace(/\[?Lees meer[^\]]*\]\([^)]*\)/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  const basis = uitWp || tekst.replace(/[#*>\-]/g, '').replace(/\s+/g, ' ').trim()
  if (basis.length <= 280) return basis
  // Netjes afbreken op een zin, niet middenin een woord.
  const kort = basis.slice(0, 277)
  const punt = kort.lastIndexOf('. ')
  return (punt > 120 ? kort.slice(0, punt + 1) : `${kort.trimEnd()}…`).trim()
}

function alsFrontmatter(waarde) {
  return JSON.stringify(waarde)
}

async function main() {
  const berichten = JSON.parse(await readFile(BRON, 'utf8'))
  await mkdir(DOEL, { recursive: true })

  for (const bericht of berichten) {
    const titel = decodeer((bericht.title?.rendered ?? '').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()
    const tekst = naarMarkdown(bericht.content?.rendered ?? '')
    const datum = (bericht.date ?? '').slice(0, 10)

    const inhoud = [
      '---',
      `titel: ${alsFrontmatter(titel)}`,
      `datum: ${alsFrontmatter(datum)}`,
      `samenvatting: ${alsFrontmatter(samenvatting(bericht, tekst))}`,
      'gepubliceerd: true',
      '---',
      '',
      tekst,
      '',
    ].join('\n')

    // Keystatic bewaart een bericht als <webadres>.mdoc in de map zelf.
    await writeFile(path.join(DOEL, `${bericht.slug}.mdoc`), inhoud)
    console.log(`[nieuws] ${bericht.slug} (${datum})`)
  }

  console.log(`[nieuws] ${berichten.length} berichten overgezet naar src/content/beheer/nieuws/`)
}

main().catch((err) => { console.error('[nieuws] mislukt:', err); process.exitCode = 1 })
