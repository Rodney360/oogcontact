import type { Metadata } from 'next'

import { AanbodTegels } from '@/components/home/AanbodTegels'
import { Sectie, SectieKop, Oproep } from '@/components/Sectie'
import { Kruimelpad } from '@/components/InhoudsPagina'
import { tekst, sectieOpIndex } from '@/content/teksten/index'
import { paginaMeta, JsonLd, kruimelsJsonLd } from '@/lib/seo'

const T = tekst('aanbod')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/aanbod/',
})

const KRUIMELS = [
  { naam: 'Home', pad: '/' },
  { naam: 'Aanbod', pad: '/aanbod/' },
]

export default function Aanbod() {
  return (
    <>
      <JsonLd data={kruimelsJsonLd(KRUIMELS)} />

      <Sectie className="pt-36 md:pt-44">
        <Kruimelpad kruimels={KRUIMELS} />
        <SectieKop niveau={1} bovenkop="Aanbod" kop={T.h1} inleiding={T.inleiding} className="mt-6" />
      </Sectie>

      <AanbodTegels sectie={sectieOpIndex(T, 0)} />

      {T.secties.length > 1 && (
        <Sectie compact>
          <div className="space-y-16">
            {T.secties.slice(1).map((s) => (
              <section key={s.kop}>
                <h2 className="text-kop-3">{s.kop}</h2>
                {s.alineas.map((a) => (
                  <p key={a.slice(0, 40)} className="mt-5 leesbreedte text-basis text-tekst-licht-zacht">
                    {a}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </Sectie>
      )}

      <Oproep kop={T.oproep.kop} tekst={T.oproep.tekst} knop={T.oproep.knop} />
    </>
  )
}
