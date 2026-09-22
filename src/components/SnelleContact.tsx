'use client'

/**
 * De snelle manieren om contact te leggen.
 *
 * Op mobiel: een zwevend blok onderin met Bellen, WhatsApp en Afspraak. Het
 * ligt bewust los van de onderrand, met een ronding en een schaduw eronder:
 * zo is het een eigen ding dat boven de pagina zweeft, en niet een streep die
 * tegen de rand van het scherm aan plakt.
 *
 * Op desktop: een zwevende WhatsApp-knop rechtsonder.
 *
 * Op de pagina "Afspraak maken" blijven ze weg: daar staat alles al.
 */

import { usePathname } from 'next/navigation'

import { IcoonWhatsApp } from '@/components/IcoonWhatsApp'
import { BEDRIJF, whatsappLink } from '@/content/bedrijf'

function IcoonTelefoon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d="M6.6 3h3l1.5 4-2 1.4a12 12 0 006.5 6.5l1.4-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 014.6 5.2 2 2 0 016.6 3z"
        fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
      />
    </svg>
  )
}

function IcoonAgenda() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
      </g>
    </svg>
  )
}

export function SnelleContact() {
  const pad = usePathname()
  if (pad.startsWith('/afspraak-maken')) return null

  return (
    <>
      {/*
        Zorgt dat de laatste regels van de voettekst niet achter het blok
        verdwijnen. Staat hier omdat dit onderdeel als laatste op de pagina
        komt, dus onder de voettekst.
      */}
      <div aria-hidden="true" className="h-28 md:hidden" />

      {/* Mobiel: een zwevend blok onderin */}
      <nav
        aria-label="Snel contact"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-3 md:hidden"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
      >
        <ul
          className={[
            'pointer-events-auto grid grid-cols-3 overflow-hidden rounded-kaart',
            'border border-inkt-rand-sterk bg-inkt/95 shadow-2xl backdrop-blur-xl',
          ].join(' ')}
        >
          <li>
            <a
              href={`tel:${BEDRIJF.telefoon.link}`}
              className="flex min-h-16 flex-col items-center justify-center gap-1.5 py-3 text-bijschrift text-tekst-licht no-underline"
            >
              <IcoonTelefoon />
              Bellen
            </a>
          </li>
          <li className="border-x border-inkt-rand">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-16 flex-col items-center justify-center gap-1.5 py-3 text-bijschrift text-tekst-licht no-underline"
            >
              <IcoonWhatsApp />
              WhatsApp
            </a>
          </li>
          <li>
            <a
              href="/afspraak-maken/"
              className="flex min-h-16 flex-col items-center justify-center gap-1.5 bg-messing py-3 text-bijschrift font-semibold text-inkt no-underline"
            >
              <IcoonAgenda />
              Afspraak
            </a>
          </li>
        </ul>
      </nav>

      {/* Desktop: zwevende WhatsApp-knop */}
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          'fixed bottom-7 right-7 z-40 hidden items-center gap-3 rounded-full md:inline-flex',
          'border border-inkt-rand-sterk bg-inkt-zacht/95 py-3.5 pl-4 pr-5 text-bijschrift',
          'text-tekst-licht no-underline shadow-2xl backdrop-blur-xl',
          'transition-[transform,border-color,color] duration-300',
          'hover:border-messing hover:text-messing motion-safe:hover:-translate-y-1',
        ].join(' ')}
      >
        <IcoonWhatsApp />
        <span>
          App ons
          <span className="alleen-voor-schermlezers"> via WhatsApp, opent in een nieuw tabblad</span>
        </span>
      </a>
    </>
  )
}
