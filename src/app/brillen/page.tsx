import type { Metadata } from 'next'

import { InhoudsPagina } from '@/components/InhoudsPagina'
import { tekst } from '@/content/teksten/index'
import { paginaMeta } from '@/lib/seo'

const T = tekst('brillen')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/brillen/',
})

export default function Brillen() {
  return (
    <InhoudsPagina
      tekst={T}
      beeldSlot="aanbod-brillen"
      bovenkop="Brillen en glazen"
      // De knop onderaan toont in stap 1 alleen de afspraken die hierbij horen.
      oproepPad="/afspraak-maken/?voor=brillen"
      kruimels={[
        { naam: 'Home', pad: '/' },
        { naam: 'Aanbod', pad: '/aanbod/' },
        { naam: 'Brillen en glazen', pad: '/brillen/' },
      ]}
    />
  )
}
