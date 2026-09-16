/**
 * Haalt de volledige oude WordPress-site op en legt hem vast als bronarchief.
 *
 *   node scripts/crawl-wordpress.mjs
 *
 * Levert:
 *   content-archive/pages/<slug>.md    - tekst per pagina, met originele URL bovenaan
 *   content-archive/posts/<slug>.md    - tekst per nieuwsbericht
 *   content-archive/_raw/*.json        - onbewerkte API-antwoorden (voor naslag)
 *   content-archive/media-index.json   - alle mediabestanden met formaat en herkomst
 *   assets-original/<jaar-maand>/...   - de originele afbeeldingen in volle resolutie
 *
 * Dit archief is BRONMATERIAAL. De teksten op de nieuwe site worden apart
 * geschreven (zie docs/teksten-review.md) - pas dit archief dus niet met de hand aan.
 */

import { mkdir, writeFile, access } from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'
import { Readable } from 'node:stream'

const SITE = 'https://oogcontactbijgerard.nl'
const ROOT = path.resolve(import.meta.dirname, '..')
const ARCHIVE = path.join(ROOT, 'content-archive')
const RAW = path.join(ARCHIVE, '_raw')
const ORIGINALS = path.join(ROOT, 'assets-original')

const log = (...a) => console.log('[crawl]', ...a)

/* ---------------------------------------------------------------- ophalen */

async function getJson(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'oogcontact-migratie/1.0' } })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} voor ${url}`)
  return { body: await res.json(), headers: res.headers }
}

/** Haalt een volledige WP-collectie op, inclusief alle vervolgpagina's. */
async function getAll(type) {
  const out = []
  let page = 1
  for (;;) {
    const url = `${SITE}/wp-json/wp/v2/${type}?per_page=100&page=${page}`
    const { body, headers } = await getJson(url)
    out.push(...body)
    const totalPages = Number(headers.get('x-wp-totalpages') || '1')
    if (page >= totalPages) break
    page += 1
  }
  log(`${type}: ${out.length} gevonden`)
  return out
}

/* ------------------------------------------------------- HTML -> Markdown */

const ENTITIES = {
  '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
  '&#039;': "'", '&#8217;': '’', '&#8216;': '‘', '&#8220;': '“',
  '&#8221;': '”', '&#8211;': '–', '&#8212;': '—', '&#8230;': '…',
  '&hellip;': '…', '&eacute;': 'é', '&euro;': '€', '&#8364;': '€',
}

function decodeEntities(s) {
  let out = s
  for (const [k, v] of Object.entries(ENTITIES)) out = out.split(k).join(v)
  return out
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .normalize('NFC')
}

/**
 * Zet de door WordPress gerenderde HTML om naar leesbare Markdown.
 * Bewust simpel: dit archief is om te lezen, niet om opnieuw te publiceren.
 */
function htmlToMarkdown(html) {
  let s = html

  // weg met alles wat geen inhoud is
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '')
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '')
  s = s.replace(/<!--[\s\S]*?-->/g, '')

  // afbeeldingen als Markdown, met alt-tekst en bron
  s = s.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = /\bsrc="([^"]*)"/i.exec(tag)?.[1] ?? ''
    const alt = /\balt="([^"]*)"/i.exec(tag)?.[1] ?? ''
    return `\n\n![${alt}](${src})\n\n`
  })

  // iframes (YouTube, agenda) expliciet noteren
  s = s.replace(/<iframe\b[^>]*\bsrc="([^"]*)"[^>]*>[\s\S]*?<\/iframe>/gi,
    (_, src) => `\n\n> INGESLOTEN: ${src}\n\n`)

  s = s.replace(/<br\s*\/?>/gi, '\n')
  s = s.replace(/<\/(p|div|section|li|tr|figure|figcaption)>/gi, '\n\n')
  s = s.replace(/<li\b[^>]*>/gi, '- ')
  s = s.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi,
    (_, lvl, inner) => `\n\n${'#'.repeat(Number(lvl))} ${inner.replace(/<[^>]+>/g, '').trim()}\n\n`)
  s = s.replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, inner) => `**${inner.trim()}**`)
  s = s.replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, inner) => `*${inner.trim()}*`)
  s = s.replace(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    return text ? `[${text}](${href})` : ''
  })

  s = s.replace(/<[^>]+>/g, '')
  s = decodeEntities(s)

  // opschonen: geen eindeloze lege regels of spaties aan het eind van een regel
  s = s.split('\n').map((line) => line.replace(/[ \t]+$/g, '').replace(/^[ \t]+/, (m) => (m.length > 3 ? '' : m))).join('\n')
  s = s.replace(/\n{3,}/g, '\n\n')
  return s.trim()
}

/* ------------------------------------------------------- archief schrijven */

function frontMatterValue(v) {
  return `"${String(v ?? '').replace(/"/g, '\\"')}"`
}

function toArchiveMarkdown(item, kind) {
  const title = decodeEntities(item.title?.rendered ?? '').replace(/<[^>]+>/g, '').trim()
  const excerpt = htmlToMarkdown(item.excerpt?.rendered ?? '')
  const body = htmlToMarkdown(item.content?.rendered ?? '')

  const head = [
    '---',
    `bron_url: ${frontMatterValue(item.link)}`,
    `type: ${kind}`,
    `wp_id: ${item.id}`,
    `slug: ${frontMatterValue(item.slug)}`,
    `titel: ${frontMatterValue(title)}`,
    `gepubliceerd: ${frontMatterValue(item.date)}`,
    `gewijzigd: ${frontMatterValue(item.modified)}`,
    `status: ${frontMatterValue(item.status)}`,
    `bovenliggend: ${item.parent ?? 0}`,
    '---',
    '',
    `<!-- Bronarchief van de oude WordPress-site. Niet met de hand bewerken. -->`,
    '',
    `# ${title}`,
    '',
  ].join('\n')

  const parts = [head]
  if (excerpt) parts.push(`> Samenvatting (WordPress): ${excerpt}`, '')
  parts.push(body, '')
  return parts.join('\n')
}

/* ----------------------------------------------------- afbeeldingen ophalen */

/** De echte upload-URL, dus niet de door Beaver Builder verkleinde cache-versie. */
function isOriginalUpload(url) {
  return url.includes('/wp-content/uploads/') && !url.includes('/bb-plugin/cache/')
}

async function exists(p) {
  try { await access(p); return true } catch { return false }
}

async function downloadMedia(media) {
  let downloaded = 0
  let skipped = 0
  const failures = []

  for (const [i, item] of media.entries()) {
    const src = item.source_url
    if (!src || !isOriginalUpload(src)) { skipped += 1; continue }

    // /wp-content/uploads/2021/04/foto.png -> assets-original/2021-04/foto.png
    const rel = src.split('/wp-content/uploads/')[1]
    const segments = rel.split('/')
    const file = segments.pop()
    const folder = segments.join('-') || 'overig'
    const dest = path.join(ORIGINALS, folder, decodeURIComponent(file))

    if (await exists(dest)) { skipped += 1; continue }

    try {
      await mkdir(path.dirname(dest), { recursive: true })
      const res = await fetch(src)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      await pipeline(Readable.fromWeb(res.body), createWriteStream(dest))
      downloaded += 1
      if (downloaded % 25 === 0) log(`afbeeldingen: ${downloaded} opgehaald (${i + 1}/${media.length})`)
    } catch (err) {
      failures.push({ src, reden: String(err.message ?? err) })
    }
  }

  log(`afbeeldingen klaar: ${downloaded} nieuw, ${skipped} overgeslagen, ${failures.length} mislukt`)
  return { downloaded, skipped, failures }
}

/* -------------------------------------------------------------------- main */

async function main() {
  await mkdir(RAW, { recursive: true })
  await mkdir(path.join(ARCHIVE, 'pages'), { recursive: true })
  await mkdir(path.join(ARCHIVE, 'posts'), { recursive: true })
  await mkdir(ORIGINALS, { recursive: true })

  const [pages, posts, media, categories] = await Promise.all([
    getAll('pages'), getAll('posts'), getAll('media'), getAll('categories'),
  ])

  for (const [name, data] of Object.entries({ pages, posts, media, categories })) {
    await writeFile(path.join(RAW, `${name}.json`), JSON.stringify(data, null, 2) + '\n')
  }

  for (const page of pages) {
    // /home/ultiem-nauwkeurig-zicht/ heeft dezelfde slug als de losse pagina
    const name = page.parent ? `${page.slug}--onder-${page.parent}` : page.slug
    await writeFile(path.join(ARCHIVE, 'pages', `${name}.md`), toArchiveMarkdown(page, 'pagina'))
  }
  for (const post of posts) {
    await writeFile(path.join(ARCHIVE, 'posts', `${post.slug}.md`), toArchiveMarkdown(post, 'bericht'))
  }
  log(`archief geschreven: ${pages.length} pagina's, ${posts.length} berichten`)

  const mediaIndex = media.map((m) => ({
    id: m.id,
    bestand: m.source_url,
    titel: decodeEntities(m.title?.rendered ?? ''),
    alt: decodeEntities(m.alt_text ?? ''),
    mime: m.mime_type,
    breedte: m.media_details?.width ?? null,
    hoogte: m.media_details?.height ?? null,
    geupload: m.date,
    origineel: isOriginalUpload(m.source_url ?? ''),
  })).sort((a, b) => String(a.bestand).localeCompare(String(b.bestand)))

  await writeFile(path.join(ARCHIVE, 'media-index.json'), JSON.stringify(mediaIndex, null, 2) + '\n')

  const result = await downloadMedia(media)
  if (result.failures.length) {
    await writeFile(path.join(ARCHIVE, 'media-mislukt.json'), JSON.stringify(result.failures, null, 2) + '\n')
    log('mislukte downloads staan in content-archive/media-mislukt.json')
  }

  log('klaar')
}

main().catch((err) => { console.error('[crawl] mislukt:', err); process.exitCode = 1 })
