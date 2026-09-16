import 'server-only'

/**
 * De beveiliging rond de formulieren: niet te vaak achter elkaar versturen,
 * en een onzichtbare controle of er een mens achter zit.
 */

/* ------------------------------------------------------- snelheidsbegrenzer */

type Teller = { aantal: number; resetOp: number }

/**
 * Onthoudt per afzender hoeveel verzoeken er binnenkwamen.
 *
 * Dit zit in het geheugen van de server. Draaien er meerdere servers naast
 * elkaar, dan telt elke server apart - voor een winkel van deze omvang is dat
 * ruim voldoende. Wordt het ooit te druk, dan is dit de plek om er een echte
 * gedeelde teller (bijvoorbeeld Vercel KV) van te maken.
 */
const tellers = new Map<string, Teller>()

export type Begrenzing = { toegestaan: boolean; wachtSeconden: number }

export function begrens(sleutel: string, maxAantal: number, perSeconden: number): Begrenzing {
  const nu = Date.now()
  const teller = tellers.get(sleutel)

  if (!teller || nu > teller.resetOp) {
    tellers.set(sleutel, { aantal: 1, resetOp: nu + perSeconden * 1000 })
    opruimen(nu)
    return { toegestaan: true, wachtSeconden: 0 }
  }

  teller.aantal += 1
  if (teller.aantal > maxAantal) {
    return { toegestaan: false, wachtSeconden: Math.ceil((teller.resetOp - nu) / 1000) }
  }
  return { toegestaan: true, wachtSeconden: 0 }
}

/** Oude tellers weggooien, zodat het geheugen niet volloopt. */
function opruimen(nu: number) {
  if (tellers.size < 500) return
  for (const [sleutel, teller] of tellers) {
    if (nu > teller.resetOp) tellers.delete(sleutel)
  }
}

/** Wie het verzoek stuurt, voor zover we dat kunnen zien. */
export function afzender(verzoek: Request): string {
  const koppen = verzoek.headers
  const doorgegeven = koppen.get('x-forwarded-for')?.split(',')[0]?.trim()
  return doorgegeven || koppen.get('x-real-ip') || 'onbekend'
}

/* ------------------------------------------------------------- Turnstile */

/**
 * Controleert het bewijs van Cloudflare Turnstile.
 *
 * Staat Turnstile niet ingesteld (geen sleutel), dan slaan we de controle over.
 * Zo werkt de site ook zonder sleutels, en houden de honeypot en de
 * snelheidsbegrenzer de meeste bots alsnog tegen.
 */
export async function controleerTurnstile(token: string, ip: string): Promise<boolean> {
  const geheim = process.env.TURNSTILE_SECRET_KEY
  if (!geheim) {
    console.warn('[beveiliging] Turnstile staat uit (geen TURNSTILE_SECRET_KEY).')
    return true
  }
  if (!token) return false

  try {
    const antwoord = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: geheim, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    })
    const uitslag = (await antwoord.json()) as { success?: boolean }
    return uitslag.success === true
  } catch (fout) {
    console.error('[beveiliging] Turnstile onbereikbaar:', fout)
    // Liever een echte bezoeker doorlaten dan iedereen buitensluiten als
    // Cloudflare even hapert. De honeypot en de begrenzer vangen dit op.
    return true
  }
}
