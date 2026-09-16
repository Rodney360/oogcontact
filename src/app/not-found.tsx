import type { Metadata } from 'next'

import { KnopLink } from '@/components/Knop'
import { Sectie } from '@/components/Sectie'
import { AANBOD } from '@/content/navigatie'
import { BEDRIJF, whatsappLink } from '@/content/bedrijf'

export const metadata: Metadata = {
  title: 'Deze pagina is even uit beeld',
  robots: { index: false, follow: true },
}

/** De pagina die verschijnt als een adres niet bestaat. */
export default function NietGevonden() {
  return (
    <Sectie className="min-h-[70svh] pt-40">
      <div className="mx-auto max-w-[46rem] text-center">
        {/* Een bril met onscherpe glazen: knipoog naar waar de pagina heen is. */}
        <svg
          viewBox="0 0 200 80"
          className="mx-auto w-48 text-messing"
          role="img"
          aria-label="Een bril waarvan de glazen onscherp zijn"
        >
          <defs>
            <filter id="wazig">
              <feGaussianBlur stdDeviation="2.4" />
            </filter>
          </defs>
          <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" filter="url(#wazig)">
            <circle cx="58" cy="42" r="30" />
            <circle cx="142" cy="42" r="30" />
            <path d="M88 38c7-5 17-5 24 0" />
            <path d="M28 38c-7-5-15-5-22 0" />
            <path d="M172 38c7-5 15-5 22 0" />
          </g>
        </svg>

        <h1 className="mt-10 text-kop-1">Deze pagina is even uit beeld</h1>

        <p className="mt-8 text-lead text-tekst-licht-zacht">
          We kunnen hem niet scherp krijgen. Waarschijnlijk is hij verhuisd of bestaat hij niet
          meer. Hieronder staat waar je wél terechtkunt.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <KnopLink href="/" uiterlijk="messing" formaat="groot">
            Terug naar de homepage
          </KnopLink>
          <KnopLink href="/afspraak-maken/" uiterlijk="omlijnd" formaat="groot">
            Afspraak maken
          </KnopLink>
        </div>

        <div className="mt-16 border-t border-inkt-rand pt-10 text-left">
          <h2 className="text-center text-kop-4">Misschien zoek je dit</h2>
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {[...AANBOD, { naam: 'Over ons', pad: '/over-ons/' }, { naam: 'Contact', pad: '/contact/' }].map(
              (item) => (
                <li key={item.pad}>
                  <a
                    href={item.pad}
                    className="flex min-h-12 items-center rounded-zacht border border-inkt-rand px-5 text-basis text-tekst-licht no-underline transition-colors hover:border-messing hover:text-messing"
                  >
                    {item.naam}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>

        <p className="mt-12 text-basis text-tekst-licht-zacht">
          Kom je er niet uit? Bel ons gerust op{' '}
          <a href={`tel:${BEDRIJF.telefoon.link}`} className="text-messing underline underline-offset-4">
            {BEDRIJF.telefoon.weergave}
          </a>{' '}
          of stuur een{' '}
          <a
            href={whatsappLink('Hallo Gerard en Gerda, ik kan iets niet vinden op de website.')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-messing underline underline-offset-4"
          >
            appje
          </a>
          .
        </p>
      </div>
    </Sectie>
  )
}
