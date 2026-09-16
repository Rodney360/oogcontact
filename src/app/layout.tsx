import type { Metadata, Viewport } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import '@/styles/globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SnelleContact } from '@/components/SnelleContact'
import { SoepelScrollen } from '@/components/Beweging'
import { BEDRIJF } from '@/content/bedrijf'
import { SITE_URL, bedrijfJsonLd, JsonLd } from '@/lib/seo'

/**
 * De lettertypen worden bij het bouwen opgehaald en daarna vanaf onze eigen
 * server geleverd. De browser van de bezoeker legt dus geen verbinding met
 * Google - dat scheelt een verzoek en is beter voor de privacy.
 */
// Allebei variabele lettertypen: een bestand dat elke dikte aankan. Dat is
// lichter dan losse bestanden per dikte en laat de koppen soepel meeschalen.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
})

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BEDRIJF.naam} · opticien in Groningen`,
    template: `%s · ${BEDRIJF.naam}`,
  },
  description:
    'Zelfstandige opticien aan het Overwinningsplein in Groningen. Wij nemen de tijd voor je, ' +
    'met een kop koffie erbij. Oogmeting, montuuradvies, brillen, contactlenzen en loepbrillen.',
  applicationName: BEDRIJF.naam,
  authors: BEDRIJF.eigenaren.map((naam) => ({ name: naam })),
  creator: BEDRIJF.naam,
  publisher: BEDRIJF.naam,
  formatDetection: { telephone: true, address: true, email: true },
  manifest: '/manifest.webmanifest',
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
}

export const viewport: Viewport = {
  themeColor: '#11151C',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  // Bewust geen maximum: inzoomen moet altijd kunnen (WCAG 1.4.4).
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <a
          href="#hoofd"
          className={[
            'sr-only absolute left-4 top-4 z-[100] rounded-zacht bg-messing px-5 py-3',
            'text-basis font-medium text-inkt no-underline',
            'focus:not-sr-only focus:fixed',
          ].join(' ')}
        >
          Direct naar de inhoud
        </a>

        <SoepelScrollen />
        <Header />

        <main id="hoofd">{children}</main>

        <Footer />
        <SnelleContact />

        <JsonLd data={bedrijfJsonLd()} />
        <Analytics />
      </body>
    </html>
  )
}
