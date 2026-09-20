/**
 * De merken in de collectie.
 *
 * De merknamen komen letterlijk van de huidige site (de pagina's Brillen en
 * Zonnebrillen). De herkomst is NIET van de site af te lezen; die staat er
 * alleen bij waar hij algemeen bekend is, en moet door Gerard en Gerda
 * bevestigd worden - zie docs/open-punten.md.
 *
 * Gerard en Gerda kunnen dit later zelf bijhouden in Keystatic
 * (content/merken/). Zolang daar niets staat, wordt deze lijst getoond.
 */

export type Merk = {
  naam: string
  /** Land van herkomst. null = nog te bevestigen, wordt dan niet getoond. */
  herkomst: string | null
  /** Waar het merk voor gebruikt wordt. */
  soorten: ('monturen' | 'zonnebrillen' | 'sport' | 'glazen' | 'loepbrillen')[]
  /** Een of twee zinnen. Alleen als we het zeker weten. */
  toelichting?: string
  /** Of de herkomst nog bevestigd moet worden door de eigenaar. */
  herkomstBevestigd: boolean
}

export const MERKEN: Merk[] = [
  { naam: 'Etnia Barcelona', herkomst: 'Spanje', soorten: ['monturen', 'zonnebrillen'], herkomstBevestigd: false },
  { naam: 'Gigi Studios', herkomst: 'Spanje', soorten: ['monturen', 'zonnebrillen'], herkomstBevestigd: false },
  { naam: 'Gotti', herkomst: 'Zwitserland', soorten: ['monturen', 'zonnebrillen'], herkomstBevestigd: false },
  { naam: 'Einstoffen', herkomst: 'Zwitserland', soorten: ['monturen', 'zonnebrillen'], herkomstBevestigd: false },
  { naam: 'Caroline Abram', herkomst: 'Frankrijk', soorten: ['monturen'], herkomstBevestigd: false },
  { naam: 'Odette Lunettes', herkomst: 'België', soorten: ['monturen', 'zonnebrillen'], herkomstBevestigd: false },
  { naam: 'Gloryfy', herkomst: 'Oostenrijk', soorten: ['sport', 'zonnebrillen'], toelichting: 'Onbreekbare sportbrillen.', herkomstBevestigd: false },
  { naam: 'Randolph', herkomst: null, soorten: ['zonnebrillen'], herkomstBevestigd: false },
  { naam: 'Penn and Ink', herkomst: null, soorten: ['monturen', 'zonnebrillen'], herkomstBevestigd: false },
  { naam: 'Bloomdale', herkomst: null, soorten: ['monturen'], herkomstBevestigd: false },
  { naam: 'Visionario', herkomst: null, soorten: ['zonnebrillen'], herkomstBevestigd: false },
  { naam: 'Serengeti', herkomst: null, soorten: ['zonnebrillen'], herkomstBevestigd: false },
]

/** Glazen en loepbrillen zijn geen montuurmerken, maar horen er wel bij. */
export const LEVERANCIERS = [
  {
    naam: 'Essilor',
    waarvoor: 'Brillenglazen',
    toelichting:
      'De glazen komen van Essilor. Varilux voor multifocaal, Eyezen voor beeldschermwerk ' +
      'en Stellest voor het afremmen van bijziendheid bij kinderen.',
  },
  {
    naam: 'Admetec',
    waarvoor: 'Loepbrillen',
    toelichting:
      'Handgemaakte vergrootloepen en ledverlichting, voor werk waarbij je het heel precies ' +
      'moet zien.',
  },
]

/** De herkomsten die we (onder voorbehoud) kennen, voor het overzicht. */
export function herkomsten(): string[] {
  return [...new Set(MERKEN.map((m) => m.herkomst).filter((h): h is string => h !== null))].sort()
}
