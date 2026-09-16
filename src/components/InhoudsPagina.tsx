/**
 * De opbouw van een gewone inhoudspagina: de aanbodpagina's, Over ons,
 * Collectie en dergelijke.
 *
 * De tekst komt uit src/content/teksten/*.json. Zo staat op elke pagina
 * hetzelfde ritme en hoeft er voor een tekstwijziging niets aan code te
 * gebeuren.
 */

import type { ReactNode } from 'react'

import { Beeld } from '@/components/Beeld'
import { Sectie, SectieKop, Leeskolom, Oproep } from '@/components/Sectie'
import { Verschijnt } from '@/components/Beweging'
import { Vragen } from '@/components/Vragen'
import { JsonLd, kruimelsJsonLd, vragenJsonLd } from '@/lib/seo'
import type { BeeldSlot } from '@/content/beeld'
import type { PaginaTekst } from '@/content/teksten'

type Props = {
  tekst: PaginaTekst
  /** De grote foto boven aan de pagina. */
  beeldSlot?: BeeldSlot
  /** Het kleine woordje boven de titel. */
  bovenkop?: string
  /** Waar deze pagina in de site hangt, voor het kruimelpad. */
  kruimels: { naam: string; pad: string }[]
  /** Extra blokken, tussen de tekst en de veelgestelde vragen. */
  children?: ReactNode
}

export function InhoudsPagina({ tekst, beeldSlot, bovenkop, kruimels, children }: Props) {
  return (
    <>
      <JsonLd data={kruimelsJsonLd(kruimels)} />
      {tekst.vragen.length > 0 && <JsonLd data={vragenJsonLd(tekst.vragen)} />}

      {/* Kop van de pagina */}
      <Sectie className="pt-36 md:pt-44">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <Kruimelpad kruimels={kruimels} />
            <SectieKop
              niveau={1}
              bovenkop={bovenkop}
              kop={tekst.h1}
              inleiding={tekst.inleiding}
              className="mt-6"
            />
          </div>

          {beeldSlot && (
            <Verschijnt richting="rechts" vertraging={0.1}>
              <div className="overflow-hidden rounded-groot border border-inkt-rand">
                <Beeld
                  slot={beeldSlot}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  prioriteit
                  vullend
                />
              </div>
            </Verschijnt>
          )}
        </div>
      </Sectie>

      {/* De inhoud */}
      <Sectie licht compact>
        <div className="space-y-20">
          {tekst.secties.map((sectie) => (
            <Verschijnt key={sectie.kop} als="section">
              <Leeskolom>
                <h2 className="text-kop-3">{sectie.kop}</h2>
                {sectie.alineas.map((alinea) => (
                  <p key={alinea.slice(0, 40)} className="mt-5 text-basis text-tekst-zacht">
                    {alinea}
                  </p>
                ))}
              </Leeskolom>

              {sectie.opsomming.length > 0 && (
                <ul className="mt-10 grid gap-5 md:grid-cols-2">
                  {sectie.opsomming.map((regel) => (
                    <li
                      key={regel.titel}
                      className="rounded-kaart border border-ivoor-rand bg-ivoor-zacht p-6"
                    >
                      <h3 className="text-kop-4">{regel.titel}</h3>
                      <p className="mt-3 text-basis text-tekst-zacht">{regel.tekst}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Verschijnt>
          ))}
        </div>

        {children}

        {tekst.vragen.length > 0 && (
          <div className="mt-24">
            <Verschijnt>
              <h2 className="text-kop-2">Veelgestelde vragen</h2>
            </Verschijnt>
            <Vragen vragen={tekst.vragen} licht />
          </div>
        )}
      </Sectie>

      <Oproep kop={tekst.oproep.kop} tekst={tekst.oproep.tekst} knop={tekst.oproep.knop} />
    </>
  )
}

/** Het kruimelpad: waar je bent in de site. */
export function Kruimelpad({ kruimels }: { kruimels: { naam: string; pad: string }[] }) {
  if (kruimels.length <= 1) return null

  return (
    <nav aria-label="Kruimelpad">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-bijschrift text-tekst-licht-zacht">
        {kruimels.map((kruimel, i) => {
          const laatste = i === kruimels.length - 1
          return (
            <li key={kruimel.pad} className="flex items-center gap-2">
              {laatste ? (
                <span aria-current="page">{kruimel.naam}</span>
              ) : (
                <>
                  <a href={kruimel.pad} className="no-underline transition-colors hover:text-messing">
                    {kruimel.naam}
                  </a>
                  <span aria-hidden="true" className="text-inkt-rand-sterk">
                    /
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
