/**
 * Schrijft docs/url-map.md op basis van config/url-map.mjs.
 *
 *   node scripts/genereer-url-map.mjs
 *
 * Zo staat er in de documentatie altijd precies wat de site ook echt doet.
 */

import { writeFile } from 'node:fs/promises'
import path from 'node:path'

import { ONGEWIJZIGD, NIEUW, REDIRECTS } from '../config/url-map.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')

const inhoud = `# Van oude naar nieuwe URL

Dit bestand wordt gemaakt door \`node scripts/genereer-url-map.mjs\` op basis van
\`config/url-map.mjs\`. Pas dus dat bestand aan, niet dit.

De site draait met \`trailingSlash: true\`. Alle oude pagina-URL's eindigden op
een slash en blijven daardoor **letterlijk hetzelfde werken**. Dat is het beste
wat je voor de vindbaarheid kunt doen: geen enkele bestaande link, bladwijzer of
zoekresultaat raakt kapot.

---

## Blijft precies zoals het was (${ONGEWIJZIGD.length} pagina's)

Geen redirect nodig. Deze adressen werken na de overstap nog gewoon.

| URL | Pagina |
|---|---|
${ONGEWIJZIGD.map((p) => `| \`${p.url}\` | ${p.titel} |`).join('\n')}

---

## Verhuist, met een permanente doorverwijzing (${REDIRECTS.length} regels)

Deze adressen krijgen een 301: zoekmachines weten dan dat het adres definitief
veranderd is en nemen de opgebouwde waarde mee naar het nieuwe adres.

| Oud adres | Nieuw adres | Waarom |
|---|---|---|
${REDIRECTS.map((r) => `| \`${r.van}\` | \`${r.naar}\` | ${r.reden} |`).join('\n')}

---

## Nieuw op de site (${NIEUW.length} pagina's)

Deze pagina's bestonden nog niet op de oude site.

| URL | Pagina |
|---|---|
${NIEUW.map((p) => `| \`${p.url}\` | ${p.titel} |`).join('\n')}

---

## Afbeeldingen

De oude site serveerde afbeeldingen vanuit \`/wp-content/uploads/...\`. Die
adressen worden niet één voor één doorverwezen: het zijn er ruim 250, ze staan
niet in zoekresultaten en ze worden nergens meer gebruikt. De originelen zijn
wel allemaal bewaard in \`assets-original/\`, en de site gebruikt de verwerkte
versies uit \`public/beeld/\`.

Blijkt uit Search Console dat een bepaalde afbeelding tóch verkeer trekt, dan is
daar alsnog een regel voor toe te voegen in \`config/url-map.mjs\`.

---

## Controleren

\`tests/e2e/redirects.spec.ts\` loopt deze hele lijst na op de draaiende site.
Zo weet je zeker dat elke regel het ook echt doet, en niet alleen op papier.
`

await writeFile(path.join(ROOT, 'docs', 'url-map.md'), inhoud)
console.log('[url-map] docs/url-map.md bijgewerkt')
