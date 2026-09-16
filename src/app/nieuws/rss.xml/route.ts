/**
 * De RSS-feed van het nieuws.
 *
 * De oude WordPress-site had een feed op /feed/. Die verwijst nu hierheen,
 * zodat wie zich daarop geabonneerd had niets mist.
 */

import { berichten } from '@/lib/beheer'
import { BEDRIJF } from '@/content/bedrijf'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-static'

/** Tekens die in XML een bijzondere betekenis hebben. */
function veilig(tekst: string): string {
  return tekst
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** RSS wil een datum in het formaat van RFC 822. */
function rssDatum(iso: string): string {
  if (!iso) return ''
  const [jaar, maand, dag] = iso.split('-').map(Number)
  return new Date(Date.UTC(jaar ?? 1970, (maand ?? 1) - 1, dag ?? 1, 9)).toUTCString()
}

export async function GET() {
  const alles = await berichten()

  const items = alles
    .map((bericht) => {
      const url = `${SITE_URL}/nieuws/${bericht.slug}/`
      return `    <item>
      <title>${veilig(bericht.titel)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${veilig(bericht.samenvatting)}</description>
      <pubDate>${rssDatum(bericht.datum)}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${veilig(BEDRIJF.naam)} · nieuws</title>
    <link>${SITE_URL}/nieuws/</link>
    <description>Het laatste nieuws van ${veilig(BEDRIJF.naam)}, opticien in Groningen.</description>
    <language>nl-NL</language>
    <atom:link href="${SITE_URL}/nieuws/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
