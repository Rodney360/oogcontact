/**
 * Het aanbod: de vijf categorieën als grote beeldtegels.
 */

import Link from 'next/link'

import { Beeld } from '@/components/Beeld'
import { Verschijnt } from '@/components/Beweging'
import { Sectie, SectieKop } from '@/components/Sectie'
import { AANBOD } from '@/content/navigatie'
import type { BeeldSlot } from '@/content/beeld'
import type { TekstSectie } from '@/content/teksten'

const BEELDEN: Record<string, BeeldSlot> = {
  '/brillen/': 'aanbod-brillen',
  '/contactlenzen/': 'aanbod-contactlenzen',
  '/zonnebrillen/': 'aanbod-zonnebrillen',
  '/kinderbrillen/': 'aanbod-kinderbrillen',
  '/loepbrillen/': 'aanbod-loepbrillen',
}

export function AanbodTegels({ sectie }: { sectie: TekstSectie }) {
  return (
    <Sectie licht>
      <SectieKop licht bovenkop="Aanbod" kop={sectie.kop} inleiding={sectie.alineas[0]} />

      <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AANBOD.map((categorie, i) => (
          <Verschijnt
            key={categorie.pad}
            als="li"
            vertraging={i * 0.08}
            // De eerste tegel is breder op een groot scherm: dat geeft ritme.
            className={i === 0 ? 'lg:col-span-2' : ''}
          >
            <Link
              href={categorie.pad}
              className="group relative block h-full overflow-hidden rounded-groot border border-ivoor-rand no-underline"
            >
              <div className={i === 0 ? 'aspect-16/10' : 'aspect-4/5'}>
                <Beeld
                  slot={BEELDEN[categorie.pad] ?? 'aanbod-brillen'}
                  sizes={i === 0 ? '(min-width: 1024px) 58vw, 100vw' : '(min-width: 1024px) 29vw, 50vw'}
                  vullend
                  className="transition-transform duration-[900ms] ease-[var(--ease-rustig)] motion-safe:group-hover:scale-[1.06]"
                />
              </div>

              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-inkt/90 via-inkt/25 to-transparent"
              />

              <span className="absolute inset-x-0 bottom-0 p-6">
                <span className="block font-kop text-kop-3 text-ivoor">{categorie.naam}</span>
                {categorie.uitleg && (
                  <span className="mt-2 block max-w-[26rem] text-basis text-ivoor/75">
                    {categorie.uitleg}
                  </span>
                )}
                <span className="mt-4 inline-flex items-center gap-2 text-bijschrift text-messing">
                  Bekijk
                  <svg viewBox="0 0 20 20" className="w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1" aria-hidden="true">
                    <path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </Link>
          </Verschijnt>
        ))}
      </ul>
    </Sectie>
  )
}
