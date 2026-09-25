/** De hoofdnavigatie van de site. */

import { LOEPBRILLEN_AAN } from '../../config/schakelaars.mjs'

export type NavItem = {
  naam: string
  pad: string
  /** Korte uitleg, getoond in het uitklapmenu op desktop. */
  uitleg?: string
  kinderen?: NavItem[]
}

/**
 * Het aanbod. Voedt zowel het uitklapmenu als de beeldtegels op de homepage,
 * dus wat hier niet in staat, is nergens te zien.
 *
 * De loepbrillen kunnen uit; zie config/schakelaars.mjs.
 */
export const AANBOD: NavItem[] = [
  { naam: 'Brillen', pad: '/brillen/', uitleg: 'Monturen en glazen, afgestemd op je ogen en je gezicht.' },
  { naam: 'Contactlenzen', pad: '/contactlenzen/', uitleg: 'Zacht of hard, dag of maand, ook multifocaal.' },
  { naam: 'Zonnebrillen', pad: '/zonnebrillen/', uitleg: 'Met bescherming die klopt, eventueel op sterkte.' },
  { naam: 'Kinderbrillen', pad: '/kinderbrillen/', uitleg: 'Stevig, leuk en technisch goed. Ook myopiecontrole.' },
  ...(LOEPBRILLEN_AAN
    ? [{ naam: 'Loepbrillen', pad: '/loepbrillen/', uitleg: 'Admetec loepbrillen voor precies werk.' }]
    : []),
]

export const HOOFDMENU: NavItem[] = [
  { naam: 'Aanbod', pad: '/aanbod/', kinderen: AANBOD },
  { naam: 'Collectie', pad: '/collectie/', uitleg: 'De merken die we uitzoeken.' },
  { naam: 'Nauwkeurig meten', pad: '/ultiem-nauwkeurig-zicht/', uitleg: 'Meten tot op de honderdste.' },
  { naam: 'Over ons', pad: '/over-ons/', uitleg: 'Gerard en Gerda, en hoe wij werken.' },
  { naam: 'Nieuws', pad: '/nieuws/' },
  { naam: 'Contact', pad: '/contact/' },
]

export const VOETMENU = {
  aanbod: AANBOD,
  winkel: [
    { naam: 'Over ons', pad: '/over-ons/' },
    { naam: 'Collectie & merken', pad: '/collectie/' },
    { naam: 'Nauwkeurig meten', pad: '/ultiem-nauwkeurig-zicht/' },
    { naam: 'Nieuws', pad: '/nieuws/' },
  ] as NavItem[],
  regelen: [
    { naam: 'Afspraak maken', pad: '/afspraak-maken/' },
    { naam: 'Contact', pad: '/contact/' },
    { naam: 'Privacyverklaring', pad: '/privacyverklaring/' },
    { naam: 'Cookieverklaring', pad: '/cookieverklaring/' },
    { naam: 'Algemene voorwaarden', pad: '/algemene-voorwaarden/' },
  ] as NavItem[],
}
