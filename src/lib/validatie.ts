/**
 * De controles op wat bezoekers invullen.
 *
 * Deze regels gelden zowel in de browser (meteen feedback tijdens het invullen)
 * als op de server (want wat uit de browser komt is nooit te vertrouwen).
 * Eén bestand, zodat de foutmeldingen overal hetzelfde zijn.
 *
 * De meldingen zijn in gewone Nederlandse taal en spreken met "je".
 */

import { z } from 'zod'

const TELEFOON = /^[+0][\d\s\-()]{8,19}$/

const tekst = (min: number, max: number, veld: string) =>
  z
    .string()
    .trim()
    .min(min, `Vul je ${veld} in.`)
    .max(max, `Dit is wel erg lang. Houd het bij ${max} tekens.`)

export const contactSchema = z
  .object({
    voornaam: tekst(2, 60, 'voornaam'),
    achternaam: tekst(2, 60, 'achternaam'),

    telefoon: z
      .string()
      .trim()
      .min(1, 'Vul je telefoonnummer in, dan kunnen we je bereiken.')
      .regex(TELEFOON, 'Dit lijkt geen geldig telefoonnummer. Bijvoorbeeld: 06 12 34 56 78.'),

    email: z
      .string()
      .trim()
      .min(1, 'Vul je e-mailadres in.')
      .email('Dit lijkt geen geldig e-mailadres. Staat de @ erin?')
      .max(254),

    keuze: z.enum(['afspraak', 'informatie'], {
      message: 'Laat ons weten waarvoor je contact opneemt.',
    }),

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
      .default([]),

    bericht: z.string().trim().max(2000, 'Houd je bericht bij 2000 tekens.').default(''),

    privacy: z.literal(true, {
      message: 'Je moet akkoord gaan met de privacyverklaring voordat we je gegevens mogen gebruiken.',
    }),

    /**
     * Honeypot: een veld dat voor mensen onzichtbaar is. Vult een bot het toch
     * in, dan weten we genoeg. Moet dus leeg blijven.
     */
    website: z.string().max(0).optional().default(''),

    /** Het bewijs van Cloudflare Turnstile. Leeg als Turnstile niet aanstaat. */
    turnstileToken: z.string().optional().default(''),
  })
  .superRefine((waarden, ctx) => {
    // Voorkeuren vragen we alleen als iemand een afspraak wil.
    if (waarden.keuze !== 'afspraak') return
    if (waarden.voorkeursdagen.length === 0 && waarden.voorkeursdagdelen.length === 0) {
      // Geen harde eis - liever een afspraakverzoek zonder voorkeur dan geen
      // verzoek. Dit blijft dus bewust leeg.
    }
    if (waarden.onderwerpen.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['onderwerpen'],
        message: 'Kies waar het over gaat, dan kunnen we ons goed voorbereiden.',
      })
    }
  })

export type ContactGegevens = z.infer<typeof contactSchema>

/** De labels zoals ze op het scherm staan, ook gebruikt in de e-mail. */
export const LABELS = {
  keuze: {
    afspraak: 'Ik wil graag een afspraak maken',
    informatie: 'Ik wil graag meer informatie',
  },
  dagen: {
    woensdag: 'Woensdag',
    donderdag: 'Donderdag',
    vrijdag: 'Vrijdag',
    zaterdag: 'Zaterdag',
  },
  dagdelen: {
    ochtend: 'Ochtend',
    middag: 'Middag',
    avond: 'Avond (in overleg)',
  },
  onderwerpen: {
    oogmeting: 'Oogmeting',
    brillen: 'Brillen',
    zonnebrillen: 'Zonnebrillen',
    contactlenzen: 'Contactlenzen',
    kinderbrillen: 'Kinderbrillen',
    loepbrillen: 'Loepbrillen',
    'bril-bijstellen': 'Bril bijstellen',
  },
} as const

export const boekingSchema = z.object({
  dienstId: z.string().min(1, 'Kies eerst waarvoor je komt.'),
  datum: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Kies een dag.'),
  tijd: z.string().regex(/^\d{2}:\d{2}$/, 'Kies een tijd.'),
  voornaam: tekst(2, 60, 'voornaam'),
  achternaam: tekst(2, 60, 'achternaam'),
  email: z.string().trim().email('Dit lijkt geen geldig e-mailadres. Staat de @ erin?'),
  telefoon: z
    .string()
    .trim()
    .regex(TELEFOON, 'Dit lijkt geen geldig telefoonnummer. Bijvoorbeeld: 06 12 34 56 78.'),
  opmerking: z.string().trim().max(1000).optional().default(''),
  privacy: z.literal(true, {
    message: 'Je moet akkoord gaan met de privacyverklaring voordat we je afspraak kunnen vastleggen.',
  }),
  website: z.string().max(0).optional().default(''),
  turnstileToken: z.string().optional().default(''),
})

export type BoekingFormulier = z.infer<typeof boekingSchema>
