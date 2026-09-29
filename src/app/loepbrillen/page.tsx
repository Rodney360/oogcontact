import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { InhoudsPagina } from '@/components/InhoudsPagina'
import { tekst } from '@/content/teksten/index'
import { paginaMeta } from '@/lib/seo'
import { LOEPBRILLEN_AAN } from '../../../config/schakelaars.mjs'

const T = tekst('loepbrillen')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/loepbrillen/',
})

export default function Loepbrillen() {
  // De loepbrillen staan tijdelijk uit. next.config stuurt /loepbrillen/ dan al
  // door naar /aanbod/, dus hier komt niemand; dit is het tweede slot, voor het
  // geval die doorverwijzing ooit sneuvelt. Zie config/schakelaars.mjs.
  if (!LOEPBRILLEN_AAN) notFound()

  return (
    <InhoudsPagina
      tekst={T}
      beeldSlot="aanbod-loepbrillen"
      bovenkop="Loepbrillen"
      // De knop onderaan gaat naar de boekingsmodule met alleen de twee
      // loepbrilafspraken erin.
      oproepPad="/afspraak-maken/?voor=loepbrillen"
      kruimels={[
        { naam: 'Home', pad: '/' },
        { naam: 'Aanbod', pad: '/aanbod/' },
        { naam: 'Loepbrillen', pad: '/loepbrillen/' },
      ]}
    />
  )
}
