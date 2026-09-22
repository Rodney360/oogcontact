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

/**
 * De kop komt uit home.json en mag daar een deel tussen sterretjes hebben:
 * "Advies *op maat*". Dat deel krijgt het messing accent en staat cursief,
 * net als de slogan in de voettekst. Zo staat de nadruk bij de tekst zelf:
 * wordt de kop later anders, dan verhuist de nadruk gewoon mee en hoeft er
 * aan deze component niets te veranderen.
 *
 * Elk woord blijft een eigen woord, want ze schuiven één voor één in beeld.
 */
function leesKop(kop: string): { woord: string; accent: boolean }[] {
  return kop
    .split(/(\*[^*]+\*)/g)
    .flatMap((deel) => {
      const accent = deel.startsWith('*') && deel.endsWith('*')
      return (accent ? deel.slice(1, -1) : deel)
        .split(' ')
        .filter(Boolean)
        .map((woord) => ({ woord, accent }))
    })
}

export function Hero({ kop, inleiding, uitzonderingen }: Props) {
  const [scherp, setScherp] = useState(false)

  useEffect(() => {
    // Eén frame wachten, zodat de overgang van onscherp naar scherp ook echt
    // te zien is en niet al voorbij is voordat hij begint.
    const t = requestAnimationFrame(() => setScherp(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const woorden = leesKop(kop)

  return (
    <section className="hero relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/*
        De foto.

        Op een liggend scherm vult hij het hele vlak en staat de tekst eroverheen;
        daar zie je de foto vrijwel helemaal en blijft de tekst goed leesbaar.

        Op een staand scherm (een telefoon, of een tablet rechtop) is het beeld
        veel smaller dan hoog. Een vullende foto snijdt er dan zo veel vanaf dat
        er alleen nog een oog overblijft, en de tekst valt er half overheen.
        Daarom krijgt de foto daar precies de ruimte die boven de tekst
        overblijft: `flex-1`. Op een kleine telefoon is dat een strook, op een
        grote bijna het halve scherm - en in beide gevallen staat de tekst
        eronder op een egale achtergrond.

        Dat een lager vak ook nog eens meer foto laat zien, is meegenomen: hoe
        lager het vak, hoe minder ver de foto wordt opgeblazen om de breedte te
        vullen. Zie verder de CSS onderaan dit bestand.
      */}
      <div
        className="hero-fotovak relative -z-20 min-h-[20svh] w-full flex-1"
        data-scherp={scherp || undefined}
      >
        <div className="hero-beeld hero-foto absolute inset-0">
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

      <div className="hero-tekst relative mx-auto w-full max-w-[86rem] px-6 pb-32">
        <div className="max-w-[46rem]">
          {/*
            De bovenregel zegt wat we zijn en waar; de kop eronder zegt wat je
            krijgt. Bewust kort: er past op een telefoon maar ongeveer 24
            tekens op een regel, en zodra het er twee worden wordt het eerste
            scherm meteen onrustig. "Overwinningsplein 100, Groningen" paste
            daarom niet - het adres staat verderop bij "Bezoek de winkel" en in
            de voettekst.
          */}
          <p
            className="hero-in text-bijschrift font-semibold uppercase tracking-[0.2em] text-messing"
            style={{ animationDelay: '120ms' }}
          >
            Opticien in {BEDRIJF.adres.plaats}
          </p>

          {/*
            Elk woord zit in een vakje dat afsnijdt wat erbuiten valt; daardoor
            kan het woord van onderaf in beeld schuiven.

            Dat vakje was precies zo hoog als de regel, en daar past de staart
            van een letter niet in: de g van "Groningen" en de p van "opticien"
            werden onderaan recht afgesneden. Vandaar de ruimte onderaan het
            vakje, die er met een even grote negatieve marge weer af gehaald
            wordt - het vakje is dus ruimer, maar neemt geen extra plek in.
          */}
          <h1 className="mt-5 text-hero md:mt-6">
            {woorden.map(({ woord, accent }, i) => (
              <span
                key={`${woord}-${i}`}
                className="inline-block overflow-hidden align-bottom pb-[0.24em] -mb-[0.24em]"
              >
                <span
                  className={`hero-woord inline-block${accent ? ' italic text-messing' : ''}`}
                  style={{ animationDelay: `${260 + i * 85}ms` }}
                >
                  {woord}
                  {i < woorden.length - 1 ? ' ' : ''}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="hero-in mt-6 max-w-[38rem] text-hero-lead text-tekst-licht-zacht md:mt-8"
            style={{ animationDelay: `${300 + woorden.length * 85}ms` }}
          >
            {inleiding}
          </p>

          {/*
            Alleen vanaf tablet. Op een telefoon staan Bellen, WhatsApp en
            Afspraak al in de vaste balk onderin, die altijd in beeld blijft.
            Dezelfde twee knoppen hier maakten het eerste scherm dubbel en druk.
          */}
          <div
            className="hero-in mt-10 hidden flex-wrap gap-4 md:flex"
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
            className="hero-in mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 md:mt-10"
            style={{ animationDelay: `${480 + woorden.length * 85}ms` }}
          >
            <OpeningsStatus maat="hero" uitzonderingen={uitzonderingen} />
            <a
              href={`tel:${BEDRIJF.telefoon.link}`}
              className="inline-flex min-h-11 items-center text-bijschrift text-tekst-licht-zacht no-underline transition-colors hover:text-messing"
            >
              {BEDRIJF.telefoon.weergave}
            </a>
          </div>
        </div>
      </div>

      <style>{`
        /*
          Staand scherm: de foto pakt de ruimte boven de tekst en loopt
          onderaan zacht uit in het donker, zodat er geen rand te zien is.

          Er wordt op de verhouding van het scherm geschakeld en niet op de
          breedte: een tablet rechtop krijgt dan hetzelfde als een telefoon, en
          diezelfde tablet gedraaid gewoon de vullende foto.
        */
        .hero-foto {
          -webkit-mask-image: linear-gradient(to bottom, #000 68%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 68%, transparent 100%);
        }

        @media (min-aspect-ratio: 1 / 1) {
          /* Liggend scherm: foto over het hele vlak, tekst eroverheen. */
          .hero { justify-content: flex-end; }
          .hero-fotovak {
            position: absolute;
            inset: 0;
            flex: none;
          }
          .hero-tekst {
            padding-top: 10rem;
            padding-bottom: 7rem;
          }
          .hero-foto {
            -webkit-mask-image: none;
            mask-image: none;
          }
        }

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
          /* 135%: het vakje is onderaan ruimer geworden (zie de kop hierboven),
             dus het woord moet verder weg beginnen om echt uit beeld te zijn. */
          from { opacity: 0; transform: translate3d(0, 135%, 0); }
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
