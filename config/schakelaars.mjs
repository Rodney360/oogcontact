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
