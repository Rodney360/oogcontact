/**
 * De feiten over de winkel. Een plek, zodat ze overal hetzelfde zijn:
 * in de koptekst, de voettekst, de contactpagina, de gestructureerde data
 * voor Google en in de e-mails.
 *
 * Alles hier komt van de huidige site, de online agenda of van de eigenaar.
 * Staat er iets niet in? Dan is het ook niet bekend - niets verzinnen.
 */

export const BEDRIJF = {
  naam: 'Oogcontact bij Gerard',
  korteNaam: 'Oogcontact',
  slogan: 'Wij houden graag oogcontact.',
  eigenaren: ['Gerard Bugel', 'Gerda Bugel'] as const,

  adres: {
    straat: 'Overwinningsplein 100',
    postcode: '9728 GW',
    plaats: 'Groningen',
    land: 'NL',
    landNaam: 'Nederland',
  },

  /** Overgenomen uit de Google Maps-insluiting op de oude contactpagina. */
  geo: {
    breedtegraad: 53.197925,
    lengtegraad: 6.556001,
  },

  telefoon: {
    weergave: '050 20 64 015',
    link: '+31502064015',
  },

  whatsapp: {
    weergave: '06 18 89 85 99',
    /** Internationaal formaat zonder plus, zoals wa.me dat wil. */
    nummer: '31618898599',
    standaardBericht: 'Hallo Gerard en Gerda, ik wil graag een afspraak maken.',
  },

  email: 'info@oogcontactbijgerard.nl',

  socials: {
    instagram: 'https://www.instagram.com/oogcontactbijgerard',
    facebook: 'https://www.facebook.com/oogcontactbijgerard',
    linkedin: 'https://www.linkedin.com/company/oogcontact-bij-gerard',
  },

  /** De losse agenda van Easy!Appointments, als terugvaloptie. */
  onlineAgenda: 'https://oogcontactbijgerard.oo2.online',

  /** Video over de precieze oogmeting, van de huidige site. */
  video: {
    youtubeId: 'GenziLo23yc',
    titel: 'Een oogmeting tot op de honderdste nauwkeurig',
  },

  keurmerken: [
    {
      naam: 'ANVC',
      omschrijving: 'Algemene Nederlandse Vereniging van Contactlensspecialisten',
      url: 'https://anvc.nl/',
    },
    {
      naam: 'NUVO',
      omschrijving: 'Nederlandse Unie van Optiekbedrijven',
      url: 'https://www.nuvo.nl/',
    },
  ],

  /** 1 mei 2021: de dag dat de winkel openging. */
  geopendSinds: '2021-05-01',

  /** Nog aan te leveren door Gerard - zie docs/open-punten.md */
  kvkNummer: null as string | null,
  googleBedrijfsprofiel: null as string | null,
} as const

/** De WhatsApp-link met de begroeting er alvast in. */
export function whatsappLink(bericht: string = BEDRIJF.whatsapp.standaardBericht): string {
  return `https://wa.me/${BEDRIJF.whatsapp.nummer}?text=${encodeURIComponent(bericht)}`
}

/** Het adres op een regel, zoals je het aan iemand zou voorlezen. */
export function adresOpEenRegel(): string {
  const { straat, postcode, plaats } = BEDRIJF.adres
  return `${straat}, ${postcode} ${plaats}`
}

/** Route plannen: opent Google Maps, of Apple Maps op een iPhone of Mac. */
export function routeLink(): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${BEDRIJF.adres.straat}, ${BEDRIJF.adres.postcode} ${BEDRIJF.adres.plaats}`,
  )}`
}
