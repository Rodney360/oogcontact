/**
 * Toegang tot de verwerkte foto's.
 *
 * De maten en de wazige laadplaatjes worden gemaakt door `npm run images` en
 * staan in beeld-gegenereerd.json. Dit bestand maakt ze typeveilig bruikbaar.
 */

import gegenereerd from './beeld-gegenereerd.json'

export type BeeldSlot = keyof typeof gegenereerd

export type BeeldGegevens = {
  alt: string
  breedte: number
  hoogte: number
  breedtes: number[]
  blur: string
  bron: string
}

export function beeld(slot: BeeldSlot): BeeldGegevens {
  return gegenereerd[slot] as BeeldGegevens
}

/** Alle beschikbare plekken - handig voor tests en overzichten. */
export const BEELD_SLOTS = Object.keys(gegenereerd) as BeeldSlot[]
