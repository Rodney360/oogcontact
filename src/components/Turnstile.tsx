'use client'

/**
 * De onzichtbare controle van Cloudflare Turnstile.
 *
 * De bezoeker merkt hier niets van: er verschijnt geen vinkje en geen puzzel.
 * Staat de sleutel niet ingesteld, dan doet dit onderdeel helemaal niets en
 * werkt het formulier gewoon. De honeypot en de snelheidsbegrenzer op de
 * server vangen dat op.
 */

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, opties: Record<string, unknown>) => string
      remove: (widgetId: string) => void
    }
  }
}

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export function Turnstile({ opToken }: { opToken: (token: string) => void }) {
  const vak = useRef<HTMLDivElement>(null)
  const opTokenRef = useRef(opToken)

  const sleutel = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // De meest recente callback onthouden, zonder Turnstile opnieuw te tekenen.
  useEffect(() => {
    opTokenRef.current = opToken
  }, [opToken])

  useEffect(() => {
    if (!sleutel || !vak.current) return

    let widgetId: string | null = null
    let gestopt = false

    const tekenen = () => {
      if (gestopt || !vak.current || !window.turnstile) return
      widgetId = window.turnstile.render(vak.current, {
        sitekey: sleutel,
        size: 'invisible',
        callback: (token: string) => opTokenRef.current(token),
        'error-callback': () => opTokenRef.current(''),
        'expired-callback': () => opTokenRef.current(''),
      })
    }

    if (window.turnstile) {
      tekenen()
    } else {
      const bestaand = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`)
      if (bestaand) {
        bestaand.addEventListener('load', tekenen)
      } else {
        const script = document.createElement('script')
        script.src = SCRIPT
        script.async = true
        script.defer = true
        script.addEventListener('load', tekenen)
        document.head.appendChild(script)
      }
    }

    return () => {
      gestopt = true
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [sleutel])

  if (!sleutel) return null
  return <div ref={vak} className="hidden" aria-hidden="true" />
}
