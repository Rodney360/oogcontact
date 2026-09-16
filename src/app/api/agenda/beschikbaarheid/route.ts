/** Levert de vrije dagen en tijden voor een dienst. */

import { NextResponse } from 'next/server'

import { haalBeschikbaarheid, TESTMODUS } from '@/lib/agenda/client'
import { afzender, begrens } from '@/lib/beveiliging'

export const dynamic = 'force-dynamic'

export async function GET(verzoek: Request) {
  // Ruim genoeg om door de kalender te bladeren, krap genoeg om niet te
  // laten misbruiken om de hele agenda leeg te trekken.
  const grens = begrens(`beschikbaarheid:${afzender(verzoek)}`, 60, 60)
  if (!grens.toegestaan) {
    return NextResponse.json(
      { melding: 'Even rustig aan. Probeer het over een halve minuut opnieuw.' },
      { status: 429, headers: { 'retry-after': String(grens.wachtSeconden) } },
    )
  }

  const url = new URL(verzoek.url)
  const dienstId = url.searchParams.get('dienst')
  const vanaf = url.searchParams.get('vanaf')

  if (!dienstId) {
    return NextResponse.json({ melding: 'Kies eerst waarvoor je komt.' }, { status: 400 })
  }
  if (!vanaf || !/^\d{4}-\d{2}-\d{2}$/.test(vanaf)) {
    return NextResponse.json({ melding: 'De gevraagde datum klopt niet.' }, { status: 400 })
  }

  try {
    const dagen = await haalBeschikbaarheid(dienstId, vanaf, 28)
    return NextResponse.json({ dagen, testmodus: TESTMODUS })
  } catch (fout) {
    console.error('[api] beschikbaarheid ophalen mislukt:', fout)
    return NextResponse.json(
      { melding: 'De agenda is even niet bereikbaar. Bel ons gerust.' },
      { status: 503 },
    )
  }
}
