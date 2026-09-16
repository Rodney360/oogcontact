'use client'

/**
 * De snelle manieren om contact te leggen.
 *
 * Op mobiel: een vaste balk onderin met Bellen, WhatsApp en Afspraak.
 * Op desktop: een zwevende WhatsApp-knop rechtsonder.
 *
 * Op de pagina "Afspraak maken" blijven ze weg: daar staat alles al.
 */

import { usePathname } from 'next/navigation'

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

function IcoonWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6 0a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.6-1.2l.1-.4v-.3l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3A2.9 2.9 0 006 9.6a5 5 0 001.1 2.7 11.5 11.5 0 004.4 3.9c1.6.7 2.3.7 3.1.6a2.6 2.6 0 001.7-1.2 2.1 2.1 0 00.2-1.2c-.1-.2-.3-.2-.5-.3z" />
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
      {/* Mobiel: vaste balk onderin */}
      <nav
        aria-label="Snel contact"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-inkt-rand bg-inkt/95 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <ul className="grid grid-cols-3">
          <li>
            <a
              href={`tel:${BEDRIJF.telefoon.link}`}
              className="flex min-h-16 flex-col items-center justify-center gap-1 text-bijschrift text-tekst-licht no-underline"
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
              className="flex min-h-16 flex-col items-center justify-center gap-1 text-bijschrift text-tekst-licht no-underline"
            >
              <IcoonWhatsApp />
              WhatsApp
            </a>
          </li>
          <li>
            <a
              href="/afspraak-maken/"
              className="flex min-h-16 flex-col items-center justify-center gap-1 bg-messing text-bijschrift font-medium text-inkt no-underline"
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
