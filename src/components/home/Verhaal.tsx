/**
 * Het verhaal van Gerard en Gerda, met de foto ernaast en de getallen die
 * optellen zodra ze in beeld komen.
 */

import { Beeld } from '@/components/Beeld'
import { KnopLink } from '@/components/Knop'
import { Verschijnt } from '@/components/Beweging'
import { Sectie } from '@/components/Sectie'
import { Teller } from '@/components/home/Teller'
import type { TekstSectie } from '@/content/teksten'

/**
 * De drie getallen bij het verhaal. Ze staan hier en niet in de tekst, omdat
 * ze moeten kunnen tellen. De onderschriften komen wél uit de tekst mee.
 */
const GETALLEN = [
  { naar: 40, achtervoegsel: '+', label: 'jaar ervaring in de optiek' },
  { naar: 15, achtervoegsel: '', label: 'jaar in een medische setting' },
  { naar: 2021, achtervoegsel: '', vanaf: 2015, label: 'eigen winkel aan het Overwinningsplein' },
]

export function Verhaal({ sectie }: { sectie: TekstSectie }) {
  return (
    <Sectie licht>
      <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Verschijnt richting="links">
          <div className="grid gap-5 sm:grid-cols-2 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-groot border border-ivoor-rand sm:col-span-2">
              <Beeld slot="gerard-en-gerda" sizes="(min-width: 1024px) 45vw, 100vw" vullend />
            </div>
            <div className="zwartwit-bij-muis overflow-hidden rounded-kaart border border-ivoor-rand">
              <Beeld slot="gerard-portret" sizes="(min-width: 1024px) 22vw, 50vw" vullend />
            </div>
            <div className="zwartwit-bij-muis overflow-hidden rounded-kaart border border-ivoor-rand">
              <Beeld slot="gerda-portret" sizes="(min-width: 1024px) 22vw, 50vw" vullend />
            </div>
          </div>
        </Verschijnt>

        <div>
          <Verschijnt>
            <p className="text-bijschrift font-semibold uppercase tracking-[0.16em] text-messing-diep">
              Gerard en Gerda
            </p>
            <h2 className="mt-4 text-kop-2">{sectie.kop}</h2>
          </Verschijnt>

          {/* De alinea's komen regel voor regel binnen, elk iets later. */}
          <div className="mt-8 space-y-5">
            {sectie.alineas.map((alinea, i) => (
              <Verschijnt key={alinea.slice(0, 40)} vertraging={i * 0.08}>
                <p className="leesbreedte text-groot text-tekst-zacht">{alinea}</p>
              </Verschijnt>
            ))}
          </div>

          <Verschijnt vertraging={0.2}>
            <dl className="mt-14 grid gap-8 border-t border-ivoor-rand pt-10 sm:grid-cols-3">
              {GETALLEN.map((getal) => (
                <div key={getal.label}>
                  <dt className="font-kop text-kop-2 leading-none text-messing-diep">
                    <Teller naar={getal.naar} achtervoegsel={getal.achtervoegsel} vanaf={getal.vanaf} />
                  </dt>
                  <dd className="mt-3 text-basis text-tekst-zacht">{getal.label}</dd>
                </div>
              ))}
            </dl>
          </Verschijnt>

          <Verschijnt vertraging={0.28}>
            <div className="mt-12">
              <KnopLink href="/over-ons/" uiterlijk="omlijnd-donker">
                Lees ons verhaal
              </KnopLink>
            </div>
          </Verschijnt>
        </div>
      </div>
    </Sectie>
  )
}
