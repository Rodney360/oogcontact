'use client'

/**
 * De beweging op de site: soepel scrollen en dingen die verschijnen als je
 * er langs scrolt.
 *
 * Twee regels die overal gelden:
 *   1. Wie in zijn systeem "minder beweging" heeft aangezet, krijgt niets van
 *      dit alles. Geen soepel scrollen, geen verschijnen - alles staat er
 *      gewoon. Dat wordt hier gecontroleerd en ook in globals.css.
 *   2. Er wordt alleen met `transform` en `opacity` bewogen, nooit met maten
 *      of posities. Zo verspringt de pagina nooit tijdens het laden.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Leest of de bezoeker minder beweging wil, en blijft dat volgen. */
export function useMinderBeweging(): boolean {
  const [minder, setMinder] = useState(true) // veilige startwaarde: geen beweging

  useEffect(() => {
    const vraag = window.matchMedia('(prefers-reduced-motion: reduce)')
    const bijwerken = () => setMinder(vraag.matches)
    bijwerken()
    vraag.addEventListener('change', bijwerken)
    return () => vraag.removeEventListener('change', bijwerken)
  }, [])

  return minder
}

/** Of dit een apparaat met een muis is. Alleen daar doen we hover-effecten. */
export function useHeeftMuis(): boolean {
  const [muis, setMuis] = useState(false)

  useEffect(() => {
    const vraag = window.matchMedia('(hover: hover) and (pointer: fine)')
    const bijwerken = () => setMuis(vraag.matches)
    bijwerken()
    vraag.addEventListener('change', bijwerken)
    return () => vraag.removeEventListener('change', bijwerken)
  }, [])

  return muis
}

/**
 * Zet het soepele scrollen aan (Lenis). Wordt pas geladen als het nodig is,
 * dus niet bij "minder beweging" en niet op een aanraakscherm, waar het
 * eigen scrollgedrag van de telefoon prettiger is.
 */
export function SoepelScrollen() {
  const minder = useMinderBeweging()
  const muis = useHeeftMuis()

  useEffect(() => {
    if (minder || !muis) return

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null
    let frame = 0
    let gestopt = false

    import('lenis').then(({ default: Lenis }) => {
      if (gestopt) return
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
      })
      const stap = (tijd: number) => {
        lenis?.raf(tijd)
        frame = requestAnimationFrame(stap)
      }
      frame = requestAnimationFrame(stap)
    })

    return () => {
      gestopt = true
      cancelAnimationFrame(frame)
      lenis?.destroy()
    }
  }, [minder, muis])

  return null
}

type VerschijntProps = {
  children: ReactNode
  /** Wachttijd in seconden, om dingen na elkaar te laten komen. */
  vertraging?: number
  /** Vanuit welke kant het binnenkomt. */
  richting?: 'onder' | 'links' | 'rechts' | 'geen'
  className?: string
  /** Het HTML-element dat eromheen komt. */
  als?: 'div' | 'li' | 'section' | 'article'
}

/**
 * Laat zijn inhoud zachtjes verschijnen zodra je eraan toe scrolt.
 *
 * Werkt met een IntersectionObserver, dus zonder mee te rekenen tijdens het
 * scrollen. Staat "minder beweging" aan, dan is de inhoud er gewoon meteen.
 */
export function Verschijnt({
  children,
  vertraging = 0,
  richting = 'onder',
  className = '',
  als: Element = 'div',
}: VerschijntProps) {
  const ref = useRef<HTMLElement>(null)
  const [zichtbaar, setZichtbaar] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setZichtbaar(true)
      return
    }

    const kijker = new IntersectionObserver(
      ([regel]) => {
        if (regel?.isIntersecting) {
          setZichtbaar(true)
          kijker.disconnect()
        }
      },
      // Even voordat het in beeld komt al starten, dan voelt het natuurlijker.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )
    kijker.observe(element)
    return () => kijker.disconnect()
  }, [])

  const verplaatsing = {
    onder: 'translate3d(0, 28px, 0)',
    links: 'translate3d(-28px, 0, 0)',
    rechts: 'translate3d(28px, 0, 0)',
    geen: 'none',
  }[richting]

  return (
    <Element
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-verschijnt=""
      className={className}
      style={{
        opacity: zichtbaar ? 1 : 0,
        transform: zichtbaar ? 'none' : verplaatsing,
        transition: `opacity 700ms var(--ease-rustig) ${vertraging}s, transform 700ms var(--ease-rustig) ${vertraging}s`,
        willChange: zichtbaar ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </Element>
  )
}
