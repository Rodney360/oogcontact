/**
 * De vier pijlers: waarom je bij Oogcontact bij Gerard komt.
 *
 * De kaarten komen gestaffeld binnen en reageren met een subtiele beweging op
 * hover of aanraking.
 */

import { Beeld } from '@/components/Beeld'
import { Verschijnt } from '@/components/Beweging'
import { Sectie, SectieKop } from '@/components/Sectie'
import type { BeeldSlot } from '@/content/beeld'
import type { TekstSectie } from '@/content/teksten'

/** Bij elke pijler hoort een foto. De volgorde is die van de tekst. */
const BEELDEN: BeeldSlot[] = ['pijler-aandacht', 'pijler-apparatuur', 'pijler-ervaring', 'pijler-locatie']

export function Pijlers({ sectie }: { sectie: TekstSectie }) {
  return (
    <Sectie>
      <SectieKop bovenkop="Waarom Oogcontact" kop={sectie.kop} inleiding={sectie.alineas[0]} />

      <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sectie.opsomming.map((pijler, i) => (
          <Verschijnt key={pijler.titel} als="li" vertraging={i * 0.1}>
            <article
              className={[
                'group h-full overflow-hidden rounded-kaart border border-inkt-rand bg-inkt-zacht',
                'transition-[border-color,transform] duration-500 ease-[var(--ease-rustig)]',
                'hover:border-messing motion-safe:hover:-translate-y-1.5',
              ].join(' ')}
            >
              <div className="aspect-square overflow-hidden">
                <Beeld
                  slot={BEELDEN[i] ?? 'pijler-aandacht'}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                  vullend
                  className="transition-transform duration-700 ease-[var(--ease-rustig)] motion-safe:group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-kop-4">{pijler.titel}</h3>
                <p className="mt-3 text-basis text-tekst-licht-zacht">{pijler.tekst}</p>
              </div>
            </article>
          </Verschijnt>
        ))}
      </ul>
    </Sectie>
  )
}
