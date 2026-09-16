import 'server-only'

/**
 * De e-mails die de site verstuurt.
 *
 * Twee per aanvraag: een nette mail naar de winkel (met de klant als
 * antwoordadres, zodat Gerard of Gerda gewoon op "Beantwoorden" kan klikken)
 * en een bevestiging naar de klant in de huisstijl.
 *
 * ZONDER SLEUTEL wordt er niets verstuurd, maar wel getoond wat er verstuurd
 * zou zijn. Zo werkt het formulier ook op een computer zonder sleutels.
 */

import { BEDRIJF, adresOpEenRegel, whatsappLink } from '../content/bedrijf.ts'
import { LABELS } from '../content/labels.ts'
import type { ContactGegevens } from './validatie.ts'

const SLEUTEL = process.env.RESEND_API_KEY ?? ''
const AFZENDER = process.env.MAIL_AFZENDER ?? `Oogcontact bij Gerard <website@oogcontactbijgerard.nl>`
const ONTVANGER = process.env.MAIL_ONTVANGER ?? BEDRIJF.email

export const MAIL_TESTMODUS = !SLEUTEL

/** Maakt tekst veilig om in HTML te zetten. */
function veilig(tekst: string): string {
  return tekst
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

type MailOpdracht = {
  aan: string
  onderwerp: string
  html: string
  tekst: string
  antwoordAan?: string
}

async function verstuur(opdracht: MailOpdracht): Promise<boolean> {
  if (MAIL_TESTMODUS) {
    console.log('[mail] TESTMODUS - er is niets verstuurd:', {
      aan: opdracht.aan,
      onderwerp: opdracht.onderwerp,
      antwoordAan: opdracht.antwoordAan,
      tekst: opdracht.tekst,
    })
    return true
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(SLEUTEL)
    const { error } = await resend.emails.send({
      from: AFZENDER,
      to: opdracht.aan,
      subject: opdracht.onderwerp,
      html: opdracht.html,
      text: opdracht.tekst,
      ...(opdracht.antwoordAan ? { replyTo: opdracht.antwoordAan } : {}),
    })
    if (error) {
      console.error('[mail] versturen mislukt:', error)
      return false
    }
    return true
  } catch (fout) {
    console.error('[mail] versturen mislukt:', fout)
    return false
  }
}

/* ------------------------------------------------------------------- opmaak */

const INKT = '#11151C'
const IVOOR = '#FBF2E6'
const MESSING = '#C9A96A'

/** Het omhulsel van elke mail: donker, warm, met het adres eronder. */
function omhulsel(titel: string, inhoud: string): string {
  return `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${veilig(titel)}</title></head>
<body style="margin:0;padding:0;background:${INKT};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${INKT};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${INKT};border:1px solid #2A3240;border-radius:16px;overflow:hidden;">
  <tr><td style="padding:32px 32px 8px;">
    <p style="margin:0;font:600 13px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:${MESSING};">
      ${veilig(BEDRIJF.naam)}
    </p>
  </td></tr>
  <tr><td style="padding:8px 32px 32px;font:400 16px/1.7 -apple-system,Segoe UI,Roboto,sans-serif;color:${IVOOR};">
    ${inhoud}
  </td></tr>
  <tr><td style="padding:24px 32px;border-top:1px solid #2A3240;font:400 14px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#B9AF9F;">
    ${veilig(adresOpEenRegel())}<br>
    <a href="tel:${BEDRIJF.telefoon.link}" style="color:${MESSING};text-decoration:none;">${veilig(BEDRIJF.telefoon.weergave)}</a>
    &nbsp;&middot;&nbsp;
    <a href="${whatsappLink()}" style="color:${MESSING};text-decoration:none;">WhatsApp</a>
    &nbsp;&middot;&nbsp;
    <a href="mailto:${BEDRIJF.email}" style="color:${MESSING};text-decoration:none;">${veilig(BEDRIJF.email)}</a>
  </td></tr>
</table>
</td></tr></table>
</body></html>`
}

function regel(label: string, waarde: string): string {
  if (!waarde) return ''
  return `<tr>
    <td style="padding:6px 16px 6px 0;vertical-align:top;color:#B9AF9F;white-space:nowrap;">${veilig(label)}</td>
    <td style="padding:6px 0;vertical-align:top;color:${IVOOR};">${veilig(waarde)}</td>
  </tr>`
}

/* ------------------------------------------------------------ contactaanvraag */

export async function stuurContactaanvraag(gegevens: ContactGegevens): Promise<boolean> {
  const naam = `${gegevens.voornaam} ${gegevens.achternaam}`
  const wat = LABELS.keuze[gegevens.keuze]
  const dagen = gegevens.voorkeursdagen.map((d) => LABELS.dagen[d]).join(', ')
  const dagdelen = gegevens.voorkeursdagdelen.map((d) => LABELS.dagdelen[d]).join(', ')
  const onderwerpen = gegevens.onderwerpen.map((o) => LABELS.onderwerpen[o]).join(', ')

  const naarWinkel = verstuur({
    aan: ONTVANGER,
    antwoordAan: gegevens.email,
    onderwerp: `${gegevens.keuze === 'afspraak' ? 'Afspraakverzoek' : 'Vraag'} van ${naam}`,
    html: omhulsel(
      `Aanvraag van ${naam}`,
      `<h1 style="margin:0 0 20px;font:500 24px/1.2 Georgia,serif;color:${IVOOR};">${veilig(wat)}</h1>
       <table role="presentation" cellpadding="0" cellspacing="0" style="font:400 15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;">
         ${regel('Naam', naam)}
         ${regel('Telefoon', gegevens.telefoon)}
         ${regel('E-mail', gegevens.email)}
         ${regel('Voorkeursdag', dagen)}
         ${regel('Dagdeel', dagdelen)}
         ${regel('Onderwerp', onderwerpen)}
       </table>
       ${
         gegevens.bericht
           ? `<p style="margin:24px 0 8px;color:#B9AF9F;font-size:14px;">Bericht</p>
              <p style="margin:0;padding:16px;background:#1A202A;border-radius:8px;white-space:pre-wrap;">${veilig(gegevens.bericht)}</p>`
           : ''
       }
       <p style="margin:28px 0 0;font-size:14px;color:#B9AF9F;">
         Je kunt gewoon op Beantwoorden klikken: het antwoord gaat dan naar ${veilig(gegevens.email)}.
       </p>`,
    ),
    tekst: [
      wat,
      '',
      `Naam: ${naam}`,
      `Telefoon: ${gegevens.telefoon}`,
      `E-mail: ${gegevens.email}`,
      dagen ? `Voorkeursdag: ${dagen}` : '',
      dagdelen ? `Dagdeel: ${dagdelen}` : '',
      onderwerpen ? `Onderwerp: ${onderwerpen}` : '',
      gegevens.bericht ? `\nBericht:\n${gegevens.bericht}` : '',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const naarKlant = verstuur({
    aan: gegevens.email,
    onderwerp: 'We hebben je bericht ontvangen',
    html: omhulsel(
      'We hebben je bericht ontvangen',
      `<h1 style="margin:0 0 20px;font:500 26px/1.2 Georgia,serif;color:${IVOOR};">Dankjewel, ${veilig(gegevens.voornaam)}</h1>
       <p style="margin:0 0 16px;">
         We hebben je bericht binnen en nemen zo snel mogelijk contact met je op.
         Meestal is dat op de eerstvolgende dag dat we open zijn.
       </p>
       ${
         gegevens.keuze === 'afspraak'
           ? `<p style="margin:0 0 16px;">
                Wil je liever meteen zelf een moment kiezen? Dat kan online:
                <a href="https://oogcontactbijgerard.nl/afspraak-maken/" style="color:${MESSING};">afspraak maken</a>.
              </p>`
           : ''
       }
       <p style="margin:0 0 24px;">Heb je haast? Bel ons gerust, of stuur een appje.</p>
       <p style="margin:0 0 8px;color:#B9AF9F;font-size:14px;">Dit hebben we van je ontvangen:</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="font:400 15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;">
         ${regel('Wat', wat)}
         ${regel('Voorkeursdag', dagen)}
         ${regel('Dagdeel', dagdelen)}
         ${regel('Onderwerp', onderwerpen)}
       </table>
       <p style="margin:28px 0 0;font-style:italic;color:${MESSING};">${veilig(BEDRIJF.slogan)}</p>
       <p style="margin:8px 0 0;">Gerard en Gerda</p>`,
    ),
    tekst: [
      `Dankjewel, ${gegevens.voornaam}`,
      '',
      'We hebben je bericht binnen en nemen zo snel mogelijk contact met je op.',
      'Meestal is dat op de eerstvolgende dag dat we open zijn.',
      '',
      `Wat: ${wat}`,
      dagen ? `Voorkeursdag: ${dagen}` : '',
      dagdelen ? `Dagdeel: ${dagdelen}` : '',
      onderwerpen ? `Onderwerp: ${onderwerpen}` : '',
      '',
      BEDRIJF.slogan,
      'Gerard en Gerda',
    ]
      .filter(Boolean)
      .join('\n'),
  })

  const [winkelOk, klantOk] = await Promise.all([naarWinkel, naarKlant])
  // De mail naar de winkel is de belangrijkste: die mag niet mislukken.
  if (!klantOk) console.warn('[mail] bevestiging naar de klant is niet verstuurd')
  return winkelOk
}

/* --------------------------------------------------------- afspraakbevestiging */

export async function stuurAfspraakBevestiging(afspraak: {
  voornaam: string
  achternaam: string
  email: string
  telefoon: string
  dienstNaam: string
  datum: string
  tijd: string
  opmerking?: string
  referentie: string
}): Promise<boolean> {
  const naam = `${afspraak.voornaam} ${afspraak.achternaam}`
  const wanneer = `${nederlandseDatum(afspraak.datum)} om ${afspraak.tijd.replace(':', '.')} uur`

  const naarWinkel = verstuur({
    aan: ONTVANGER,
    antwoordAan: afspraak.email,
    onderwerp: `Nieuwe afspraak: ${naam} – ${wanneer}`,
    html: omhulsel(
      'Nieuwe afspraak',
      `<h1 style="margin:0 0 20px;font:500 24px/1.2 Georgia,serif;color:${IVOOR};">Nieuwe afspraak via de website</h1>
       <table role="presentation" cellpadding="0" cellspacing="0" style="font:400 15px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;">
         ${regel('Wanneer', wanneer)}
         ${regel('Waarvoor', afspraak.dienstNaam)}
         ${regel('Naam', naam)}
         ${regel('Telefoon', afspraak.telefoon)}
         ${regel('E-mail', afspraak.email)}
         ${regel('Kenmerk', afspraak.referentie)}
       </table>
       ${
         afspraak.opmerking
           ? `<p style="margin:24px 0 8px;color:#B9AF9F;font-size:14px;">Opmerking</p>
              <p style="margin:0;padding:16px;background:#1A202A;border-radius:8px;white-space:pre-wrap;">${veilig(afspraak.opmerking)}</p>`
           : ''
       }`,
    ),
    tekst: `Nieuwe afspraak\n\n${wanneer}\n${afspraak.dienstNaam}\n${naam}\n${afspraak.telefoon}\n${afspraak.email}\nKenmerk: ${afspraak.referentie}`,
  })

  const naarKlant = verstuur({
    aan: afspraak.email,
    onderwerp: `Je afspraak bij Oogcontact bij Gerard – ${wanneer}`,
    html: omhulsel(
      'Je afspraak staat genoteerd',
      `<h1 style="margin:0 0 20px;font:500 26px/1.2 Georgia,serif;color:${IVOOR};">Tot ziens, ${veilig(afspraak.voornaam)}</h1>
       <p style="margin:0 0 24px;">Je afspraak staat genoteerd. We hebben er zin in.</p>
       <table role="presentation" cellpadding="0" cellspacing="0" style="font:400 16px/1.7 -apple-system,Segoe UI,Roboto,sans-serif;margin-bottom:24px;">
         ${regel('Wanneer', wanneer)}
         ${regel('Waarvoor', afspraak.dienstNaam)}
         ${regel('Waar', adresOpEenRegel())}
       </table>
       <p style="margin:0 0 16px;">
         Parkeren kan direct voor de deur (betaald) en de bus stopt pal voor de winkel.
         De koffie staat klaar.
       </p>
       <p style="margin:0 0 24px;">
         Komt het toch niet uit? Laat het ons even weten via
         <a href="tel:${BEDRIJF.telefoon.link}" style="color:${MESSING};">${veilig(BEDRIJF.telefoon.weergave)}</a>
         of <a href="${whatsappLink()}" style="color:${MESSING};">WhatsApp</a>.
       </p>
       <p style="margin:0;font-style:italic;color:${MESSING};">${veilig(BEDRIJF.slogan)}</p>
       <p style="margin:8px 0 0;">Gerard en Gerda</p>`,
    ),
    tekst: [
      `Tot ziens, ${afspraak.voornaam}`,
      '',
      'Je afspraak staat genoteerd.',
      '',
      `Wanneer: ${wanneer}`,
      `Waarvoor: ${afspraak.dienstNaam}`,
      `Waar: ${adresOpEenRegel()}`,
      '',
      `Komt het toch niet uit? Bel ${BEDRIJF.telefoon.weergave} of app ons.`,
      '',
      BEDRIJF.slogan,
      'Gerard en Gerda',
    ].join('\n'),
  })

  const [winkelOk] = await Promise.all([naarWinkel, naarKlant])
  return winkelOk
}

/** "2026-09-16" wordt "woensdag 16 september 2026". */
export function nederlandseDatum(iso: string): string {
  const [jaar, maand, dag] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam',
  }).format(new Date(Date.UTC(jaar ?? 1970, (maand ?? 1) - 1, dag ?? 1, 12)))
}
