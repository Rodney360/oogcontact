/**
 * Leest wat Gerard en Gerda in het beheerscherm hebben ingevuld.
 *
 * Alles wat ze daar opslaan komt als gewoon bestand in de repo terecht. Dit
 * bestand maakt daar bruikbare gegevens van, met twee vaste regels:
 *   - een leeg of half ingevuld bestand mag de site nooit stukmaken;
 *   - staat er niets, dan valt de site terug op wat er in de code staat.
 */

import { createReader } from '@keystatic/core/reader'

import keystaticConfig from '../../keystatic.config'
import mededelingBestand from '../content/beheer/mededeling.json'
import uitzonderingenBestand from '../content/beheer/uitzonderingen.json'
import { naarMinuten, type Uitzondering } from '../content/openingstijden.ts'
import { MERKEN, type Merk } from '../content/merken.ts'

export const lezer = createReader(process.cwd(), keystaticConfig)

/* --------------------------------------------------------------- mededeling */

export type Mededeling = { tekst: string; link: string | null }

/** "2026-09-16" van vandaag, in Nederlandse tijd. */
function vandaag(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date())
}

/**
 * De mededeling bovenaan de site, als die er nu hoort te staan.
 *
 * Gaat vanzelf aan en uit op basis van de begin- en einddatum, zodat een
 * vakantiemelding niet handmatig weggehaald hoeft te worden.
 */
export function huidigeMededeling(nu: string = vandaag()): Mededeling | null {
  const m = mededelingBestand as {
    actief?: boolean
    tekst?: string
    vanaf?: string | null
    totEnMet?: string | null
    link?: string
  }

  if (!m.actief) return null
  const tekst = (m.tekst ?? '').trim()
  if (!tekst) return null

  // Datums vergelijken als tekst kan gewoon: "2026-09-16" > "2026-07-01".
  if (m.vanaf && nu < m.vanaf) return null
  if (m.totEnMet && nu > m.totEnMet) return null

  return { tekst, link: (m.link ?? '').trim() || null }
}

/* ----------------------------------------------------------- openingstijden */

/**
 * De afwijkende dagen, in de vorm die de openingstijden-berekening verwacht.
 * Regels die niet kloppen worden overgeslagen in plaats van dat ze de site
 * omleggen - een typefout in het beheerscherm mag nooit de site slopen.
 */
export function uitzonderingen(): Uitzondering[] {
  const ruw = (uitzonderingenBestand as { dagen?: unknown[] }).dagen ?? []

  return ruw.flatMap((regel): Uitzondering[] => {
    const r = regel as {
      datum?: string
      gesloten?: boolean
      van?: string
      tot?: string
      reden?: string
    }
    if (!r.datum || !/^\d{4}-\d{2}-\d{2}$/.test(r.datum)) return []

    const reden = (r.reden ?? '').trim() || 'Afwijkende openingstijden'
    if (r.gesloten !== false) return [{ datum: r.datum, dagdelen: [], reden }]

    const van = (r.van ?? '').trim()
    const tot = (r.tot ?? '').trim()
    if (!/^\d{1,2}:\d{2}$/.test(van) || !/^\d{1,2}:\d{2}$/.test(tot)) {
      // Wel open, maar de tijden zijn niet te lezen. Dan liever de gewone
      // openingstijden aanhouden dan iets onwaars tonen.
      return []
    }
    const vanMinuten = naarMinuten(van)
    const totMinuten = naarMinuten(tot)
    if (totMinuten <= vanMinuten) return []

    return [{ datum: r.datum, dagdelen: [{ van: vanMinuten, tot: totMinuten }], reden }]
  })
}

/* --------------------------------------------------------------------- merken */

/** De merken uit het beheerscherm, of anders de lijst uit de code. */
export async function merken(): Promise<Merk[]> {
  try {
    const uitBeheer = await lezer.collections.merken.all()
    const zichtbaar = uitBeheer.filter((m) => m.entry.zichtbaar)
    if (zichtbaar.length === 0) return MERKEN

    return zichtbaar.map((m) => ({
      naam: m.entry.naam ?? m.slug,
      herkomst: (m.entry.herkomst ?? '').trim() || null,
      soorten: (m.entry.soorten ?? ['monturen']) as Merk['soorten'],
      toelichting: (m.entry.toelichting ?? '').trim() || undefined,
      // Wat in het beheerscherm staat is door Gerard of Gerda zelf ingevuld.
      herkomstBevestigd: true,
    }))
  } catch {
    return MERKEN
  }
}

/* ---------------------------------------------------------------- instagram */

export type InstagramBericht = {
  slug: string
  omschrijving: string
  afbeelding: string
  link: string | null
}

/**
 * De Instagram-berichten die in het beheerscherm gezet zijn.
 *
 * Bewust geen automatische feed: die kan tegenwoordig niet meer zonder een
 * betaalde dienst of een app-registratie bij Meta, en een zware widget maakt
 * de pagina traag. Zo blijft het licht en houden Gerard en Gerda zelf de regie.
 */
export async function instagram(): Promise<InstagramBericht[]> {
  try {
    const alles = await lezer.collections.instagram.all()
    return alles
      .map((b) => ({
        slug: b.slug,
        omschrijving: b.entry.omschrijving ?? '',
        afbeelding: b.entry.afbeelding ?? '',
        link: (b.entry.link ?? '').trim() || null,
        volgorde: b.entry.volgorde ?? 0,
      }))
      .filter((b) => b.afbeelding)
      .sort((a, b) => a.volgorde - b.volgorde || a.slug.localeCompare(b.slug))
      .slice(0, 8)
      .map(({ volgorde: _volgorde, ...rest }) => rest)
  } catch {
    return []
  }
}

/* ------------------------------------------------------------------- nieuws */

export type Bericht = {
  slug: string
  titel: string
  datum: string
  samenvatting: string
}

/** De gepubliceerde nieuwsberichten, nieuwste eerst. */
export async function berichten(): Promise<Bericht[]> {
  try {
    const alles = await lezer.collections.nieuws.all()
    return alles
      .filter((b) => b.entry.gepubliceerd)
      .map((b) => ({
        slug: b.slug,
        titel: b.entry.titel ?? b.slug,
        datum: b.entry.datum ?? '',
        samenvatting: b.entry.samenvatting ?? '',
      }))
      .sort((a, b) => b.datum.localeCompare(a.datum))
  } catch {
    return []
  }
}

/** Eén nieuwsbericht, inclusief de tekst. */
export async function bericht(slug: string) {
  try {
    const gevonden = await lezer.collections.nieuws.read(slug, { resolveLinkedFiles: true })
    if (!gevonden || !gevonden.gepubliceerd) return null
    return gevonden
  } catch {
    return null
  }
}
