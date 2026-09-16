'use client'

/**
 * De scène over de nauwkeurige oogmeting.
 *
 * Op een ruim scherm, en alleen als de bezoeker beweging wil, wordt deze scène
 * vastgezet: je scrolt al door de stappen van de meting heen, terwijl het beeld
 * meeverandert. Precies zoals een oogmeting stap voor stap scherper wordt.
 *
 * Op een telefoon en bij "minder beweging" is het gewoon een lijst onder
 * elkaar. Dezelfde inhoud, dezelfde volgorde, alleen zonder het vastzetten —
 * dat werkt op een klein scherm namelijk vervelend.
 *
 * GSAP wordt pas opgehaald als het echt gebruikt wordt, zodat de code niet
 * meegeladen wordt door bezoekers die er niets aan hebben.
 */

import { useEffect, useRef, useState } from 'react'

import { Beeld } from '@/components/Beeld'
import { KnopLink } from '@/components/Knop'
import { Verschijnt, useMinderBeweging } from '@/components/Beweging'
import { SectieKop } from '@/components/Sectie'
import type { TekstSectie } from '@/content/teksten'

export function Meting({ sectie }: { sectie: TekstSectie }) {
  const stappen = sectie.opsomming
  const minderBeweging = useMinderBeweging()
  const [magVastzetten, setMagVastzetten] = useState(false)
  const [actief, setActief] = useState(0)

  const buitenkant = useRef<HTMLDivElement>(null)
  const binnenkant = useRef<HTMLDivElement>(null)

  // Vastzetten alleen op een ruim scherm: op een telefoon is het onprettig.
  useEffect(() => {
    const vraag = window.matchMedia('(min-width: 1024px)')
    const bijwerken = () => setMagVastzetten(vraag.matches)
    bijwerken()
    vraag.addEventListener('change', bijwerken)
    return () => vraag.removeEventListener('change', bijwerken)
  }, [])

  const vastzetten = magVastzetten && !minderBeweging

  useEffect(() => {
    if (!vastzetten || !buitenkant.current || !binnenkant.current) return

    let opruimen: (() => void) | undefined
    let gestopt = false

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (gestopt) return
        gsap.registerPlugin(ScrollTrigger)

        const trigger = ScrollTrigger.create({
          trigger: buitenkant.current,
          start: 'top top',
          // Per stap ongeveer een schermhoogte scrollen.
          end: () => `+=${window.innerHeight * (stappen.length - 0.35)}`,
          pin: binnenkant.current,
          pinSpacing: true,
          scrub: 0.4,
          onUpdate: (self) => {
            const bij = Math.min(stappen.length - 1, Math.floor(self.progress * stappen.length))
            setActief(bij)
          },
        })

        opruimen = () => trigger.kill()
      },
    )

    return () => {
      gestopt = true
      opruimen?.()
    }
  }, [vastzetten, stappen.length])

  /* ------------------------------------------------- zonder vastzetten ---- */

  if (!vastzetten) {
    return (
      <section className="py-[var(--spacing-sectie)]">
        <div className="mx-auto max-w-[86rem] px-6">
          <SectieKop bovenkop="Ultiem nauwkeurig zicht" kop={sectie.kop} inleiding={sectie.alineas[0]} />

          <div className="mt-12 overflow-hidden rounded-groot border border-inkt-rand">
            <Beeld slot="oog-macro" sizes="100vw" vullend />
          </div>

          <ol className="mt-12 space-y-8">
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

          <div className="mt-12">
            <KnopLink href="/ultiem-nauwkeurig-zicht/" uiterlijk="omlijnd">
              Hoe dat precies werkt
            </KnopLink>
          </div>
        </div>
      </section>
    )
  }

  /* --------------------------------------------------- met vastzetten ---- */

  return (
    <section ref={buitenkant} aria-label={sectie.kop}>
      <div ref={binnenkant} className="flex min-h-screen items-center overflow-hidden py-24">
        <div className="mx-auto grid w-full max-w-[86rem] items-center gap-16 px-6 lg:grid-cols-2">
          {/* Links: de tekst die per stap verandert */}
          <div>
            <p className="text-bijschrift font-semibold uppercase tracking-[0.16em] text-messing">
              Ultiem nauwkeurig zicht
            </p>
            <h2 className="mt-4 text-kop-2">{sectie.kop}</h2>

            {/*
              Alle stappen staan in de HTML, maar alleen de actieve is zichtbaar.
              Ze liggen op elkaar in een raster, zodat de hoogte niet verspringt
              als de ene stap langer is dan de andere.
            */}
            <div className="mt-10 grid">
              {stappen.map((stap, i) => (
                <div
                  key={stap.titel}
                  aria-hidden={i !== actief}
                  className="col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-[var(--ease-rustig)]"
                  style={{
                    opacity: i === actief ? 1 : 0,
                    transform: i === actief ? 'none' : 'translate3d(0, 18px, 0)',
                    pointerEvents: i === actief ? 'auto' : 'none',
                  }}
                >
                  <p className="font-kop text-kop-3 text-messing">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 text-kop-3">{stap.titel}</h3>
                  <p className="mt-4 max-w-[34rem] text-lead text-tekst-licht-zacht">{stap.tekst}</p>
                </div>
              ))}
            </div>

            {/* De voortgang: welke stap van hoeveel */}
            <ol className="mt-12 flex gap-2" aria-label={`Stap ${actief + 1} van ${stappen.length}`}>
              {stappen.map((stap, i) => (
                <li
                  key={stap.titel}
                  className="h-0.5 flex-1 overflow-hidden rounded-full bg-inkt-rand"
                >
                  <span
                    className="block h-full bg-messing transition-transform duration-500 ease-[var(--ease-rustig)]"
                    style={{ transform: `scaleX(${i <= actief ? 1 : 0})`, transformOrigin: 'left' }}
                  />
                  <span className="alleen-voor-schermlezers">{stap.titel}</span>
                </li>
              ))}
            </ol>

            <div className="mt-12">
              <KnopLink href="/ultiem-nauwkeurig-zicht/" uiterlijk="omlijnd">
                Hoe dat precies werkt
              </KnopLink>
            </div>
          </div>

          {/* Rechts: het beeld, dat per stap iets verder inzoomt */}
          <div className="relative aspect-4/5 overflow-hidden rounded-groot border border-inkt-rand">
            <div
              className="size-full transition-transform duration-[1200ms] ease-[var(--ease-rustig)]"
              style={{ transform: `scale(${1 + actief * 0.045})` }}
            >
              <Beeld slot="oog-macro" sizes="(min-width: 1024px) 45vw, 100vw" vullend />
            </div>

            {/* De iris die zich sluit naarmate je verder komt: scherper wordt */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 size-full"
            >
              <circle
                cx="50" cy="50"
                r={40 - actief * 7}
                fill="none"
                stroke="var(--color-messing)"
                strokeWidth="0.35"
                opacity="0.75"
                style={{ transition: 'r 1200ms var(--ease-rustig)' }}
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
