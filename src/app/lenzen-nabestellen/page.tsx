import type { Metadata } from 'next'

import { Kruimelpad } from '@/components/InhoudsPagina'
import { NabestelFormulier } from '@/components/NabestelFormulier'
import { Sectie, SectieKop } from '@/components/Sectie'
import { paginaMeta, JsonLd, kruimelsJsonLd } from '@/lib/seo'

export const metadata: Metadata = paginaMeta({
  titel: 'Contactlenzen nabestellen',
  omschrijving:
    'Draag je al contactlenzen van Oogcontact bij Gerard? Bestel ze hier na, zonder ' +
    'controleafspraak. Daglenzen of maandlenzen, met of zonder lenzenvloeistof.',
  pad: '/lenzen-nabestellen/',
})

const KRUIMELS = [
  { naam: 'Home', pad: '/' },
  { naam: 'Contactlenzen', pad: '/contactlenzen/' },
  { naam: 'Lenzen nabestellen', pad: '/lenzen-nabestellen/' },
]

/**
 * Nabestellen voor bestaande lensklanten, zonder controlebezoek.
 * Het formulier staat in src/components/NabestelFormulier.tsx.
 */
export default function LenzenNabestellen() {
  return (
    <>
      <JsonLd data={kruimelsJsonLd(KRUIMELS)} />

      <Sectie className="pt-36 md:pt-44">
        <Kruimelpad kruimels={KRUIMELS} />
        <SectieKop
          niveau={1}
          kop="Lenzen nabestellen"
          inleiding={
            'Draag je al contactlenzen van ons? Dan kun je ze hier nabestellen, zonder ' +
            'controleafspraak. Vul in wat je nodig hebt en stuur het ons via WhatsApp of per e-mail.'
          }
          className="mt-6"
        />
        <div className="mt-12 max-w-[44rem]">
          <NabestelFormulier />
        </div>
      </Sectie>
    </>
  )
}
