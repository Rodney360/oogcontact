/**
 * De diensten waarvoor je een afspraak kunt maken.
 *
 * Deze lijst komt uit de bestaande online agenda (Easy!Appointments). Zodra de
 * koppeling met de agenda werkt, worden de diensten daar opgehaald en dient
 * deze lijst als terugval en als bron voor de omschrijvingen: de agenda zelf
 * bevat namelijk geen uitleg in gewone taal.
 *
 * De `sleutel` moet overeenkomen met de naam van de dienst in de agenda.
 */

export type Dienst = {
  sleutel: string
  naam: string
  /** Waarom je hiervoor komt, in gewone taal. */
  uitleg: string
  /**
   * Duur in minuten, zoals Gerard en Gerda hem hanteren. Staat er null, dan
   * rekent de boekingsmodule met een half uur.
   *
   * Let op: draait de koppeling met de agenda, dan wint de duur die daar
   * ingesteld staat. Verandert er hier iets, verander het dan ook in OO2.
   */
  duurMinuten: number | null
  /** Waar deze dienst bij hoort, voor het groeperen in de boekingsmodule. */
  groep: 'ogen meten' | 'brillen' | 'contactlenzen' | 'loepbrillen'
  /** Deze diensten laten we als eerste zien. */
  uitgelicht?: boolean
}

export const DIENSTEN: Dienst[] = [
  {
    sleutel: 'Oogmeting & montuuradvies',
    naam: 'Oogmeting en montuuradvies',
    uitleg:
      'De meest complete afspraak: we meten je ogen en zoeken daarna samen een montuur ' +
      'dat bij je gezicht en je dagelijks leven past.',
    duurMinuten: 90,
    groep: 'ogen meten',
    uitgelicht: true,
  },
  {
    sleutel: 'Oogmeting',
    naam: 'Oogmeting',
    uitleg: 'We meten je ogen tot op de honderdste nauwkeurig en meten ook je oogdruk.',
    duurMinuten: 60,
    groep: 'ogen meten',
    uitgelicht: true,
  },
  {
    sleutel: 'Glazen inmeten Visioffice',
    naam: 'Glazen inmeten (Visioffice)',
    uitleg:
      'Je hebt een montuur gekozen. Met Visioffice meten we precies hoe de glazen erin moeten, ' +
      'afgestemd op hoe jij kijkt.',
    duurMinuten: null,
    groep: 'brillen',
  },
  {
    sleutel: 'Bril afhalen',
    naam: 'Je bril afhalen',
    uitleg: 'Je bril is klaar. We zetten hem goed en lopen samen na of alles prettig zit.',
    duurMinuten: null,
    groep: 'brillen',
  },
  {
    sleutel: 'Montuur bijstellen',
    naam: 'Montuur bijstellen',
    uitleg: 'Zit je bril scheef of knelt hij? Dan zetten we hem weer goed. Kort en zo gepiept.',
    duurMinuten: 15,
    groep: 'brillen',
  },
  {
    sleutel: 'Lenzen aanmeting',
    naam: 'Contactlenzen aanmeten',
    uitleg:
      'De eerste keer lenzen. We doen een oogmeting en een topografisch onderzoek en zoeken ' +
      'de lens die bij jouw ogen past.',
    duurMinuten: 60,
    groep: 'contactlenzen',
    uitgelicht: true,
  },
  {
    sleutel: 'Lenzen heraanmeting',
    naam: 'Contactlenzen opnieuw aanmeten',
    uitleg: 'Je draagt al lenzen, maar er is iets veranderd. We kijken opnieuw wat past.',
    duurMinuten: 45,
    groep: 'contactlenzen',
  },
  {
    sleutel: 'Lenscontrole',
    naam: 'Lenscontrole',
    uitleg: 'De controle na een proefperiode: zitten de lenzen goed en bevalt het?',
    duurMinuten: null,
    groep: 'contactlenzen',
  },
  {
    sleutel: 'Loepbril Admetec informatie',
    naam: 'Loepbril: informatie',
    uitleg:
      'Je wilt weten of een loepbril iets voor je is. We laten zien wat er kan en waar je ' +
      'op moet letten. Nog geen aanmeting.',
    duurMinuten: 30,
    groep: 'loepbrillen',
  },
  {
    sleutel: 'Loepbril Admetec aanmeten/oogmeting',
    naam: 'Loepbril: aanmeten en oogmeting',
    uitleg:
      'Je kiest voor een Admetec loepbril. We doen een uitgebreide oogmeting en meten de ' +
      'loepbril precies op jouw werkafstand aan.',
    duurMinuten: 60,
    groep: 'loepbrillen',
  },
]

export const GROEPEN = ['ogen meten', 'brillen', 'contactlenzen', 'loepbrillen'] as const

/** De uitleg bij een dienst uit de agenda, op naam gezocht. */
export function uitlegVoor(naamUitAgenda: string): Dienst | undefined {
  const genormaliseerd = naamUitAgenda.trim().toLowerCase()
  return DIENSTEN.find((d) => d.sleutel.toLowerCase() === genormaliseerd)
}
