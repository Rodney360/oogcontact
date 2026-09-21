/**
 * De scène over de nauwkeurige oogmeting.
 *
 * Dit blok was eerst een "vastgezette" scène: op een breed scherm bleef de
 * pagina staan terwijl je door de drie stappen heen scrolde. Dat voelde alsof
 * de pagina vastliep, dus dat is eruit. Nu is het gewoon een stuk pagina dat
 * meescrolt, op elk scherm hetzelfde: de drie stappen onder elkaar en de foto
 * ernaast. De foto is ook kleiner geworden; hij stond eerst op bijna de halve
 * schermbreedte.
 */

import { Beeld } from '@/components/Beeld'
import { KnopLink } from '@/components/Knop'
import { Verschijnt } from '@/components/Beweging'
import { SectieKop } from '@/components/Sectie'
import type { TekstSectie } from '@/content/teksten'

export function Meting({ sectie }: { sectie: TekstSectie }) {
  const stappen = sectie.opsomming

  return (
    <section className="py-[var(--spacing-sectie)]">
      <div className="mx-auto max-w-[86rem] px-6">
        <SectieKop bovenkop="Ultiem nauwkeurig zicht" kop={sectie.kop} inleiding={sectie.alineas[0]} />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_18rem] lg:items-start lg:gap-16">
          {/*
            De foto staat in de HTML vóór de stappen, zodat hij op een telefoon
            bovenaan blijft staan zoals je gewend bent. Op een breed scherm
            schuift hij naar de rechterkolom.
          */}
          <Verschijnt className="lg:col-start-2 lg:row-start-1">
            <div className="aspect-4/5 w-full max-w-[22rem] overflow-hidden rounded-groot border border-inkt-rand lg:max-w-none">
              <Beeld slot="meting-scene" sizes="(min-width: 64rem) 288px, (min-width: 26rem) 352px, 100vw" vullend />
            </div>
          </Verschijnt>

          <ol className="space-y-8 lg:col-start-1 lg:row-start-1">
            {stappen.map((stap, i) => (
              <Verschijnt key={stap.titel} als="li" vertraging={i * 0.08}>
                <div className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-messing font-kop text-basis text-messing"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-kop-4">{stap.titel}</h3>
                    <p className="mt-2 leesbreedte text-basis text-tekst-licht-zacht">{stap.tekst}</p>
                  </div>
                </div>
              </Verschijnt>
            ))}
          </ol>
        </div>

        <div className="mt-12">
          <KnopLink href="/ultiem-nauwkeurig-zicht/" uiterlijk="omlijnd">
            Hoe dat precies werkt
          </KnopLink>
        </div>
      </div>
    </section>
  )
}
