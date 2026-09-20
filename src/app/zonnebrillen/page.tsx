import type { Metadata } from 'next'

import { InhoudsPagina } from '@/components/InhoudsPagina'
import { tekst } from '@/content/teksten/index'
import { paginaMeta } from '@/lib/seo'

const T = tekst('zonnebrillen')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/zonnebrillen/',
})

export default function Zonnebrillen() {
  return (
    <InhoudsPagina
      tekst={T}
      beeldSlot="aanbod-zonnebrillen"
      bovenkop="Zonnebrillen"
      // De knop onderaan toont in stap 1 alleen de afspraken die hierbij horen.
      oproepPad="/afspraak-maken/?voor=zonnebrillen"
      kruimels={[
        { naam: 'Home', pad: '/' },
        { naam: 'Aanbod', pad: '/aanbod/' },
        { naam: 'Zonnebrillen', pad: '/zonnebrillen/' },
      ]}
    />
  )
}
