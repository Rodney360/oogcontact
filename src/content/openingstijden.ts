/**
 * De vaste openingstijden van de winkel.
 *
 * Afwijkende dagen (feestdagen, vakantie) worden niet hier maar in Keystatic
 * bijgehouden, in content/openingstijden/uitzonderingen.json. Zo kunnen Gerard
 * en Gerda ze zelf aanpassen zonder dat er code veranderd hoeft te worden.
 */

/** Maandag = 1, zondag = 7 (net als in de echte wereld, en in ISO-8601). */
export type Weekdag = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type Dagdeel = {
  /** Minuten na middernacht. 9.30 uur is dus 570. */
  van: number
  tot: number
}

export type DagSchema = {
  dag: Weekdag
  naam: string
  korteNaam: string
  /** Leeg betekent: die dag gesloten. */
  dagdelen: Dagdeel[]
}

/** Van "9:30" naar het aantal minuten na middernacht. */
export function naarMinuten(tijd: string): number {
  const [uur, minuut] = tijd.split(':').map(Number)
  return (uur ?? 0) * 60 + (minuut ?? 0)
}

/** Van minuten na middernacht naar "9.30" - zoals Nederlanders tijden schrijven. */
export function naarTijd(minuten: number): string {
  const uur = Math.floor(minuten / 60)
  const minuut = minuten % 60
  return `${uur}.${String(minuut).padStart(2, '0')}`
}

export const WEEK: DagSchema[] = [
  { dag: 1, naam: 'maandag', korteNaam: 'ma', dagdelen: [] },
  { dag: 2, naam: 'dinsdag', korteNaam: 'di', dagdelen: [] },
  { dag: 3, naam: 'woensdag', korteNaam: 'wo', dagdelen: [{ van: naarMinuten('9:30'), tot: naarMinuten('17:30') }] },
  { dag: 4, naam: 'donderdag', korteNaam: 'do', dagdelen: [{ van: naarMinuten('9:30'), tot: naarMinuten('17:30') }] },
  { dag: 5, naam: 'vrijdag', korteNaam: 'vr', dagdelen: [{ van: naarMinuten('9:30'), tot: naarMinuten('17:30') }] },
  { dag: 6, naam: 'zaterdag', korteNaam: 'za', dagdelen: [{ van: naarMinuten('10:00'), tot: naarMinuten('16:00') }] },
  { dag: 7, naam: 'zondag', korteNaam: 'zo', dagdelen: [] },
]

/**
 * Een dag die afwijkt van het vaste schema.
 * datum in ISO-formaat: "2026-12-25".
 */
export type Uitzondering = {
  datum: string
  /** Leeg = die dag gesloten. */
  dagdelen: Dagdeel[]
  /** Bijvoorbeeld "Eerste kerstdag" of "Vakantie". Wordt aan de bezoeker getoond. */
  reden: string
}

