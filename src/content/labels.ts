/**
 * De teksten bij de keuzevelden van het formulier.
 *
 * Staan hier apart, omdat zowel het formulier in de browser als de e-mail op
 * de server ze nodig heeft - en die laatste mag niets uit een clientbestand
 * halen.
 */

export const LABELS = {
  keuze: {
    afspraak: 'Ik wil graag een afspraak maken',
    informatie: 'Ik wil graag meer informatie',
  },
  dagen: {
    woensdag: 'Woensdag',
    donderdag: 'Donderdag',
    vrijdag: 'Vrijdag',
    zaterdag: 'Zaterdag',
  },
  dagdelen: {
    ochtend: 'Ochtend',
    middag: 'Middag',
    avond: 'Avond (in overleg)',
  },
  onderwerpen: {
    oogmeting: 'Oogmeting',
    brillen: 'Brillen',
    zonnebrillen: 'Zonnebrillen',
    contactlenzen: 'Contactlenzen',
    kinderbrillen: 'Kinderbrillen',
    loepbrillen: 'Loepbrillen',
    'bril-bijstellen': 'Bril bijstellen',
  },
} as const
