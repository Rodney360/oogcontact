'use client'

/**
 * De hero: "Scherp zicht, warm welkom."
 *
 * De foto begint onscherp en iets vergroot, en wordt scherp zodra de pagina
 * geladen is — zoals het beeld scherp wordt tijdens een oogmeting. De kop
 * verschijnt woord voor woord.
 *
 * Er wordt alleen met `filter`, `transform` en `opacity` gewerkt, dus er
 * verspringt nooit iets. Wie minder beweging wil, ziet de foto meteen scherp en
 * de kop meteen compleet: dat regelt de CSS onderaan dit bestand.
 */

import { useEffect, useState } from 'react'

import { Beeld } from '@/components/Beeld'
import { KnopLink } from '@/components/Knop'
import { OpeningsStatus } from '@/components/OpeningsStatus'
import { BEDRIJF, whatsappLink } from '@/content/bedrijf'
import type { Uitzondering } from '@/content/openingstijden'

type Props = {
  kop: string
  inleiding: string
  uitzonderingen: Uitzondering[]
}

export function Hero({ kop, inleiding, uitzonderingen }: Props) {
  const [scherp, setScherp] = useState(false)

  useEffect(() => {
    // Eén frame wachten, zodat de overgang van onscherp naar scherp ook echt
    // te zien is en niet al voorbij is voordat hij begint.
    const t = requestAnimationFrame(() => setScherp(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const woorden = kop.split(' ')

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-20 pt-40 md:pb-28">
      {/* De foto */}
      <div className="absolute inset-0 -z-20" data-scherp={scherp || undefined}>
        <div className="hero-beeld size-full">
          <Beeld slot="hero-portret" sizes="100vw" prioriteit vullend />
        </div>
      </div>

      {/* Een donker verloop eroverheen, zodat de tekst altijd leesbaar is */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-inkt via-inkt/80 to-inkt/35"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-inkt/85 via-inkt/20 to-transparent"
      />

      {/* De lensvorm als subtiel accent */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 400"
        className="pointer-events-none absolute -right-20 top-1/4 -z-10 w-[min(46vw,30rem)] opacity-[0.13] md:opacity-20"
      >
        <circle cx="200" cy="200" r="190" fill="none" stroke="var(--color-messing)" strokeWidth="1" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="var(--color-messing)" strokeWidth="1" />
        <circle cx="200" cy="200" r="104" fill="none" stroke="var(--color-messing)" strokeWidth="1.5" />
        {/* De iris: lijntjes vanuit het midden */}
        <g stroke="var(--color-messing)" strokeWidth="0.75">
          {Array.from({ length: 48 }, (_, i) => {
            const hoek = (i / 48) * Math.PI * 2
            return (
              <line
                key={i}
                x1={200 + Math.cos(hoek) * 46}
                y1={200 + Math.sin(hoek) * 46}
                x2={200 + Math.cos(hoek) * 102}
                y2={200 + Math.sin(hoek) * 102}
              />
            )
          })}
        </g>
        <circle cx="200" cy="200" r="44" fill="var(--color-inkt)" opacity="0.5" />
      </svg>

      <div className="mx-auto w-full max-w-[86rem] px-6">
        <div className="max-w-[46rem]">
          <p
            className="hero-in text-bijschrift font-semibold uppercase tracking-[0.2em] text-messing"
            style={{ animationDelay: '120ms' }}
          >
            Opticien in Groningen
          </p>

          <h1 className="mt-6 text-kop-1">
            {woorden.map((woord, i) => (
              <span key={`${woord}-${i}`} className="inline-block overflow-hidden align-bottom">
                <span
                  className="hero-woord inline-block"
                  style={{ animationDelay: `${260 + i * 85}ms` }}
                >
                  {woord}
                  {i < woorden.length - 1 ? ' ' : ''}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="hero-in mt-8 max-w-[38rem] text-lead text-tekst-licht-zacht"
            style={{ animationDelay: `${300 + woorden.length * 85}ms` }}
          >
            {inleiding}
          </p>

          <div
            className="hero-in mt-10 flex flex-wrap gap-4"
            style={{ animationDelay: `${400 + woorden.length * 85}ms` }}
          >
            <KnopLink href="/afspraak-maken/" uiterlijk="messing" formaat="groot">
              Afspraak maken
            </KnopLink>
            <KnopLink href={whatsappLink()} uiterlijk="omlijnd" formaat="groot">
              Bel of app ons
            </KnopLink>
          </div>

          <div
            className="hero-in mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
            style={{ animationDelay: `${480 + woorden.length * 85}ms` }}
          >
            <OpeningsStatus uitzonderingen={uitzonderingen} />
            <a
              href={`tel:${BEDRIJF.telefoon.link}`}
              className="text-bijschrift text-tekst-licht-zacht no-underline transition-colors hover:text-messing"
            >
              {BEDRIJF.telefoon.weergave}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        /* De foto: van onscherp en iets vergroot naar scherp en op maat. */
        .hero-beeld {
          filter: blur(18px);
          transform: scale(1.08);
          transition: filter 1400ms var(--ease-rustig), transform 1600ms var(--ease-rustig);
          will-change: filter, transform;
        }
        [data-scherp] .hero-beeld {
          filter: blur(0);
          transform: scale(1);
        }

        /* De kop, woord voor woord. */
        .hero-woord {
          animation: hero-woord-op 800ms var(--ease-rustig) both;
        }
        @keyframes hero-woord-op {
          from { opacity: 0; transform: translate3d(0, 105%, 0); }
          to   { opacity: 1; transform: none; }
        }

        .hero-in { animation: hero-op 900ms var(--ease-rustig) both; }
        @keyframes hero-op {
          from { opacity: 0; transform: translate3d(0, 20px, 0); }
          to   { opacity: 1; transform: none; }
        }

        /* Wie minder beweging wil: alles staat er meteen, scherp en compleet. */
        @media (prefers-reduced-motion: reduce) {
          .hero-beeld,
          [data-scherp] .hero-beeld {
            filter: none;
            transform: none;
            transition: none;
          }
          .hero-woord, .hero-in { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  )
}
