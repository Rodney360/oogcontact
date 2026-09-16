/**
 * Maakt een agendabestand (.ics) van een afspraak, zodat de bezoeker hem in
 * één klik in zijn eigen agenda kan zetten.
 *
 * De tijd wordt weggeschreven in Europe/Amsterdam met de zomer- en
 * wintertijdregels erbij. Zo staat de afspraak ook goed in de agenda van
 * iemand die op dat moment in een ander land is.
 */

import { BEDRIJF, adresOpEenRegel } from '../content/bedrijf.ts'

/**
 * De zomertijdregels van Europe/Amsterdam, zoals agenda-programma's ze willen.
 * Deze regels gelden sinds 1996 en veranderen niet uit zichzelf.
 */
const TIJDZONE_BLOK = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Amsterdam',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

/** Tekens die in een .ics-bestand een bijzondere betekenis hebben. */
function ontsnap(tekst: string): string {
  return tekst
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/**
 * Regels in een .ics mogen niet langer zijn dan 75 tekens; langere regels
 * worden afgebroken met een spatie aan het begin van de volgende regel.
 */
function vouw(regel: string): string {
  if (regel.length <= 75) return regel
  const delen: string[] = [regel.slice(0, 75)]
  let rest = regel.slice(75)
  while (rest.length > 74) {
    delen.push(' ' + rest.slice(0, 74))
    rest = rest.slice(74)
  }
  if (rest) delen.push(' ' + rest)
  return delen.join('\r\n')
}

export type AfspraakVoorAgenda = {
  dienstNaam: string
  /** "2026-09-16" */
  datum: string
  /** "09:30" */
  tijd: string
  duurMinuten: number
  referentie: string
}

export function maakIcs(afspraak: AfspraakVoorAgenda): string {
  const [uur, minuut] = afspraak.tijd.split(':').map(Number)
  const beginMinuten = (uur ?? 0) * 60 + (minuut ?? 0)
  const eindMinuten = beginMinuten + afspraak.duurMinuten

  const stempel = (minuten: number) =>
    `${afspraak.datum.replace(/-/g, '')}T` +
    `${String(Math.floor(minuten / 60) % 24).padStart(2, '0')}` +
    `${String(minuten % 60).padStart(2, '0')}00`

  const regels = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Oogcontact bij Gerard//Afspraak//NL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...TIJDZONE_BLOK,
    'BEGIN:VEVENT',
    `UID:${afspraak.referentie}@oogcontactbijgerard.nl`,
    // Een vaste stempel op basis van de afspraak zelf: elke keer hetzelfde
    // bestand voor dezelfde afspraak, wat agenda's prettig vinden.
    `DTSTAMP:${afspraak.datum.replace(/-/g, '')}T000000Z`,
    `DTSTART;TZID=Europe/Amsterdam:${stempel(beginMinuten)}`,
    `DTEND;TZID=Europe/Amsterdam:${stempel(eindMinuten)}`,
    `SUMMARY:${ontsnap(`${afspraak.dienstNaam} bij ${BEDRIJF.naam}`)}`,
    `LOCATION:${ontsnap(`${BEDRIJF.naam}, ${adresOpEenRegel()}`)}`,
    `DESCRIPTION:${ontsnap(
      `Je afspraak bij ${BEDRIJF.naam}.\n\n` +
        `${adresOpEenRegel()}\n` +
        `${BEDRIJF.telefoon.weergave}\n\n` +
        `Komt het toch niet uit? Laat het ons even weten.`,
    )}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${ontsnap(`Over 2 uur: ${afspraak.dienstNaam} bij ${BEDRIJF.naam}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return regels.map(vouw).join('\r\n') + '\r\n'
}
