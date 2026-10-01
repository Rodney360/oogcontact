/**
 * Schakelaars: onderdelen die aan of uit kunnen, zonder dat er code verdwijnt.
 *
 * Bewust gewoon JavaScript, net als url-map.mjs, zodat de pagina's én de tests
 * uit dezelfde bron lezen. Zo kan een test niet iets controleren wat helemaal
 * niet meer op de site staat.
 */

/**
 * Het terugbelformulier op /afspraak-maken/ en /contact/.
 *
 * Staat uit sinds 22 september 2026. Gerard en Gerda willen dat bezoekers
 * appen of zelf een moment kiezen in de agenda; een formulier waar iemand op
 * moet wachten past daar niet bij.
 *
 * Alles blijft staan: het formulier zelf (src/components/ContactFormulier.tsx),
 * het versturen van de mail en de controle op spam. Zet deze regel op `true`
 * en het staat er weer, op allebei de pagina's tegelijk.
 *
 * Let op: staat dit uit, dan verstuurt de site nergens meer e-mail. De sleutel
 * van Resend is dan dus niet nodig om live te kunnen. Zie docs/live-gaan.md.
 */
export const TERUGBELFORMULIER_AAN = false

/**
 * De loepbrillen van Admetec.
 *
 * Staat uit sinds 25 september 2026: Oogcontact bij Gerard is er tijdelijk mee
 * gestopt. Alles blijft bestaan - de pagina zelf
 * (`src/app/loepbrillen/page.tsx`), de teksten in
 * `src/content/teksten/loepbrillen.json`, de foto's en de afspraken - maar
 * niets ervan is nog te zien of te vinden.
 *
 * Wat deze schakelaar regelt zodra hij op `true` staat:
 *
 *   - Loepbrillen staan weer in het menu en tussen de beeldtegels op de
 *     homepage (`src/content/navigatie.ts`)
 *   - `/loepbrillen/` is weer een echte pagina in plaats van een doorverwijzing
 *     naar `/aanbod/` (`config/url-map.mjs`)
 *   - De twee loepbrilafspraken staan weer in de lijst met diensten
 *     (`src/content/diensten.ts`)
 *   - Admetec staat weer bij de merken (`src/content/merken.ts`)
 *   - De browsertests lopen die pagina weer na
 *
 * Wat hij NIET regelt: de lopende teksten op andere pagina's. Daar stond
 * "brillen, zonnebrillen, contactlenzen, een kinderbril of een loepbril" en dat
 * soort zinnen; die zijn met de hand aangepast. Zet je de loepbrillen weer aan,
 * loop dan `docs/loepbrillen-terugzetten.md` na - daar staat precies welke
 * zinnen het waren.
 */
export const LOEPBRILLEN_AAN = false

/**
 * De video over de oogmeting op /ultiem-nauwkeurig-zicht/.
 *
 * Staat uit sinds 1 oktober 2026, tot er een nieuwe link voor de video is.
 * Tot die tijd staat het hele blok "Zien hoe het werkt" eraf - de kop, de zin
 * erboven en de video zelf.
 *
 * Alles blijft bestaan: de speler (`src/components/Video.tsx`), het nummer van
 * de video in `src/content/bedrijf.ts` en de uitleg in de cookieverklaring.
 * Zet deze regel op `true` en het staat er weer; de cookieverklaring vertelt
 * dan ook weer over YouTube.
 *
 * Komt er een nieuwe video? Dan hoeft alleen `video.youtubeId` in
 * `src/content/bedrijf.ts` vervangen te worden, met de titel erbij.
 *
 * De regels voor YouTube in `next.config.ts` (`frame-src` en `img-src`) blijven
 * staan. Ze laten op zichzelf niets zien en niets laden; ze staan klaar voor
 * als de video terugkomt.
 */
export const VIDEO_AAN = false
