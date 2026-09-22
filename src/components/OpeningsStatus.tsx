'use client'

/**
 * De regel "Nu geopend" of "Gesloten - wij zijn weer open op ...".
 *
 * Dit wordt in de browser uitgerekend, niet op de server. De pagina's worden
 * namelijk van tevoren gemaakt; zou de server dit invullen, dan stond er een
 * uur later nog steeds hetzelfde. Zolang het nog niet berekend is, staat er
 * alleen de openingstijden van vandaag - nooit iets dat onwaar kan zijn.
 */

import { useEffect, useState } from 'react'

import { huidigeStatus } from '@/lib/openingstijden'
import type { Uitzondering } from '@/content/openingstijden'

type Props = {
  uitzonderingen?: Uitzondering[]
  /** Op een donkere of een lichte achtergrond. */
  opLicht?: boolean
  /**
   * Hoe nadrukkelijk de regel staat.
   *
   *   'klein'   het bijschrift-formaat: overal waar de regel meeloopt
   *   'nadruk'  groter en halfvet: onderaan de homepage bij de openingstijden
   *   'hero'    nog een maat groter: bovenaan de homepage, over de foto heen
   *
   * Op die twee plekken moet meteen opvallen dat de winkel vandaag dicht is.
   */
  maat?: 'klein' | 'nadruk' | 'hero'
  className?: string
}

/** Per maat: de tekst en de stip ernaast. */
const MATEN = {
  klein: { tekst: 'text-bijschrift', stip: 'size-2.5' },
  nadruk: { tekst: 'text-basis font-semibold', stip: 'size-3' },
  hero: { tekst: 'text-groot font-semibold', stip: 'size-3.5' },
} as const

export function OpeningsStatus({
  uitzonderingen = [],
  opLicht = false,
  maat = 'klein',
  className = '',
}: Props) {
  const stijl = MATEN[maat]

  const [status, setStatus] = useState<ReturnType<typeof huidigeStatus> | null>(null)

  useEffect(() => {
    const bijwerken = () => setStatus(huidigeStatus(new Date(), uitzonderingen))
    bijwerken()
    // Elke minuut opnieuw, zodat de winkel om 17.30 uur ook echt dichtgaat.
    const klok = setInterval(bijwerken, 60_000)
    return () => clearInterval(klok)
  }, [uitzonderingen])

  if (!status) {
    return (
      <p
        className={`${stijl.tekst} ${
          opLicht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht'
        } ${className}`}
      >
        <span className="alleen-voor-schermlezers">De openingsstatus wordt geladen.</span>
        <span aria-hidden="true">&nbsp;</span>
      </p>
    )
  }

  const stipKleur = status.open
    ? opLicht ? 'bg-open-diep' : 'bg-open'
    : opLicht ? 'bg-tekst-zacht' : 'bg-tekst-licht-zacht'

  const tekstKleur = status.open
    ? opLicht ? 'text-open-diep' : 'text-open'
    : opLicht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht'

  return (
    <p
      className={`flex items-center gap-2.5 ${stijl.tekst} ${tekstKleur} ${className}`}
      aria-live="polite"
    >
      <span className={`relative flex ${stijl.stip} shrink-0 rounded-full ${stipKleur}`}>
        {status.open && (
          <span className={`absolute inline-flex size-full rounded-full ${stipKleur} opacity-60 motion-safe:animate-ping`} />
        )}
      </span>
      <span>{status.tekst}</span>
    </p>
  )
}
