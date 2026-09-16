import 'server-only'

/**
 * De controle op de server.
 *
 * Wat uit de browser komt is nooit te vertrouwen, dus alles wordt hier nog een
 * keer nagelopen - ook als de browser het al goedgekeurd had.
 *
 * De regels en de foutmeldingen komen uit src/lib/veldregels.ts, hetzelfde
 * bestand dat de browser gebruikt. Zo staat er nergens een andere grens of een
 * andere melding. Zod zelf blijft op de server: in de browser zou die bijna
 * 400 kB aan code toevoegen voor een handjevol controles.
 */

import { z } from 'zod'

import {
  EMAIL_PATROON,
  MAX,
  MELDING,
  TELEFOON_PATROON,
} from './veldregels.ts'

const naam = (leegMelding: string) =>
  z
    .string()
    .trim()
    .min(2, leegMelding)
    .max(MAX.naam, MELDING.teLang(MAX.naam))

const telefoon = z
  .string()
  .trim()
  .min(1, MELDING.telefoonLeeg)
  .regex(TELEFOON_PATROON, MELDING.telefoon)

const email = z
  .string()
  .trim()
  .min(1, MELDING.emailLeeg)
  .regex(EMAIL_PATROON, MELDING.email)
  .max(MAX.email, MELDING.email)

export const contactSchema = z.object({
  voornaam: naam(MELDING.voornaam),
  achternaam: naam(MELDING.achternaam),
  telefoon,
  email,

  keuze: z.enum(['afspraak', 'informatie'], { message: MELDING.keuze }),

  voorkeursdagen: z.array(z.enum(['woensdag', 'donderdag', 'vrijdag', 'zaterdag'])).default([]),
  voorkeursdagdelen: z.array(z.enum(['ochtend', 'middag', 'avond'])).default([]),

  onderwerpen: z
    .array(
      z.enum([
        'oogmeting',
        'brillen',
        'zonnebrillen',
        'contactlenzen',
        'kinderbrillen',
        'loepbrillen',
        'bril-bijstellen',
      ]),
    )
    .min(1, MELDING.onderwerpen),

  bericht: z.string().trim().max(MAX.bericht, MELDING.berichtTeLang).default(''),

  privacy: z.literal(true, { message: MELDING.privacyContact }),

  /**
   * Honeypot: een veld dat voor mensen onzichtbaar is. Vult een bot het toch
   * in, dan weten we genoeg. Moet dus leeg blijven.
   */
  website: z.string().max(0).optional().default(''),

  /** Het bewijs van Cloudflare Turnstile. Leeg als Turnstile niet aanstaat. */
  turnstileToken: z.string().optional().default(''),
})

export type ContactGegevens = z.infer<typeof contactSchema>

export const boekingSchema = z.object({
  dienstId: z.string().min(1, MELDING.dienst),
  datum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, MELDING.datum),
  tijd: z.string().regex(/^\d{2}:\d{2}$/, MELDING.tijd),
  voornaam: naam(MELDING.voornaam),
  achternaam: naam(MELDING.achternaam),
  email,
  telefoon,
  opmerking: z.string().trim().max(MAX.opmerking).optional().default(''),
  privacy: z.literal(true, { message: MELDING.privacyBoeking }),
  website: z.string().max(0).optional().default(''),
  turnstileToken: z.string().optional().default(''),
})

export type BoekingFormulier = z.infer<typeof boekingSchema>
