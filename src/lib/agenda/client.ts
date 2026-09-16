import 'server-only'

/**
 * De koppeling met de online agenda (Easy!Appointments).
 *
 * Alles hier draait op de server. De sleutel van de agenda staat in de
 * omgevingsvariabelen van Vercel en komt nooit in de browser terecht.
 *
 * ZONDER SLEUTEL draait alles in testmodus: er komen dan verzonnen maar
 * geloofwaardige tijden terug en een boeking wordt alleen in het logboek
 * geschreven. Zo werkt de site ook op een computer zonder sleutels, en kunnen
 * de tests altijd draaien.
 */

import { DIENSTEN, uitlegVoor } from '../../content/diensten.ts'
import { WEEK } from '../../content/openingstijden.ts'
import type { AgendaDienst, BoekingGegevens, BoekingResultaat, VrijeDag } from './soorten.ts'

const BASIS = (process.env.EASYAPPOINTMENTS_URL ?? '').replace(/\/$/, '')
const SLEUTEL = process.env.EASYAPPOINTMENTS_API_KEY ?? ''
const GEBRUIKER = process.env.EASYAPPOINTMENTS_GEBRUIKER ?? ''
const WACHTWOORD = process.env.EASYAPPOINTMENTS_WACHTWOORD ?? ''

/** Testmodus zolang er geen sleutel of inloggegevens zijn. */
export const TESTMODUS = !BASIS || (!SLEUTEL && !(GEBRUIKER && WACHTWOORD))

/** De duur van een afspraak als de agenda er zelf geen noemt. */
const STANDAARD_DUUR = 30

function koppen(): HeadersInit {
  const basis: HeadersInit = { accept: 'application/json', 'content-type': 'application/json' }
  if (SLEUTEL) return { ...basis, authorization: `Bearer ${SLEUTEL}` }
  if (GEBRUIKER && WACHTWOORD) {
    const gecodeerd = Buffer.from(`${GEBRUIKER}:${WACHTWOORD}`).toString('base64')
    return { ...basis, authorization: `Basic ${gecodeerd}` }
  }
  return basis
}

class AgendaFout extends Error {
  constructor(public status: number, boodschap: string) {
    super(boodschap)
    this.name = 'AgendaFout'
  }
}

async function haal<T>(pad: string, opties: RequestInit = {}): Promise<T> {
  const antwoord = await fetch(`${BASIS}/index.php/api/v1${pad}`, {
    ...opties,
    headers: { ...koppen(), ...(opties.headers ?? {}) },
    // De agenda is een levend systeem; niets bewaren.
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  })

  if (!antwoord.ok) {
    const tekst = await antwoord.text().catch(() => '')
    throw new AgendaFout(antwoord.status, `agenda gaf ${antwoord.status}: ${tekst.slice(0, 200)}`)
  }
  return antwoord.json() as Promise<T>
}

/* ------------------------------------------------------------------ testmodus */

/** Verzonnen maar geloofwaardige diensten, op basis van onze eigen lijst. */
function testDiensten(): AgendaDienst[] {
  return DIENSTEN.map((d, i) => ({
    id: `test-${i + 1}`,
    naam: d.naam,
    uitleg: d.uitleg,
    duurMinuten: d.duurMinuten ?? STANDAARD_DUUR,
    groep: d.groep,
  }))
}

/**
 * Verzonnen vrije tijden voor de testmodus: de normale openingstijden, met
 * een paar gaten erin zodat de kalender er echt uitziet.
 */
function testBeschikbaarheid(vanafDatum: string, dagen: number, duur: number): VrijeDag[] {
  const uit: VrijeDag[] = []
  const [jaar, maand, dag] = vanafDatum.split('-').map(Number)

  for (let i = 0; i < dagen; i += 1) {
    const d = new Date(Date.UTC(jaar ?? 1970, (maand ?? 1) - 1, (dag ?? 1) + i))
    const datum = d.toISOString().slice(0, 10)
    const jsDag = d.getUTCDay()
    const weekdag = jsDag === 0 ? 7 : jsDag
    const schema = WEEK.find((w) => w.dag === weekdag)
    const deel = schema?.dagdelen[0]
    if (!deel) continue

    const tijden: string[] = []
    for (let m = deel.van; m + duur <= deel.tot; m += duur) {
      // Een vast patroon aan gaten: zo lijkt het op een echte agenda en blijft
      // de uitkomst voorspelbaar voor de tests.
      if ((m / 15 + i) % 5 === 0) continue
      tijden.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
    }
    if (tijden.length) uit.push({ datum, tijden })
  }
  return uit
}

/* --------------------------------------------------------------------- echt */

type EaDienst = { id: number | string; name: string; duration?: number }
type EaProvider = { id: number | string; services?: (number | string)[] }

/** De diensten uit de agenda, aangevuld met onze eigen uitleg. */
export async function haalDiensten(): Promise<AgendaDienst[]> {
  if (TESTMODUS) return testDiensten()

  const ruw = await haal<EaDienst[]>('/services')
  return ruw.map((d) => {
    const eigen = uitlegVoor(d.name)
    return {
      id: String(d.id),
      naam: eigen?.naam ?? d.name,
      uitleg: eigen?.uitleg ?? '',
      duurMinuten: d.duration ?? eigen?.duurMinuten ?? STANDAARD_DUUR,
      groep: eigen?.groep ?? 'ogen meten',
    }
  })
}

/** De medewerker die deze dienst uitvoert. De winkel heeft er in de praktijk een. */
async function vindProvider(dienstId: string): Promise<string | null> {
  const providers = await haal<EaProvider[]>('/providers')
  const passend = providers.find((p) => p.services?.map(String).includes(dienstId))
  return String((passend ?? providers[0])?.id ?? '') || null
}

/**
 * De vrije tijden voor de komende periode.
 *
 * Easy!Appointments geeft beschikbaarheid per dag terug, dus we vragen het
 * dag voor dag op. Dat zijn een stuk of veertien verzoeken; die doen we in
 * kleine groepjes tegelijk zodat het snel blijft zonder de agenda te overvragen.
 */
export async function haalBeschikbaarheid(
  dienstId: string,
  vanafDatum: string,
  dagen = 21,
): Promise<VrijeDag[]> {
  const diensten = await haalDiensten()
  const duur = diensten.find((d) => d.id === dienstId)?.duurMinuten ?? STANDAARD_DUUR

  if (TESTMODUS) return testBeschikbaarheid(vanafDatum, dagen, duur)

  const provider = await vindProvider(dienstId)
  if (!provider) return []

  const [jaar, maand, dag] = vanafDatum.split('-').map(Number)
  const datums = Array.from({ length: dagen }, (_, i) =>
    new Date(Date.UTC(jaar ?? 1970, (maand ?? 1) - 1, (dag ?? 1) + i)).toISOString().slice(0, 10),
  )

  const uit: VrijeDag[] = []
  const TEGELIJK = 5
  for (let i = 0; i < datums.length; i += TEGELIJK) {
    const groep = datums.slice(i, i + TEGELIJK)
    const antwoorden = await Promise.all(
      groep.map(async (datum) => {
        try {
          const tijden = await haal<string[]>(
            `/availabilities?serviceId=${encodeURIComponent(dienstId)}` +
              `&providerId=${encodeURIComponent(provider)}&date=${datum}`,
          )
          return { datum, tijden: Array.isArray(tijden) ? tijden : [] }
        } catch {
          // Een enkele dag die mislukt mag de hele kalender niet slopen.
          return { datum, tijden: [] }
        }
      }),
    )
    uit.push(...antwoorden.filter((a) => a.tijden.length > 0))
  }
  return uit
}

/**
 * Zet de afspraak in de agenda.
 *
 * Vlak voor het vastleggen controleren we nog eens of het tijdstip echt vrij
 * is. Twee mensen die tegelijk hetzelfde moment kiezen komen dan niet allebei
 * in de agenda te staan.
 */
export async function boekAfspraak(gegevens: BoekingGegevens): Promise<BoekingResultaat> {
  const diensten = await haalDiensten()
  const dienst = diensten.find((d) => d.id === gegevens.dienstId)
  if (!dienst) {
    return { gelukt: false, reden: 'ongeldig', melding: 'Deze afspraak kennen we niet.' }
  }

  if (TESTMODUS) {
    console.log('[agenda] TESTMODUS - er is niets echt geboekt:', {
      dienst: dienst.naam,
      wanneer: `${gegevens.datum} ${gegevens.tijd}`,
      wie: `${gegevens.voornaam} ${gegevens.achternaam}`,
      email: gegevens.email,
      telefoon: gegevens.telefoon,
      opmerking: gegevens.opmerking ?? '',
    })
    return { gelukt: true, referentie: `TEST-${gegevens.datum}-${gegevens.tijd.replace(':', '')}`, testmodus: true }
  }

  try {
    // Laatste controle: is het nog vrij?
    const nogVrij = await haalBeschikbaarheid(gegevens.dienstId, gegevens.datum, 1)
    const dag = nogVrij.find((d) => d.datum === gegevens.datum)
    if (!dag?.tijden.includes(gegevens.tijd)) {
      return {
        gelukt: false,
        reden: 'bezet',
        melding: 'Net voor je was iemand anders je voor. Kies je een ander moment?',
      }
    }

    const provider = await vindProvider(gegevens.dienstId)
    const [uur, minuut] = gegevens.tijd.split(':').map(Number)
    const eind = (uur ?? 0) * 60 + (minuut ?? 0) + dienst.duurMinuten

    const afspraak = await haal<{ id: number | string }>('/appointments', {
      method: 'POST',
      body: JSON.stringify({
        start: `${gegevens.datum} ${gegevens.tijd}:00`,
        end:
          `${gegevens.datum} ` +
          `${String(Math.floor(eind / 60)).padStart(2, '0')}:${String(eind % 60).padStart(2, '0')}:00`,
        serviceId: Number(gegevens.dienstId) || gegevens.dienstId,
        providerId: Number(provider) || provider,
        notes: gegevens.opmerking ?? '',
        customer: {
          firstName: gegevens.voornaam,
          lastName: gegevens.achternaam,
          email: gegevens.email,
          phone: gegevens.telefoon,
        },
      }),
    })

    return { gelukt: true, referentie: String(afspraak.id), testmodus: false }
  } catch (fout) {
    console.error('[agenda] boeken mislukt:', fout)
    return {
      gelukt: false,
      reden: 'onbereikbaar',
      melding:
        'De agenda is even niet bereikbaar. Bel ons gerust, of probeer het over een paar minuten opnieuw.',
    }
  }
}
