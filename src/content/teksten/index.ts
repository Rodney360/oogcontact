/**
 * De teksten van de pagina's, klaar voor gebruik.
 *
 * Elke pagina heeft een eigen JSON-bestand in deze map. Ze worden hier
 * ingeladen en getypeerd, zodat je nergens op een verkeerde naam kunt
 * teruggrijpen en TypeScript het meteen zegt als er een sectie mist.
 */

import type { PaginaTekst } from '../teksten.ts'

import aanbod from './aanbod.json'
import afspraakMaken from './afspraak-maken.json'
import brillen from './brillen.json'
import collectie from './collectie.json'
import contact from './contact.json'
import contactlenzen from './contactlenzen.json'
import home from './home.json'
import kinderbrillen from './kinderbrillen.json'
import loepbrillen from './loepbrillen.json'
import nieuws from './nieuws.json'
import overOns from './over-ons.json'
import ultiemNauwkeurigZicht from './ultiem-nauwkeurig-zicht.json'
import zonnebrillen from './zonnebrillen.json'

export const TEKSTEN = {
  aanbod,
  'afspraak-maken': afspraakMaken,
  brillen,
  collectie,
  contact,
  contactlenzen,
  home,
  kinderbrillen,
  loepbrillen,
  nieuws,
  'over-ons': overOns,
  'ultiem-nauwkeurig-zicht': ultiemNauwkeurigZicht,
  zonnebrillen,
} as const satisfies Record<string, PaginaTekst>

export type TekstSleutel = keyof typeof TEKSTEN

export function tekst(sleutel: TekstSleutel): PaginaTekst {
  return TEKSTEN[sleutel]
}

/**
 * Zoekt een sectie op zijn kop.
 *
 * De homepage is opgebouwd uit losse scènes die elk hun eigen sectie nodig
 * hebben. Staat een kop er niet (bijvoorbeeld omdat een tekst herschreven is),
 * dan is dat een fout tijdens het bouwen en niet een lege plek op de site.
 */
export function sectie(pagina: PaginaTekst, kop: string) {
  const gevonden = pagina.secties.find((s) => s.kop === kop)
  if (!gevonden) {
    throw new Error(
      `De sectie "${kop}" staat niet in de tekst van ${pagina.slug}. ` +
        `Beschikbaar: ${pagina.secties.map((s) => s.kop).join(' | ')}`,
    )
  }
  return gevonden
}

/** Idem, maar op volgorde: handig als de koppen mogen wisselen. */
export function sectieOpIndex(pagina: PaginaTekst, index: number) {
  const gevonden = pagina.secties[index]
  if (!gevonden) {
    throw new Error(`Sectie ${index} bestaat niet in de tekst van ${pagina.slug}.`)
  }
  return gevonden
}
