import type { Metadata } from 'next'

import { InhoudsPagina } from '@/components/InhoudsPagina'
import { tekst } from '@/content/teksten/index'
import { paginaMeta } from '@/lib/seo'

const T = tekst('loepbrillen')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/loepbrillen/',
})

export default function Loepbrillen() {
  return (
    <InhoudsPagina
      tekst={T}
      beeldSlot="aanbod-loepbrillen"
      bovenkop="Loepbrillen"
      kruimels={[
        { naam: 'Home', pad: '/' },
        { naam: 'Aanbod', pad: '/aanbod/' },
        { naam: 'Loepbrillen', pad: '/loepbrillen/' },
      ]}
    />
  )
}
