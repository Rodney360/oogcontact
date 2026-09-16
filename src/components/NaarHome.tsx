'use client'

/**
 * De zwevende pijl terug naar de homepage.
 *
 * Staat linksonder, tegenover de WhatsApp-knop rechtsonder, en blijft tijdens
 * het scrollen op zijn plek. Op de homepage zelf is hij er niet: daar valt
 * niets terug te gaan.
 *
 * Op een telefoon staat hij boven de vaste balk met Bellen, WhatsApp en
 * Afspraak, zodat hij die nooit overlapt. Het logo linksboven doet hetzelfde:
 * ook dat brengt je naar de homepage.
 *
 * De naam voor schermlezers is bewust "Naar de homepage" en niet "Terug naar
 * de homepage": die laatste staat al op de 404-pagina, en daar zou je anders
 * twee knoppen met dezelfde naam naast elkaar krijgen.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NaarHome() {
  const pad = usePathname()
  if (pad === '/') return null

  return (
    <Link
      href="/"
      aria-label="Naar de homepage"
      className={[
        // Linksonder, en op een telefoon net boven de vaste balk onderin.
        'fixed left-3 z-40 md:bottom-7 md:left-7',
        'bottom-[calc(env(safe-area-inset-bottom)+6.5rem)]',
        // Op een telefoon een rond knopje, vanaf tablet met het woord erbij.
        'inline-flex min-h-12 items-center gap-2.5 rounded-full px-3.5 md:min-h-11 md:gap-3 md:py-3.5 md:pl-4 md:pr-5',
        'border border-inkt-rand-sterk bg-inkt-zacht/95 text-bijschrift',
        'text-tekst-licht no-underline shadow-2xl backdrop-blur-xl',
        // Alleen kleur en verplaatsing bewegen mee; er verspringt dus niets.
        'transition-[transform,border-color,color] duration-300',
        'hover:border-messing hover:text-messing motion-safe:hover:-translate-x-1',
      ].join(' ')}
    >
      <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
        <path
          d="M20 12H5M12 5l-7 7 7 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="hidden md:inline">Home</span>
    </Link>
  )
}
