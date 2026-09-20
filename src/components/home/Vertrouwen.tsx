/**
 * Waar je op kunt rekenen: de keurmerken en de medische achtergrond.
 *
 * Bewust géén reviews of sterren: die tonen we pas als er echte zijn.
 */

import { Verschijnt } from '@/components/Beweging'
import { Sectie, SectieKop } from '@/components/Sectie'
import { BEDRIJF } from '@/content/bedrijf'
import type { TekstSectie } from '@/content/teksten'

export function Vertrouwen({ sectie }: { sectie: TekstSectie }) {
  return (
    <Sectie compact>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <SectieKop bovenkop="Waar je op kunt rekenen" kop={sectie.kop} />

        <div>
          {sectie.alineas.map((alinea) => (
            <p key={alinea.slice(0, 40)} className="leesbreedte text-lead text-tekst-licht-zacht [&+p]:mt-5">
              {alinea}
            </p>
          ))}

          <ul className="mt-12 grid gap-5 sm:grid-cols-2">
            {BEDRIJF.keurmerken.map((keurmerk, i) => (
              <Verschijnt key={keurmerk.naam} als="li" vertraging={i * 0.1}>
                <div className="h-full rounded-kaart border border-inkt-rand bg-inkt-zacht p-6">
                  <p className="font-kop text-kop-3 tracking-wide text-messing">
                    <a
                      href={keurmerk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-messing underline decoration-messing/40 underline-offset-8 hover:decoration-messing"
                    >
                      {keurmerk.naam}
                    </a>
                  </p>
                  <p className="mt-3 text-basis text-tekst-licht-zacht">{keurmerk.omschrijving}</p>
                </div>
              </Verschijnt>
            ))}
          </ul>
        </div>
      </div>
    </Sectie>
  )
}
