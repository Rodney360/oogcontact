import type { Metadata } from 'next'

import { InhoudsPagina } from '@/components/InhoudsPagina'
import { tekst } from '@/content/teksten/index'
import { paginaMeta } from '@/lib/seo'

const T = tekst('contactlenzen')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/contactlenzen/',
})

export default function Contactlenzen() {
  return (
    <InhoudsPagina
      tekst={T}
      beeldSlot="aanbod-contactlenzen"
      bovenkop="Contactlenzen"
      kruimels={[
        { naam: 'Home', pad: '/' },
        { naam: 'Aanbod', pad: '/aanbod/' },
        { naam: 'Contactlenzen', pad: '/contactlenzen/' },
      ]}
    />
  )
}
