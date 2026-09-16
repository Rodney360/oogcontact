/**
 * Titels, omschrijvingen en gestructureerde data voor zoekmachines.
 *
 * Elke pagina heeft een eigen titel en omschrijving. De gestructureerde data
 * (JSON-LD) vertelt Google en AI-zoekmachines wat voor zaak dit is, waar hij
 * staat en wanneer hij open is.
 */

import type { Metadata } from 'next'

import { BEDRIJF, adresOpEenRegel } from '../content/bedrijf.ts'
import { alsSchemaOrg } from './openingstijden.ts'

/**
 * Het adres waarop de site draait.
 *
 * Op een preview van Vercel is dat een tijdelijk adres. Zolang het echte
 * domein nog naar de oude WordPress-site wijst, moeten de deelplaatjes en de
 * canonieke links naar die preview verwijzen: anders halen WhatsApp en Google
 * daar een plaatje op dat nog van de oude site is.
 *
 * Zodra het domein verhuisd is, zet je NEXT_PUBLIC_SITE_URL in Vercel op
 * https://oogcontactbijgerard.nl en klopt alles weer vanzelf.
 */
function bepaalSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL

  // Vercel vult deze zelf in, per deploy.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`

  return 'https://oogcontactbijgerard.nl'
}

export const SITE_URL = bepaalSiteUrl()

/** Bouwt de metagegevens van een pagina. */
export function paginaMeta({
  titel,
  omschrijving,
  pad,
  afbeelding,
}: {
  titel: string
  omschrijving: string
  pad: string
  afbeelding?: string
}): Metadata {
  const url = new URL(pad, SITE_URL).toString()
  const og = afbeelding ?? `${SITE_URL}/og${pad === '/' ? '' : pad.replace(/\/$/, '')}/opengraph-image`

  return {
    title: titel,
    description: omschrijving,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'nl_NL',
      siteName: BEDRIJF.naam,
      title: titel,
      description: omschrijving,
      url,
      images: [{ url: og, width: 1200, height: 630, alt: titel }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titel,
      description: omschrijving,
      images: [og],
    },
  }
}

/** De zaak zelf, als gestructureerde data. Staat op elke pagina. */
export function bedrijfJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Optician',
    '@id': `${SITE_URL}/#winkel`,
    name: BEDRIJF.naam,
    description:
      'Zelfstandige opticien in Groningen. Oogmeting, montuuradvies, brillen, ' +
      'contactlenzen, zonnebrillen, kinderbrillen en loepbrillen.',
    url: SITE_URL,
    telephone: `+${BEDRIJF.whatsapp.nummer.slice(0, 2)}${BEDRIJF.telefoon.link.slice(3)}`,
    email: BEDRIJF.email,
    image: `${SITE_URL}/beeld/winkel-tafel-1440.webp`,
    logo: `${SITE_URL}/logo/oogcontact-bij-gerard-licht.svg`,
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: BEDRIJF.adres.straat,
      postalCode: BEDRIJF.adres.postcode,
      addressLocality: BEDRIJF.adres.plaats,
      addressCountry: BEDRIJF.adres.land,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BEDRIJF.geo.breedtegraad,
      longitude: BEDRIJF.geo.lengtegraad,
    },
    openingHoursSpecification: alsSchemaOrg(),
    sameAs: Object.values(BEDRIJF.socials),
    founder: BEDRIJF.eigenaren.map((naam) => ({ '@type': 'Person', name: naam })),
    foundingDate: BEDRIJF.geopendSinds,
    areaServed: { '@type': 'City', name: 'Groningen' },
    hasCredential: BEDRIJF.keurmerken.map((k) => ({
      '@type': 'EducationalOccupationalCredential',
      name: k.naam,
      description: k.omschrijving,
    })),
  }
}

/** Het kruimelpad, zodat Google de structuur van de site begrijpt. */
export function kruimelsJsonLd(kruimels: { naam: string; pad: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: kruimels.map((k, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: k.naam,
      item: new URL(k.pad, SITE_URL).toString(),
    })),
  }
}

/** Veelgestelde vragen, zodat ze als vraag en antwoord in Google kunnen komen. */
export function vragenJsonLd(vragen: { vraag: string; antwoord: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: vragen.map((v) => ({
      '@type': 'Question',
      name: v.vraag,
      acceptedAnswer: { '@type': 'Answer', text: v.antwoord },
    })),
  }
}

/** Een nieuwsbericht, als gestructureerde data. */
export function berichtJsonLd(bericht: {
  titel: string
  samenvatting: string
  datum: string
  pad: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: bericht.titel,
    description: bericht.samenvatting,
    datePublished: bericht.datum,
    dateModified: bericht.datum,
    mainEntityOfPage: new URL(bericht.pad, SITE_URL).toString(),
    author: { '@type': 'Organization', name: BEDRIJF.naam, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: BEDRIJF.naam,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo/oogcontact-bij-gerard-licht.svg` },
    },
  }
}

/** Een blok gestructureerde data, klaar om in de pagina te zetten. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Het gaat om onze eigen, vaste gegevens - geen invoer van bezoekers.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}

/** Het adres op een regel - ook gebruikt in e-mails en de voettekst. */
export { adresOpEenRegel }
