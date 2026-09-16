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
  className?: string
}

export function OpeningsStatus({ uitzonderingen = [], opLicht = false, className = '' }: Props) {
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
      <p className={`text-bijschrift ${opLicht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht'} ${className}`}>
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
    <p className={`flex items-center gap-2.5 text-bijschrift ${tekstKleur} ${className}`} aria-live="polite">
      <span className={`relative flex size-2.5 shrink-0 rounded-full ${stipKleur}`}>
        {status.open && (
          <span className={`absolute inline-flex size-full rounded-full ${stipKleur} opacity-60 motion-safe:animate-ping`} />
        )}
      </span>
      <span>{status.tekst}</span>
    </p>
  )
}
