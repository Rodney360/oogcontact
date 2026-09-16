/** De gegevens die tussen de browser en de server heen en weer gaan. */

export type AgendaDienst = {
  id: string
  naam: string
  /** Onze eigen uitleg in gewone taal, uit src/content/diensten.ts. */
  uitleg: string
  duurMinuten: number
  groep: string
}

export type VrijeTijd = {
  /** "09:30" in Nederlandse tijd. */
  tijd: string
}

export type VrijeDag = {
  /** "2026-09-16" */
  datum: string
  tijden: string[]
}

export type BoekingGegevens = {
  dienstId: string
  datum: string
  tijd: string
  voornaam: string
  achternaam: string
  email: string
  telefoon: string
  opmerking?: string
}

export type BoekingResultaat =
  | { gelukt: true; referentie: string; testmodus: boolean }
  | { gelukt: false; reden: 'bezet' | 'onbereikbaar' | 'ongeldig'; melding: string }
