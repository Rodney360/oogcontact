'use client'

/**
 * Een getal dat optelt zodra het in beeld komt.
 *
 * De ruimte die het getal inneemt staat vanaf het begin vast (het breedste
 * getal bepaalt de breedte), zodat de tekst ernaast niet heen en weer springt
 * tijdens het tellen. Wie minder beweging wil, ziet meteen het eindgetal.
 */

import { useEffect, useRef, useState } from 'react'

import { useMinderBeweging } from '@/components/Beweging'

type Props = {
  /** Het getal waar naartoe geteld wordt. */
  naar: number
  /** Wat erachter komt, bijvoorbeeld "+" of " jaar". */
  achtervoegsel?: string
  /** Waar het tellen begint. Standaard 0, maar bij een jaartal is dat raar. */
  vanaf?: number
  duurMs?: number
}

export function Teller({ naar, achtervoegsel = '', vanaf = 0, duurMs = 1400 }: Props) {
  const minderBeweging = useMinderBeweging()
  const [geteld, setGeteld] = useState(vanaf)
  const ref = useRef<HTMLSpanElement>(null)

  // Wie minder beweging wil, ziet meteen het eindgetal. Dat wordt afgeleid,
  // niet apart bijgehouden, zodat er niets te synchroniseren valt.
  const waarde = minderBeweging ? naar : geteld

  useEffect(() => {
    const element = ref.current
    if (!element || minderBeweging) return

    let frame = 0
    const kijker = new IntersectionObserver(
      ([regel]) => {
        if (!regel?.isIntersecting) return
        kijker.disconnect()

        const begin = performance.now()
        const stap = (nu: number) => {
          const deel = Math.min(1, (nu - begin) / duurMs)
          // Snel beginnen, rustig uitlopen. Voelt als een teller die tot stilstand komt.
          const soepel = 1 - (1 - deel) ** 3
          setGeteld(Math.round(vanaf + (naar - vanaf) * soepel))
          if (deel < 1) frame = requestAnimationFrame(stap)
        }
        frame = requestAnimationFrame(stap)
      },
      { threshold: 0.4 },
    )

    kijker.observe(element)
    return () => {
      kijker.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [naar, vanaf, duurMs, minderBeweging])

  return (
    <span ref={ref} className="tabular-nums">
      {/* De schermlezer leest meteen het eindgetal, niet elk tussenstapje. */}
      <span aria-hidden="true">
        {waarde}
        {achtervoegsel}
      </span>
      <span className="alleen-voor-schermlezers">
        {naar}
        {achtervoegsel}
      </span>
    </span>
  )
}
