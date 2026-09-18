'use client'

/**
 * Het zwevende knopje linksonder, tegenover de WhatsApp-knop rechtsonder.
 *
 * Het doet twee dingen, afhankelijk van waar je bent:
 *
 *   - ergens anders op de site: een pijl naar links, terug naar de homepage;
 *   - op de homepage zelf: een pijl omhoog, terug naar de bovenkant. Die
 *     verschijnt pas als je een scherm ver bent - daarvoor heeft hij geen nut.
 *
 * Alleen vanaf tablet. Op een telefoon staat er onderin al een vaste balk met
 * Bellen, WhatsApp en Afspraak, en dan is dit knopje er een zwevend ding te
 * veel: het kwam over een knop of over een regel tekst te liggen, op bijna elk
 * scherm dat je tegenkomt. Het logo linksboven doet precies hetzelfde en staat
 * altijd in beeld: naar de homepage, of naar boven als je daar al bent.
 *
 * De naam voor schermlezers is bewust "Naar de homepage" en niet "Terug naar
 * de homepage": die laatste staat al op de 404-pagina, en daar zou je anders
 * twee knoppen met dezelfde naam naast elkaar krijgen.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useSyncExternalStore } from 'react'

import { scrollNaarBoven } from '@/components/Beweging'

/**
 * Of je meer dan een schermhoogte naar beneden bent.
 *
 * De scrollpositie komt van buiten React, dus useSyncExternalStore. Op de
 * server bestaat `window` niet; daar is het antwoord "nee", zodat het knopje
 * niet even meeflitst bij het laden.
 */
function useVerGescrold(): boolean {
  const abonneer = useCallback((opWijziging: () => void) => {
    window.addEventListener('scroll', opWijziging, { passive: true })
    window.addEventListener('resize', opWijziging)
    return () => {
      window.removeEventListener('scroll', opWijziging)
      window.removeEventListener('resize', opWijziging)
    }
  }, [])

  return useSyncExternalStore(
    abonneer,
    () => window.scrollY > window.innerHeight * 0.8,
    () => false,
  )
}

export function NaarHome() {
  const pad = usePathname()
  const verGescrold = useVerGescrold()
  const opHome = pad === '/'

  if (opHome && !verGescrold) return null

  return (
    <Link
      href="/"
      onClick={(e) => {
        if (!opHome) return
        e.preventDefault()
        scrollNaarBoven()
      }}
      aria-label={opHome ? 'Naar boven' : 'Naar de homepage'}
      className={[
        // Linksonder, en alleen vanaf tablet (zie de uitleg bovenaan).
        'fixed bottom-7 left-7 z-40 hidden md:inline-flex',
        'min-h-11 items-center gap-3 rounded-full py-3.5 pl-4 pr-5',
        'border border-inkt-rand-sterk bg-inkt-zacht/95 text-bijschrift',
        'text-tekst-licht no-underline shadow-2xl backdrop-blur-xl',
        // Alleen kleur en verplaatsing bewegen mee; er verspringt dus niets.
        // De knop wipt de kant op waar hij je heen brengt.
        'transition-[transform,border-color,color] duration-300',
        'hover:border-messing hover:text-messing',
        opHome ? 'motion-safe:hover:-translate-y-1' : 'motion-safe:hover:-translate-x-1',
      ].join(' ')}
    >
      <svg viewBox="0 0 24 24" className="size-5 shrink-0" aria-hidden="true">
        <path
          d={opHome ? 'M12 20V5M5 12l7-7 7 7' : 'M20 12H5M12 5l-7 7 7 7'}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{opHome ? 'Naar boven' : 'Home'}</span>
    </Link>
  )
}
