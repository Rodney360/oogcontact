/**
 * Berekent of de winkel nu open is, en wanneer hij weer opengaat.
 *
 * Alles wordt uitgerekend in de tijdzone Europe/Amsterdam, ongeacht waar de
 * server staat of waar de bezoeker zit. Een bezoeker in Spanje ziet dus gewoon
 * de Nederlandse openingstijden.
 */

import {
  WEEK,
  naarTijd,
  type Dagdeel,
  type DagSchema,
  type Uitzondering,
  type Weekdag,
} from '../content/openingstijden.ts'

export const TIJDZONE = 'Europe/Amsterdam'

type NederlandseTijd = {
  /** "2026-09-16" */
  datum: string
  /** Maandag = 1, zondag = 7. */
  weekdag: Weekdag
  /** Minuten na middernacht. */
  minuten: number
}

const WEEKDAG_NUMMER: Record<string, Weekdag> = {
  Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7,
}

/**
 * Zet een moment om naar datum, weekdag en tijd zoals ze in Nederland gelden.
 * Intl doet het zware werk, inclusief zomertijd.
 */
export function inNederland(moment: Date): NederlandseTijd {
  const delen = new Intl.DateTimeFormat('en-US', {
    timeZone: TIJDZONE,
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(moment)

  const pak = (soort: string) => delen.find((d) => d.type === soort)?.value ?? ''

  return {
    datum: `${pak('year')}-${pak('month')}-${pak('day')}`,
    weekdag: WEEKDAG_NUMMER[pak('weekday')] ?? 1,
    minuten: Number(pak('hour')) * 60 + Number(pak('minute')),
  }
}

/** Telt een aantal dagen op bij een ISO-datum, zonder tijdzonegedoe. */
function datumPlus(isoDatum: string, dagen: number): string {
  const [jaar, maand, dag] = isoDatum.split('-').map(Number)
  const d = new Date(Date.UTC(jaar ?? 1970, (maand ?? 1) - 1, dag ?? 1))
  d.setUTCDate(d.getUTCDate() + dagen)
  return d.toISOString().slice(0, 10)
}

/** Van een ISO-datum naar de weekdag (maandag = 1). */
function weekdagVan(isoDatum: string): Weekdag {
  const [jaar, maand, dag] = isoDatum.split('-').map(Number)
  const d = new Date(Date.UTC(jaar ?? 1970, (maand ?? 1) - 1, dag ?? 1))
  const js = d.getUTCDay() // zondag = 0
  return (js === 0 ? 7 : js) as Weekdag
}

export function dagSchema(weekdag: Weekdag): DagSchema {
  return WEEK.find((d) => d.dag === weekdag) ?? WEEK[0]!
}

/** De dagdelen die op een bepaalde datum gelden, uitzonderingen meegerekend. */
export function dagdelenOp(
  isoDatum: string,
  uitzonderingen: Uitzondering[],
): { dagdelen: Dagdeel[]; uitzondering: Uitzondering | null } {
  const uitzondering = uitzonderingen.find((u) => u.datum === isoDatum) ?? null
  if (uitzondering) return { dagdelen: uitzondering.dagdelen, uitzondering }
  return { dagdelen: dagSchema(weekdagVan(isoDatum)).dagdelen, uitzondering: null }
}

export type Status =
  | { open: true; sluitOm: string; tekst: string }
  | { open: false; tekst: string; opentWeer: { datum: string; tijd: string } | null }

/**
 * De status van dit moment, in gewone taal.
 *
 * @param nu           het moment om mee te rekenen (standaard: echt nu)
 * @param uitzonderingen  afwijkende dagen uit Keystatic
 */
export function huidigeStatus(nu: Date = new Date(), uitzonderingen: Uitzondering[] = []): Status {
  const { datum, minuten } = inNederland(nu)
  const vandaag = dagdelenOp(datum, uitzonderingen)

  // Zijn we nu binnen een dagdeel?
  const nuOpen = vandaag.dagdelen.find((d) => minuten >= d.van && minuten < d.tot)
  if (nuOpen) {
    return {
      open: true,
      sluitOm: naarTijd(nuOpen.tot),
      tekst: `Nu geopend · tot ${naarTijd(nuOpen.tot)} uur`,
    }
  }

  // Gaan we vandaag nog open?
  const laterVandaag = vandaag.dagdelen.find((d) => minuten < d.van)
  if (laterVandaag) {
    return {
      open: false,
      tekst: `Gesloten · vandaag open vanaf ${naarTijd(laterVandaag.van)} uur`,
      opentWeer: { datum, tijd: naarTijd(laterVandaag.van) },
    }
  }

  // Zoek de eerstvolgende dag waarop we opengaan. Twee weken vooruit is genoeg;
  // bij een langere vakantie is dat sowieso een mededeling op de site.
  for (let over = 1; over <= 14; over += 1) {
    const dag = datumPlus(datum, over)
    const { dagdelen } = dagdelenOp(dag, uitzonderingen)
    const eerste = dagdelen[0]
    if (!eerste) continue

    const naam = over === 1 ? 'morgen' : dagSchema(weekdagVan(dag)).naam
    const voorzetsel = over === 1 ? '' : 'op '
    return {
      open: false,
      tekst: `Gesloten · wij zijn weer open ${voorzetsel}${naam} vanaf ${naarTijd(eerste.van)} uur`,
      opentWeer: { datum: dag, tijd: naarTijd(eerste.van) },
    }
  }

  return { open: false, tekst: 'Gesloten', opentWeer: null }
}

/**
 * De openingstijden in het formaat dat Google verwacht (schema.org).
 * Zie https://schema.org/openingHoursSpecification
 */
export function alsSchemaOrg() {
  const dagNaam: Record<Weekdag, string> = {
    1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday',
    5: 'Friday', 6: 'Saturday', 7: 'Sunday',
  }
  const pad = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

  return WEEK.flatMap((dag) =>
    dag.dagdelen.map((deel) => ({
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: `https://schema.org/${dagNaam[dag.dag]}`,
      opens: pad(deel.van),
      closes: pad(deel.tot),
    })),
  )
}
