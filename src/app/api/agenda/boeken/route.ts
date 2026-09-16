/** Legt een afspraak vast in de online agenda. */

import { NextResponse } from 'next/server'

import { boekAfspraak, haalDiensten } from '@/lib/agenda/client'
import { afzender, begrens, controleerTurnstile } from '@/lib/beveiliging'
import { stuurAfspraakBevestiging } from '@/lib/mail'
import { boekingSchema } from '@/lib/validatie'

export const dynamic = 'force-dynamic'

export async function POST(verzoek: Request) {
  const ip = afzender(verzoek)

  const grens = begrens(`boeken:${ip}`, 5, 600)
  if (!grens.toegestaan) {
    return NextResponse.json(
      {
        melding:
          'Er zijn net meerdere afspraken vanaf deze plek gemaakt. Bel ons gerust, dan regelen we het samen.',
      },
      { status: 429, headers: { 'retry-after': String(grens.wachtSeconden) } },
    )
  }

  let ruw: unknown
  try {
    ruw = await verzoek.json()
  } catch {
    return NextResponse.json({ melding: 'We konden je gegevens niet lezen.' }, { status: 400 })
  }

  const uitslag = boekingSchema.safeParse(ruw)
  if (!uitslag.success) {
    return NextResponse.json(
      {
        melding: 'Er klopt nog iets niet. Kijk je de gemarkeerde velden even na?',
        velden: uitslag.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }
  const gegevens = uitslag.data

  // Het honeypot-veld hoort leeg te blijven; alleen een bot vult hem in.
  // We doen alsof het gelukt is, zodat de bot niets leert.
  if (gegevens.website) {
    console.warn('[api] honeypot ingevuld bij boeken, verzoek genegeerd')
    return NextResponse.json({ gelukt: true, referentie: 'ok' })
  }

  if (!(await controleerTurnstile(gegevens.turnstileToken, ip))) {
    return NextResponse.json(
      { melding: 'We konden niet vaststellen dat je geen robot bent. Herlaad de pagina en probeer het nog eens.' },
      { status: 400 },
    )
  }

  const resultaat = await boekAfspraak(gegevens)
  if (!resultaat.gelukt) {
    return NextResponse.json({ melding: resultaat.melding }, { status: resultaat.reden === 'bezet' ? 409 : 503 })
  }

  const diensten = await haalDiensten()
  const dienst = diensten.find((d) => d.id === gegevens.dienstId)

  await stuurAfspraakBevestiging({
    voornaam: gegevens.voornaam,
    achternaam: gegevens.achternaam,
    email: gegevens.email,
    telefoon: gegevens.telefoon,
    dienstNaam: dienst?.naam ?? 'Afspraak',
    datum: gegevens.datum,
    tijd: gegevens.tijd,
    opmerking: gegevens.opmerking,
    referentie: resultaat.referentie,
  })

  return NextResponse.json({
    gelukt: true,
    referentie: resultaat.referentie,
    testmodus: resultaat.testmodus,
    dienstNaam: dienst?.naam ?? 'Afspraak',
  })
}
