import type { Metadata } from 'next'

import { InhoudsPagina } from '@/components/InhoudsPagina'
import { tekst } from '@/content/teksten/index'
import { paginaMeta } from '@/lib/seo'

const T = tekst('kinderbrillen')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/kinderbrillen/',
})

export default function Kinderbrillen() {
  return (
    <InhoudsPagina
      tekst={T}
      beeldSlot="aanbod-kinderbrillen"
      bovenkop="Kinderbrillen"
      // De knop onderaan toont in stap 1 alleen de afspraken die hierbij horen.
      oproepPad="/afspraak-maken/?voor=kinderbrillen"
      kruimels={[
        { naam: 'Home', pad: '/' },
        { naam: 'Aanbod', pad: '/aanbod/' },
        { naam: 'Kinderbrillen', pad: '/kinderbrillen/' },
      ]}
    />
  )
}
