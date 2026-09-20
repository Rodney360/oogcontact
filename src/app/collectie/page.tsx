import type { Metadata } from 'next'

import { InhoudsPagina } from '@/components/InhoudsPagina'
import { Verschijnt } from '@/components/Beweging'
import { tekst } from '@/content/teksten/index'
import { merken } from '@/lib/beheer'
import { LEVERANCIERS } from '@/content/merken'
import { paginaMeta } from '@/lib/seo'

const T = tekst('collectie')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/collectie/',
})

const SOORT_LABEL: Record<string, string> = {
  monturen: 'Monturen',
  zonnebrillen: 'Zonnebrillen',
  sport: 'Sportbrillen',
  glazen: 'Glazen',
  loepbrillen: 'Loepbrillen',
}

export default async function Collectie() {
  const lijst = await merken()

  return (
    <InhoudsPagina
      tekst={T}
      beeldSlot="collectie-1"
      bovenkop="Collectie en merken"
      kruimels={[
        { naam: 'Home', pad: '/' },
        { naam: 'Collectie & merken', pad: '/collectie/' },
      ]}
    >
      <div className="mt-20">
        <Verschijnt>
          <h2 className="text-kop-3">De merken die we voeren</h2>
          <p className="mt-5 leesbreedte text-basis text-tekst-zacht">
            Welke modellen er precies hangen, wisselt met de collectie. Kom gerust langs om te
            zien wat er nu aan de wand hangt.
          </p>
        </Verschijnt>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lijst.map((merk, i) => (
            <Verschijnt key={merk.naam} als="li" vertraging={Math.min(i, 8) * 0.04}>
              <div className="flex h-full flex-col rounded-kaart border border-ivoor-rand bg-ivoor-zacht p-6">
                <h3 className="text-kop-4">{merk.naam}</h3>

                {/* De herkomst staat er alleen als we hem zeker weten. */}
                {merk.herkomst && (
                  <p className="mt-2 text-bijschrift uppercase tracking-[0.12em] text-messing-diep">
                    {merk.herkomst}
                  </p>
                )}

                {merk.toelichting && (
                  <p className="mt-3 text-basis text-tekst-zacht">{merk.toelichting}</p>
                )}

                <ul className="mt-auto flex flex-wrap gap-2 pt-5">
                  {merk.soorten.map((soort) => (
                    <li
                      key={soort}
                      className="rounded-full border border-ivoor-rand-sterk px-3 py-1 text-bijschrift text-tekst-zacht"
                    >
                      {SOORT_LABEL[soort] ?? soort}
                    </li>
                  ))}
                </ul>
              </div>
            </Verschijnt>
          ))}
        </ul>

        <Verschijnt vertraging={0.1}>
          <h2 className="mt-20 text-kop-3">Glazen en loepbrillen</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2">
            {LEVERANCIERS.map((leverancier) => (
              <li
                key={leverancier.naam}
                className="rounded-kaart border border-ivoor-rand bg-ivoor-zacht p-6"
              >
                <p className="text-bijschrift uppercase tracking-[0.12em] text-messing-diep">
                  {leverancier.waarvoor}
                </p>
                <h3 className="mt-2 text-kop-4">{leverancier.naam}</h3>
                <p className="mt-3 text-basis text-tekst-zacht">{leverancier.toelichting}</p>
              </li>
            ))}
          </ul>
        </Verschijnt>
      </div>
    </InhoudsPagina>
  )
}
