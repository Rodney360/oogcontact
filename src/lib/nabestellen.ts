/**
 * Contactlenzen nabestellen: de regels en het bericht dat eruit komt.
 *
 * Er wordt hier niets verstuurd. Het formulier zet de bestelling om in een
 * kant-en-klaar bericht, en de bezoeker verstuurt dat zelf via WhatsApp of
 * per e-mail. Zo werkt het zonder mailsleutel, en komt de bestelling binnen op
 * de plek waar Gerard en Gerda toch al kijken.
 *
 * Gewone TypeScript zonder afhankelijkheden: dit draait in de browser, en de
 * unit-tests lezen het rechtstreeks.
 */

import { TELEFOON_PATROON } from './veldregels.ts'

export type Soort = 'dag' | 'tweeweeks' | 'maand' | 'hard'
export type Ogen = 'beide' | 'links' | 'rechts'

export type Bestelling = {
  naam: string
  telefoon: string
  /** Niet verplicht. Zoals een datumveld hem geeft: "1970-03-15". */
  geboortedatum: string
  soort: Soort | ''
  ogen: Ogen
  /** Per oog. Bij daglenzen in stuks, bij harde lenzen in lenzen, anders in doosjes. */
  aantal: number
  vloeistof: 'ja' | 'nee' | ''
  opmerking: string
}

/**
 * Hoe er besteld wordt, per soort lens.
 *
 * Daglenzen gaan per 30 stuks: dat is de kleinste hoeveelheid. Maandlenzen
 * alleen per doosje van 6. Dat laatste wordt later nog verder uitgewerkt
 * (Gerard, 6 oktober 2026); zie docs/open-punten.md.
 *
 * Bij tweewekelijkse lenzen is niet bekend hoeveel er in een doosje zitten, dus
 * daar staat alleen "doosjes", zonder een getal dat we zelf verzonnen hebben.
 * Harde lenzen worden per lens besteld.
 */
export const REGELS: Record<Soort, { stap: number; eenheid: (n: number) => string; uitleg: string }> = {
  dag: {
    stap: 30,
    eenheid: (n) => `${n} daglenzen`,
    uitleg: 'Daglenzen gaan per 30 stuks. 30 per oog is ongeveer een maand.',
  },
  tweeweeks: {
    stap: 1,
    eenheid: (n) => (n === 1 ? '1 doosje' : `${n} doosjes`),
    uitleg: 'Geef aan hoeveel doosjes je nodig hebt.',
  },
  maand: {
    stap: 1,
    eenheid: (n) => (n === 1 ? '1 doosje van 6' : `${n} doosjes van 6`),
    uitleg: 'Maandlenzen gaan per doosje van 6. Een doosje is ongeveer een half jaar per oog.',
  },
  hard: {
    stap: 1,
    eenheid: (n) => (n === 1 ? '1 lens' : `${n} lenzen`),
    uitleg: 'Geef aan hoeveel lenzen je nodig hebt.',
  },
}

export const LEGE_BESTELLING: Bestelling = {
  naam: '',
  telefoon: '',
  geboortedatum: '',
  soort: '',
  ogen: 'beide',
  aantal: 0,
  vloeistof: '',
  opmerking: '',
}

export const SOORT_LABELS: Record<Soort, string> = {
  dag: 'Daglenzen',
  tweeweeks: 'Tweewekelijkse lenzen',
  maand: 'Maandlenzen',
  hard: 'Harde lenzen',
}
export const OGEN_LABELS: Record<Ogen, string> = {
  beide: 'Beide ogen',
  links: 'Alleen links',
  rechts: 'Alleen rechts',
}
export const VLOEISTOF_LABELS = { ja: 'Met lenzenvloeistof', nee: 'Zonder lenzenvloeistof' } as const

/** De kleinste hoeveelheid voor een soort: daar begint de teller. */
export function beginAantal(soort: Soort): number {
  return REGELS[soort].stap
}

/** Een stap omhoog of omlaag, nooit onder de kleinste hoeveelheid. */
export function volgendAantal(soort: Soort, huidig: number, richting: 1 | -1): number {
  const { stap } = REGELS[soort]
  return Math.max(stap, Math.min(huidig + richting * stap, stap * 20))
}

/** "1970-03-15" wordt "15-03-1970", zoals je hem in Nederland opschrijft. */
export function datumNederlands(iso: string): string {
  const [jaar, maand, dag] = iso.split('-')
  return `${dag}-${maand}-${jaar}`
}

function geldigeGeboortedatum(iso: string, vandaag: Date): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false
  const [jaar = 0, maand = 0, dag = 0] = iso.split('-').map(Number)
  const d = new Date(Date.UTC(jaar, maand - 1, dag))
  // Bestaat de datum echt (geen 31 februari), en ligt hij in het verleden?
  return d.getUTCDate() === dag && jaar >= 1900 && d.getTime() <= vandaag.getTime()
}

export function nabestelFouten(
  b: Bestelling,
  vandaag: Date = new Date(),
): Partial<Record<keyof Bestelling, string>> {
  const fouten: Partial<Record<keyof Bestelling, string>> = {}
  if (!b.naam.trim()) fouten.naam = 'Vul je naam in, dan weten we voor wie de lenzen zijn.'
  if (b.telefoon.trim() && !TELEFOON_PATROON.test(b.telefoon.trim())) {
    fouten.telefoon = 'Dit lijkt geen geldig telefoonnummer. Bijvoorbeeld: 06 12 34 56 78.'
  }
  if (b.geboortedatum && !geldigeGeboortedatum(b.geboortedatum, vandaag)) {
    fouten.geboortedatum = 'Dit lijkt geen geldige geboortedatum.'
  }
  if (!b.soort) fouten.soort = 'Kies welke lenzen je draagt.'
  else if (b.aantal < REGELS[b.soort].stap || b.aantal % REGELS[b.soort].stap !== 0) {
    fouten.aantal = REGELS[b.soort].uitleg
  }
  if (!b.vloeistof) fouten.vloeistof = 'Laat weten of je er lenzenvloeistof bij wilt.'
  if (b.opmerking.length > 1000) fouten.opmerking = 'Houd je opmerking bij 1000 tekens.'
  return fouten
}

/** Het bericht zoals het in WhatsApp of in de mail komt te staan. */
export function nabestelBericht(b: Bestelling): string {
  if (!b.soort) throw new Error('Eerst een soort lens kiezen.')
  const { eenheid } = REGELS[b.soort]
  const aantalRegel =
    b.ogen === 'beide'
      ? `${eenheid(b.aantal)} per oog, voor beide ogen`
      : `${eenheid(b.aantal)}, ${b.ogen === 'links' ? 'alleen voor links' : 'alleen voor rechts'}`

  const regels = [
    'Hallo Gerard en Gerda,',
    '',
    'Ik wil graag contactlenzen nabestellen, zonder controleafspraak.',
    '',
    `Naam: ${b.naam.trim()}`,
    ...(b.telefoon.trim() ? [`Telefoon: ${b.telefoon.trim()}`] : []),
    ...(b.geboortedatum ? [`Geboortedatum: ${datumNederlands(b.geboortedatum)}`] : []),
    `Soort: ${SOORT_LABELS[b.soort]}`,
    `Aantal: ${aantalRegel}`,
    `Lenzenvloeistof: ${b.vloeistof === 'ja' ? 'ja, graag' : 'nee, niet nodig'}`,
    ...(b.opmerking.trim() ? ['', `Opmerking: ${b.opmerking.trim()}`] : []),
  ]
  return regels.join('\n')
}

export const NABESTEL_ONDERWERP = 'Contactlenzen nabestellen'
