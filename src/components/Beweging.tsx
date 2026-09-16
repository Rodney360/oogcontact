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

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'

/**
 * Volgt een mediaquery van de browser.
 *
 * useSyncExternalStore is hier de juiste manier: de waarde komt van buiten
 * React, en React weet zo precies wanneer hij opnieuw moet tekenen. Bij het
 * renderen op de server bestaat `window` niet; dan geven we de veilige waarde
 * terug die als tweede meegegeven wordt.
 */
function useMediaQuery(vraag: string, opDeServer: boolean): boolean {
  const abonneer = useCallback(
    (opWijziging: () => void) => {
      const mq = window.matchMedia(vraag)
      mq.addEventListener('change', opWijziging)
      return () => mq.removeEventListener('change', opWijziging)
    },
    [vraag],
  )

  return useSyncExternalStore(
    abonneer,
    () => window.matchMedia(vraag).matches,
    () => opDeServer,
  )
}

/** Of de bezoeker in zijn systeem heeft aangegeven minder beweging te willen. */
export function useMinderBeweging(): boolean {
  // Op de server gaan we uit van "minder beweging": liever een rustige eerste
  // weergave dan een animatie die meteen onderbroken wordt.
  return useMediaQuery('(prefers-reduced-motion: reduce)', true)
}

/** Of dit een apparaat met een muis is. Alleen daar doen we hover-effecten. */
export function useHeeftMuis(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)', false)
}

type SoepelScroller = {
  raf: (t: number) => void
  destroy: () => void
  stop: () => void
  start: () => void
}

/**
 * Het soepele scrollen even stilzetten.
 *
 * Nodig zodra er iets over het hele scherm heen ligt, zoals het menu op
 * mobiel. Alleen `overflow: hidden` op de pagina is dan niet genoeg: het
 * soepele scrollen verzet de pagina zelf en trekt zich daar niets van aan.
 * Daarom wordt hier de motor even uitgezet.
 *
 * Het staat los van React, omdat degene die het stilzet (de koptekst) en
 * degene die het aanzet (deze module) niets van elkaar hoeven te weten. Wordt
 * het soepele scrollen later pas geladen, dan onthoudt `scrollenStil` dat het
 * meteen stil moet beginnen.
 */
let scroller: SoepelScroller | null = null
let scrollenStil = false

export function zetSoepelScrollenStil(stil: boolean) {
  scrollenStil = stil
  if (stil) scroller?.stop()
  else scroller?.start()
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

    let lenis: SoepelScroller | null = null
    let frame = 0
    let gestopt = false

    import('lenis').then(({ default: Lenis }) => {
      if (gestopt) return
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
      })
      scroller = lenis
      if (scrollenStil) lenis.stop()
      const stap = (tijd: number) => {
        lenis?.raf(tijd)
        frame = requestAnimationFrame(stap)
      }
      frame = requestAnimationFrame(stap)
    })

    return () => {
      gestopt = true
      cancelAnimationFrame(frame)
      if (scroller === lenis) scroller = null
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

    // Wie minder beweging wil, krijgt dit sowieso meteen te zien: globals.css
    // zet [data-verschijnt] dan hard op zichtbaar. Hier hoeft dus niets extra's.
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
