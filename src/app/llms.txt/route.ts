/**
 * llms.txt - een korte, feitelijke samenvatting van de winkel.
 *
 * Steeds meer mensen vinden een winkel via een AI-assistent in plaats van via
 * een zoekmachine. Die assistenten lezen dit bestand: een simpele opsomming van
 * wat we doen, waar we zitten en wanneer we open zijn, zonder opmaak.
 *
 * Alleen feiten die ook op de site staan. Niets verzinnen.
 */

import { BEDRIJF, adresOpEenRegel } from '@/content/bedrijf'
import { WEEK, naarTijd } from '@/content/openingstijden'
import { DIENSTEN } from '@/content/diensten'
import { MERKEN, LEVERANCIERS } from '@/content/merken'
import { ONGEWIJZIGD, NIEUW } from '../../../config/url-map.mjs'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-static'

export function GET() {
  const openingstijden = WEEK.map((dag) => {
    const deel = dag.dagdelen[0]
    return `- ${dag.naam}: ${deel ? `${naarTijd(deel.van)}-${naarTijd(deel.tot)}` : 'gesloten'}`
  }).join('\n')

  const paginas = [...ONGEWIJZIGD, ...NIEUW]
    .map((p) => `- [${p.titel}](${SITE_URL}${p.url})`)
    .join('\n')

  const diensten = DIENSTEN.map(
    (d) => `- ${d.naam}${d.duurMinuten ? ` (${d.duurMinuten} minuten)` : ''}: ${d.uitleg}`,
  ).join('\n')

  const merken = MERKEN.map((m) => (m.herkomst ? `${m.naam} (${m.herkomst})` : m.naam)).join(', ')

  const tekst = `# ${BEDRIJF.naam}

> Zelfstandige opticien aan het Overwinningsplein in Groningen, van Gerard en
> Gerda Bugel. Wij nemen de tijd voor je, met een kop koffie erbij.

${BEDRIJF.slogan}

## Waar we zitten

${adresOpEenRegel()}, Nederland.
Parkeren kan direct voor de deur. De bus stopt pal voor de winkel.

## Contact

- Telefoon: ${BEDRIJF.telefoon.weergave}
- WhatsApp: ${BEDRIJF.whatsapp.weergave}
- E-mail: ${BEDRIJF.email}
- Afspraak maken: ${SITE_URL}/afspraak-maken/

## Openingstijden (Europe/Amsterdam)

${openingstijden}

Let op: er kunnen afwijkende dagen zijn voor feestdagen en vakantie. De
actuele status staat op ${SITE_URL}/contact/.

## Wat we doen

${diensten}

## Achtergrond

- Eigen winkel sinds 1 mei 2021, aan het Overwinningsplein 100 in Groningen.
- Ruim 40 jaar ervaring in de optiek, waarvan 15 jaar bij OMC-Hanzekliniek
  (nu Eyescan), dus met een medische achtergrond.
- Gerard en Gerda leerden elkaar daar kennen als collega's en runnen de winkel
  samen. De kleinere merken kopen ze samen in; het etaleren doet Gerda.
- Werkwijze bij een montuur: Gerard doet de oogmeting, daarna zoekt Gerda samen
  met de klant langs de wand het montuur dat past.
- Aangesloten bij ${BEDRIJF.keurmerken.map((k) => k.naam).join(' en ')}.

## Collectie

Bewust geen nadruk op de grote modemerken, maar op kleine leveranciers van
stijlvolle, kwalitatief sterke monturen, vooral uit Spanje en Zwitserland, ook
uit Frankrijk, België, Oostenrijk en Nederland.

Merken: ${merken}.

${LEVERANCIERS.map((l) => `${l.waarvoor}: ${l.naam}. ${l.toelichting}`).join('\n')}

## Pagina's

${paginas}

## Bronnen

- Sitemap: ${SITE_URL}/sitemap.xml
${Object.entries(BEDRIJF.socials)
  .map(([naam, url]) => `- ${naam.charAt(0).toUpperCase() + naam.slice(1)}: ${url}`)
  .join('\n')}
`

  return new Response(tekst, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
