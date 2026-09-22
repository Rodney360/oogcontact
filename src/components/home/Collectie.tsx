'use client'

/**
 * De collectie: de monturen als een galerij.
 *
 * Op een ruim scherm scroll je er horizontaal doorheen, op een telefoon veeg je
 * ze langs met een vaste stop per foto. In beide gevallen is het gewoon een
 * scrollbaar vak: dat werkt met een muis, met een trackpad, met een vinger én
 * met het toetsenbord, en het werkt ook als JavaScript hapert.
 */

import { useRef } from 'react'

import { Beeld } from '@/components/Beeld'
import { KnopLink } from '@/components/Knop'
import { Verschijnt } from '@/components/Beweging'
import { SectieKop } from '@/components/Sectie'
import type { BeeldSlot } from '@/content/beeld'
import type { TekstSectie } from '@/content/teksten'

const FOTOS: BeeldSlot[] = ['collectie-1', 'collectie-2']

export function Collectie({ sectie, herkomsten }: { sectie: TekstSectie; herkomsten: string[] }) {
  const spoor = useRef<HTMLUListElement>(null)

  const schuif = (richting: -1 | 1) => {
    const element = spoor.current
    if (!element) return
    const stap = element.clientWidth * 0.8
    element.scrollBy({ left: stap * richting, behavior: 'smooth' })
  }

  return (
    <section className="overflow-hidden py-[var(--spacing-sectie)]">
      <div className="mx-auto max-w-[86rem] px-6">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectieKop bovenkop="De collectie" kop={sectie.kop} inleiding={sectie.alineas[0]} />

          {/* De knoppen om te schuiven: alleen nuttig met een muis. */}
          <div className="hidden gap-3 lg:flex">
            {([-1, 1] as const).map((richting) => (
              <button
                key={richting}
                type="button"
                onClick={() => schuif(richting)}
                className="grid size-12 place-items-center rounded-full border border-inkt-rand-sterk text-tekst-licht transition-colors hover:border-messing hover:text-messing"
              >
                <span className="alleen-voor-schermlezers">
                  {richting === -1 ? 'Eerdere foto’s' : 'Volgende foto’s'}
                </span>
                <svg viewBox="0 0 24 24" className="w-5" aria-hidden="true">
                  <path
                    d={richting === -1 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
                    fill="none" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {herkomsten.length > 0 && (
          <Verschijnt vertraging={0.1}>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {herkomsten.map((land) => (
                <li
                  key={land}
                  className="rounded-full border border-inkt-rand-sterk px-4 py-1.5 text-bijschrift text-tekst-licht-zacht"
                >
                  {land}
                </li>
              ))}
            </ul>
          </Verschijnt>
        )}
      </div>

      <Verschijnt vertraging={0.15}>
        <ul
          ref={spoor}
          // Een gewoon scrollbaar vak. tabIndex zodat je er ook met de
          // pijltjestoetsen doorheen kunt.
          tabIndex={0}
          className={[
            'mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6',
            '[scrollbar-width:thin]',
            'lg:px-[max(1.5rem,calc((100vw-86rem)/2))]',
          ].join(' ')}
        >
          {FOTOS.map((slot) => (
            <li
              key={slot}
              className="w-[72vw] shrink-0 snap-start sm:w-[42vw] lg:w-[24rem]"
            >
              <div className="group overflow-hidden rounded-groot border border-inkt-rand">
                <div className="aspect-3/4 overflow-hidden">
                  <Beeld
                    slot={slot}
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 42vw, 72vw"
                    vullend
                    className="transition-transform duration-700 ease-[var(--ease-rustig)] motion-safe:group-hover:scale-105"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Verschijnt>

      <div className="mx-auto mt-10 max-w-[86rem] px-6">
        <KnopLink href="/collectie/" uiterlijk="omlijnd">
          Bekijk de merken
        </KnopLink>
      </div>
    </section>
  )
}
