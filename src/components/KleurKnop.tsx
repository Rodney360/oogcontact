'use client'

/**
 * Een foto die standaard in zwart-wit staat en in kleur springt zodra je hem
 * aanwijst, aanklikt of aantikt.
 *
 * Waarom een knop en niet gewoon een div met een klik erop: zo werkt het ook
 * met het toetsenbord, krijgt hij vanzelf een focusring, en weet een
 * schermlezer dat er iets te doen valt. Het aanwijzen zelf zit in de CSS
 * (.kleurknop in globals.css); hier staat alleen of er geklikt is.
 *
 * Het is een grapje, geen bediening: de foto blijft gewoon de foto, en wie
 * niets doet mist geen informatie. Daarom staat de uitleg alleen in het label
 * en niet als tekst op de pagina.
 */

import { useState } from 'react'
import type { ReactNode } from 'react'

export function KleurKnop({
  children,
  wie,
  className = '',
}: {
  children: ReactNode
  /** Over wie de foto gaat, voor het label: "Gerard" of "Gerda". */
  wie: string
  className?: string
}) {
  const [inKleur, setInKleur] = useState(false)

  return (
    <button
      type="button"
      aria-pressed={inKleur}
      aria-label={
        inKleur
          ? `Zet de foto van ${wie} terug in zwart-wit`
          : `Laat de foto van ${wie} in kleur zien`
      }
      onClick={() => setInKleur((aan) => !aan)}
      className={`kleurknop block w-full cursor-pointer overflow-hidden border-0 p-0 ${className}`}
    >
      {children}
    </button>
  )
}
