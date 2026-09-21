/**
 * Bezoek de winkel: waar we zitten, wanneer we open zijn, hoe je er komt.
 */

import { Beeld } from '@/components/Beeld'
import { KnopLink } from '@/components/Knop'
import { Verschijnt } from '@/components/Beweging'
import { Sectie, SectieKop } from '@/components/Sectie'
import { OpeningsStatus } from '@/components/OpeningsStatus'
import { Kaart } from '@/components/Kaart'
import { BEDRIJF, routeLink, whatsappLink } from '@/content/bedrijf'
import { WEEK, naarTijd } from '@/content/openingstijden'
import type { Uitzondering } from '@/content/openingstijden'
import type { TekstSectie } from '@/content/teksten'

export function BezoekDeWinkel({
  sectie,
  uitzonderingen,
}: {
  sectie: TekstSectie
  uitzonderingen: Uitzondering[]
}) {
  return (
    <Sectie licht id="bezoek">
      <SectieKop licht bovenkop="Bezoek de winkel" kop={sectie.kop} inleiding={sectie.alineas[0]} />

      <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <Verschijnt>
            <div className="overflow-hidden rounded-groot border border-ivoor-rand">
              <Beeld slot="winkel-gevel" sizes="(min-width: 1024px) 52vw, 100vw" vullend />
            </div>
          </Verschijnt>

          <Verschijnt vertraging={0.1}>
            <div className="mt-10">
              <Kaart licht />
            </div>
          </Verschijnt>
        </div>

        <div className="space-y-10">
          {/* Openingstijden met de live status */}
          <Verschijnt vertraging={0.05}>
            <div className="rounded-groot border border-ivoor-rand bg-ivoor-zacht p-7">
              <h3 className="text-kop-4">Openingstijden</h3>
              <OpeningsStatus opLicht nadruk uitzonderingen={uitzonderingen} className="mt-4" />

              <table className="mt-6 w-full text-basis">
                <caption className="alleen-voor-schermlezers">Onze openingstijden per dag</caption>
                <tbody>
                  {WEEK.map((dag) => {
                    const deel = dag.dagdelen[0]
                    return (
                      <tr key={dag.dag} className="border-t border-ivoor-rand">
                        <th scope="row" className="py-2.5 pr-4 text-left font-normal text-tekst-zacht">
                          {dag.naam}
                        </th>
                        <td className="py-2.5 text-right tabular-nums text-tekst">
                          {deel ? `${naarTijd(deel.van)} - ${naarTijd(deel.tot)}` : 'gesloten'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Verschijnt>

          {/* Hoe je er komt */}
          {sectie.opsomming.length > 0 && (
            <Verschijnt vertraging={0.12}>
              <dl className="space-y-6">
                {sectie.opsomming.map((regel) => (
                  <div key={regel.titel} className="border-t border-ivoor-rand pt-6">
                    <dt className="text-kop-4">{regel.titel}</dt>
                    <dd className="mt-2 leesbreedte text-basis text-tekst-zacht">{regel.tekst}</dd>
                  </div>
                ))}
              </dl>
            </Verschijnt>
          )}

          <Verschijnt vertraging={0.18}>
            <div className="flex flex-wrap gap-4">
              <KnopLink href={routeLink()} uiterlijk="messing">
                Route plannen
              </KnopLink>
              <KnopLink href={`tel:${BEDRIJF.telefoon.link}`} uiterlijk="omlijnd-donker">
                Bel {BEDRIJF.telefoon.weergave}
              </KnopLink>
              <KnopLink href={whatsappLink()} uiterlijk="omlijnd-donker">
                Stuur een appje
              </KnopLink>
            </div>
          </Verschijnt>
        </div>
      </div>
    </Sectie>
  )
}
