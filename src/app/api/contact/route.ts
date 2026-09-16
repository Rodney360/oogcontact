/** Neemt het aanvraagformulier aan en stuurt de e-mails. */

import { NextResponse } from 'next/server'

import { afzender, begrens, controleerTurnstile } from '@/lib/beveiliging'
import { stuurContactaanvraag, MAIL_TESTMODUS } from '@/lib/mail'
import { contactSchema } from '@/lib/validatie'

export const dynamic = 'force-dynamic'

export async function POST(verzoek: Request) {
  const ip = afzender(verzoek)

  const grens = begrens(`contact:${ip}`, 5, 600)
  if (!grens.toegestaan) {
    return NextResponse.json(
      {
        melding:
          'Er zijn net meerdere berichten vanaf deze plek verstuurd. Bel ons gerust, dan helpen we je meteen.',
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

  const uitslag = contactSchema.safeParse(ruw)
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

  if (gegevens.website) {
    console.warn('[api] honeypot ingevuld bij contact, verzoek genegeerd')
    return NextResponse.json({ gelukt: true })
  }

  if (!(await controleerTurnstile(gegevens.turnstileToken, ip))) {
    return NextResponse.json(
      { melding: 'We konden niet vaststellen dat je geen robot bent. Herlaad de pagina en probeer het nog eens.' },
      { status: 400 },
    )
  }

  const verstuurd = await stuurContactaanvraag(gegevens)
  if (!verstuurd) {
    return NextResponse.json(
      {
        melding:
          'Het versturen lukte niet. Bel ons gerust op 050 20 64 015, of stuur een e-mail naar info@oogcontactbijgerard.nl.',
      },
      { status: 502 },
    )
  }

  return NextResponse.json({ gelukt: true, testmodus: MAIL_TESTMODUS })
}
