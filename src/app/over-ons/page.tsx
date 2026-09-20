import type { Metadata } from 'next'

import { Beeld } from '@/components/Beeld'
import { Sectie, SectieKop, Leeskolom, Oproep } from '@/components/Sectie'
import { Kruimelpad } from '@/components/InhoudsPagina'
import { Verschijnt } from '@/components/Beweging'
import { Vragen } from '@/components/Vragen'
import { tekst } from '@/content/teksten/index'
import { BEDRIJF } from '@/content/bedrijf'
import { paginaMeta, JsonLd, kruimelsJsonLd, vragenJsonLd } from '@/lib/seo'

const T = tekst('over-ons')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/over-ons/',
})

const KRUIMELS = [
  { naam: 'Home', pad: '/' },
  { naam: 'Over ons', pad: '/over-ons/' },
]

/** Bij de secties over Gerard en Gerda hoort hun eigen portret. */
const PORTRET: Record<string, 'gerard-portret' | 'gerda-portret'> = {
  Gerard: 'gerard-portret',
  Gerda: 'gerda-portret',
}

function portretVoor(kop: string) {
  for (const [naam, slot] of Object.entries(PORTRET)) {
    if (kop.includes(naam)) return slot
  }
  return null
}

export default function OverOns() {
  return (
    <>
      <JsonLd data={kruimelsJsonLd(KRUIMELS)} />
      {T.vragen.length > 0 && <JsonLd data={vragenJsonLd(T.vragen)} />}

      <Sectie className="pt-36 md:pt-44">
        <Kruimelpad kruimels={KRUIMELS} />
        <div className="mt-6 grid items-end gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <SectieKop niveau={1} bovenkop="Over ons" kop={T.h1} inleiding={T.inleiding} />
          <Verschijnt richting="rechts" vertraging={0.1}>
            <div className="overflow-hidden rounded-groot border border-inkt-rand">
              <Beeld slot="gerard-en-gerda" sizes="(min-width: 1024px) 45vw, 100vw" prioriteit vullend />
            </div>
          </Verschijnt>
        </div>
      </Sectie>

      <Sectie licht compact>
        <div className="space-y-24">
          {T.secties.map((sectie, i) => {
            const portret = portretVoor(sectie.kop)

            return (
              <Verschijnt key={sectie.kop} als="section">
                {portret ? (
                  <div
                    className={`grid items-start gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16 ${
                      i % 2 === 1 ? 'lg:[direction:rtl] lg:[&>*]:[direction:ltr]' : ''
                    }`}
                  >
                    <div className="overflow-hidden rounded-groot border border-ivoor-rand">
                      <Beeld slot={portret} sizes="(min-width: 1024px) 30vw, 100vw" vullend />
                    </div>
                    <div>
                      <h2 className="text-kop-3">{sectie.kop}</h2>
                      {sectie.alineas.map((a) => (
                        <p key={a.slice(0, 40)} className="mt-5 leesbreedte text-basis text-tekst-zacht">
                          {a}
                        </p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Leeskolom>
                    <h2 className="text-kop-3">{sectie.kop}</h2>
                    {sectie.alineas.map((a) => (
                      <p key={a.slice(0, 40)} className="mt-5 text-basis text-tekst-zacht">
                        {a}
                      </p>
                    ))}
                  </Leeskolom>
                )}

                {sectie.opsomming.length > 0 && (
                  <ul className="mt-10 grid gap-5 md:grid-cols-2">
                    {sectie.opsomming.map((regel) => (
                      <li key={regel.titel} className="rounded-kaart border border-ivoor-rand bg-ivoor-zacht p-6">
                        <h3 className="text-kop-4">{regel.titel}</h3>
                        <p className="mt-3 text-basis text-tekst-zacht">{regel.tekst}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </Verschijnt>
            )
          })}
        </div>

        {/* De winkel zelf */}
        <Verschijnt vertraging={0.1}>
          {/*
            Twee foto's, allebei over de volle breedte: de winkel van binnen en
            Gerard en Gerda in de deuropening. Er stond hier eerder een derde -
            nog een overzichtsfoto van dezelfde ruimte - maar twee keer
            hetzelfde vlak onder elkaar voegde niets toe.
          */}
          <div className="mt-24 grid gap-5">
            <div className="overflow-hidden rounded-groot border border-ivoor-rand">
              <Beeld slot="winkel-tafel" sizes="100vw" vullend />
            </div>
            <div className="overflow-hidden rounded-groot border border-ivoor-rand">
              <Beeld slot="winkel-deur" sizes="100vw" vullend />
            </div>
          </div>
        </Verschijnt>

        {/* De keurmerken */}
        <Verschijnt vertraging={0.15}>
          <div className="mt-20 border-t border-ivoor-rand pt-12">
            <h2 className="text-kop-3">Aangesloten bij</h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-2">
              {BEDRIJF.keurmerken.map((keurmerk) => (
                <li key={keurmerk.naam} className="rounded-kaart border border-ivoor-rand bg-ivoor-zacht p-6">
                  <p className="font-kop text-kop-3 tracking-wide text-messing-diep">{keurmerk.naam}</p>
                  <p className="mt-3 text-basis text-tekst-zacht">{keurmerk.omschrijving}</p>
                </li>
              ))}
            </ul>
          </div>
        </Verschijnt>

        {T.vragen.length > 0 && (
          <div className="mt-24">
            <Verschijnt>
              <h2 className="text-kop-2">Veelgestelde vragen</h2>
            </Verschijnt>
            <Vragen vragen={T.vragen} licht />
          </div>
        )}
      </Sectie>

      <Oproep kop={T.oproep.kop} tekst={T.oproep.tekst} knop={T.oproep.knop} />
    </>
  )
}
