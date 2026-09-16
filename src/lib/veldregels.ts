/**
 * De regels waaraan de formuliervelden moeten voldoen, en de foutmeldingen die
 * erbij horen.
 *
 * Bewust gewone JavaScript en geen Zod: dit bestand draait ook in de browser,
 * en Zod zou daar bijna 400 kB aan code aan toevoegen voor een handjevol
 * controles. Op de server wordt hiermee alsnog een Zod-schema opgebouwd
 * (zie validatie.ts), zodat de regels en de meldingen op beide plekken
 * letterlijk dezelfde zijn.
 *
 * De meldingen spreken de bezoeker aan met "je", net als de rest van de site.
 */

export const TELEFOON_PATROON = /^[+0][\d\s\-()]{8,19}$/
export const EMAIL_PATROON = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export const MELDING = {
  voornaam: 'Vul je voornaam in.',
  achternaam: 'Vul je achternaam in.',
  telefoon: 'Dit lijkt geen geldig telefoonnummer. Bijvoorbeeld: 06 12 34 56 78.',
  telefoonLeeg: 'Vul je telefoonnummer in, dan kunnen we je bereiken.',
  email: 'Dit lijkt geen geldig e-mailadres. Staat de @ erin?',
  emailLeeg: 'Vul je e-mailadres in.',
  keuze: 'Laat ons weten waarvoor je contact opneemt.',
  onderwerpen: 'Kies waar het over gaat, dan kunnen we ons goed voorbereiden.',
  privacyContact:
    'Je moet akkoord gaan met de privacyverklaring voordat we je gegevens mogen gebruiken.',
  privacyBoeking:
    'Je moet akkoord gaan met de privacyverklaring voordat we je afspraak kunnen vastleggen.',
  berichtTeLang: 'Houd je bericht bij 2000 tekens.',
  teLang: (max: number) => `Dit is wel erg lang. Houd het bij ${max} tekens.`,
  dienst: 'Kies eerst waarvoor je komt.',
  datum: 'Kies een dag.',
  tijd: 'Kies een tijd.',
} as const

export const MAX = {
  naam: 60,
  email: 254,
  bericht: 2000,
  opmerking: 1000,
} as const

/* ------------------------------------------------------- losse controles -- */

export function naamFout(waarde: string, melding: string): string | null {
  const schoon = waarde.trim()
  if (schoon.length < 2) return melding
  if (schoon.length > MAX.naam) return MELDING.teLang(MAX.naam)
  return null
}

export function telefoonFout(waarde: string): string | null {
  const schoon = waarde.trim()
  if (!schoon) return MELDING.telefoonLeeg
  if (!TELEFOON_PATROON.test(schoon)) return MELDING.telefoon
  return null
}

export function emailFout(waarde: string): string | null {
  const schoon = waarde.trim()
  if (!schoon) return MELDING.emailLeeg
  if (!EMAIL_PATROON.test(schoon) || schoon.length > MAX.email) return MELDING.email
  return null
}

/* --------------------------------------------------- hele formulieren ----- */

export type ContactWaarden = {
  voornaam: string
  achternaam: string
  telefoon: string
  email: string
  keuze: string
  onderwerpen: string[]
  bericht: string
  privacy: boolean
}

/** Controleert het aanvraagformulier. Geeft per veld hooguit één melding. */
export function contactFouten(w: ContactWaarden): Record<string, string> {
  const fouten: Record<string, string> = {}
  const zet = (veld: string, fout: string | null) => { if (fout) fouten[veld] = fout }

  zet('voornaam', naamFout(w.voornaam, MELDING.voornaam))
  zet('achternaam', naamFout(w.achternaam, MELDING.achternaam))
  zet('telefoon', telefoonFout(w.telefoon))
  zet('email', emailFout(w.email))
  if (w.keuze !== 'afspraak' && w.keuze !== 'informatie') fouten.keuze = MELDING.keuze
  if (w.onderwerpen.length === 0) fouten.onderwerpen = MELDING.onderwerpen
  if (w.bericht.trim().length > MAX.bericht) fouten.bericht = MELDING.berichtTeLang
  if (!w.privacy) fouten.privacy = MELDING.privacyContact

  return fouten
}

export type BoekingWaarden = {
  voornaam: string
  achternaam: string
  email: string
  telefoon: string
  privacy: boolean
}

/** Controleert de gegevens bij een boeking. */
export function boekingFouten(w: BoekingWaarden): Record<string, string> {
  const fouten: Record<string, string> = {}
  const zet = (veld: string, fout: string | null) => { if (fout) fouten[veld] = fout }

  zet('voornaam', naamFout(w.voornaam, MELDING.voornaam))
  zet('achternaam', naamFout(w.achternaam, MELDING.achternaam))
  zet('email', emailFout(w.email))
  zet('telefoon', telefoonFout(w.telefoon))
  if (!w.privacy) fouten.privacy = MELDING.privacyBoeking

  return fouten
}
