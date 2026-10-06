import type { Metadata } from 'next'

import { InhoudsPagina } from '@/components/InhoudsPagina'
import { KnopLink } from '@/components/Knop'
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
      // De knop onderaan toont in stap 1 alleen de afspraken die hierbij horen.
      oproepPad="/afspraak-maken/?voor=contactlenzen"
      kruimels={[
        { naam: 'Home', pad: '/' },
        { naam: 'Aanbod', pad: '/aanbod/' },
        { naam: 'Contactlenzen', pad: '/contactlenzen/' },
      ]}
    >
      <div className="mt-20 flex flex-col gap-5 rounded-groot border border-ivoor-rand-sterk p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div>
          <h2 className="text-kop-3">Al lensklant?</h2>
          <p className="mt-2 text-basis text-tekst-zacht">
            Bestel je contactlenzen na, zonder controleafspraak.
          </p>
        </div>
        <KnopLink href="/lenzen-nabestellen/" uiterlijk="omlijnd-donker" formaat="groot" className="shrink-0">
          Lenzen nabestellen
        </KnopLink>
      </div>
    </InhoudsPagina>
  )
}
