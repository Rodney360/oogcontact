/**
 * Maakt docs/teksten-review.md: alle nieuwe teksten op een rij, zodat Gerard
 * en Gerda ze kunnen nalezen en goedkeuren.
 *
 *   node scripts/genereer-teksten-review.mjs
 *
 * Het bestand wordt gemaakt uit src/content/teksten/*.json. Een tekst aanpassen
 * doe je daar (of in het beheerscherm), niet in het overzicht.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const TEKSTEN = path.join(ROOT, 'src', 'content', 'teksten')

/** De volgorde waarin de pagina's op de site staan. */
const VOLGORDE = [
  'home', 'aanbod', 'brillen', 'contactlenzen', 'zonnebrillen', 'kinderbrillen',
  'loepbrillen', 'ultiem-nauwkeurig-zicht', 'collectie', 'over-ons', 'nieuws',
  'afspraak-maken', 'contact',
]

const PAD = {
  home: '/', aanbod: '/aanbod/', brillen: '/brillen/', contactlenzen: '/contactlenzen/',
  zonnebrillen: '/zonnebrillen/', kinderbrillen: '/kinderbrillen/', loepbrillen: '/loepbrillen/',
  'ultiem-nauwkeurig-zicht': '/ultiem-nauwkeurig-zicht/', collectie: '/collectie/',
  'over-ons': '/over-ons/', nieuws: '/nieuws/', 'afspraak-maken': '/afspraak-maken/',
  contact: '/contact/',
}

async function main() {
  const bestanden = (await readdir(TEKSTEN)).filter((f) => f.endsWith('.json'))
  const paginas = await Promise.all(
    bestanden.map(async (f) => JSON.parse(await readFile(path.join(TEKSTEN, f), 'utf8'))),
  )
  paginas.sort((a, b) => VOLGORDE.indexOf(a.slug) - VOLGORDE.indexOf(b.slug))

  const delen = [
    '# De nieuwe teksten, om na te lezen',
    '',
    'Hieronder staan alle teksten van de nieuwe site bij elkaar, in de volgorde',
    'waarin ze op de pagina staan. Lees ze rustig door en laat weten wat er anders moet.',
    '',
    'Waar we op gelet hebben:',
    '',
    '- **Overal "je", nergens "u".** De oude site wisselde die twee door elkaar.',
    '- **Geen verzonnen feiten.** Alles komt van de oude site, de online agenda of van jullie.',
    '  Wat we niet zeker wisten, staat in `docs/open-punten.md` in plaats van op de site.',
    '- **Gerda staat er net zo goed in als Gerard.**',
    '- **Korte alinea’s en grote letters**, want veel bezoekers zijn 45 jaar en ouder.',
    '',
    '> Een tekst veranderen? Zeg het gewoon in je eigen woorden, dan passen we het aan.',
    '> Je hoeft niet zelf te schrijven.',
    '',
    `Dit overzicht is gemaakt op basis van de bestanden in \`src/content/teksten/\`.`,
    '',
    '---',
    '',
    '## Inhoud',
    '',
    ...paginas.map((p) => `- [${p.h1}](#${p.slug}) — \`${PAD[p.slug] ?? '/'}\``),
    '',
    '---',
    '',
  ]

  for (const pagina of paginas) {
    delen.push(
      `<a id="${pagina.slug}"></a>`,
      '',
      `## ${pagina.h1}`,
      '',
      `**Op de site:** \`${PAD[pagina.slug] ?? '/'}\``,
      '',
      '### Wat Google laat zien',
      '',
      `> **${pagina.metaTitel}**`,
      `> ${pagina.metaOmschrijving}`,
      '',
      '### De tekst op de pagina',
      '',
      `**${pagina.h1}**`,
      '',
      pagina.inleiding,
      '',
    )

    for (const sectie of pagina.secties) {
      delen.push(`#### ${sectie.kop}`, '')
      for (const alinea of sectie.alineas) delen.push(alinea, '')
      for (const punt of sectie.opsomming) delen.push(`- **${punt.titel}** — ${punt.tekst}`)
      if (sectie.opsomming.length) delen.push('')
    }

    if (pagina.vragen.length) {
      delen.push('#### Veelgestelde vragen', '')
      for (const vraag of pagina.vragen) {
        delen.push(`**${vraag.vraag}**`, '', vraag.antwoord, '')
      }
    }

    delen.push(
      '#### De uitnodiging onderaan',
      '',
      `**${pagina.oproep.kop}**`,
      '',
      pagina.oproep.tekst,
      '',
      `*Knop:* ${pagina.oproep.knop}`,
      '',
      '---',
      '',
    )
  }

  delen.push(
    '## En de nieuwsberichten?',
    '',
    'De vijf berichten van de oude site zijn overgezet met hun oorspronkelijke datum en',
    'tekst. Ze zijn allemaal van 2022 en dus achterhaald. Je kunt ze in het beheerscherm',
    'op onzichtbaar zetten of weggooien — zie `docs/handleiding-beheer.md`.',
    '',
    'De teksten van die berichten hebben we bewust niet herschreven: het zijn berichten',
    'van toen, met de datum erbij.',
    '',
  )

  await writeFile(path.join(ROOT, 'docs', 'teksten-review.md'), delen.join('\n'))
  console.log(`[teksten] docs/teksten-review.md bijgewerkt (${paginas.length} pagina's)`)
}

main().catch((err) => { console.error('[teksten] mislukt:', err); process.exitCode = 1 })
