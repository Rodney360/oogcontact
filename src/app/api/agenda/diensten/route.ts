/** Levert de diensten waarvoor je een afspraak kunt maken. */

import { NextResponse } from 'next/server'

import { haalDiensten, TESTMODUS } from '@/lib/agenda/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const diensten = await haalDiensten()
    return NextResponse.json({ diensten, testmodus: TESTMODUS })
  } catch (fout) {
    console.error('[api] diensten ophalen mislukt:', fout)
    return NextResponse.json(
      { melding: 'De agenda is even niet bereikbaar. Bel ons gerust.' },
      { status: 503 },
    )
  }
}
