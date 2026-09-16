import type { Metadata } from 'next'
import Link from 'next/link'

import { Sectie, SectieKop, Oproep } from '@/components/Sectie'
import { Kruimelpad } from '@/components/InhoudsPagina'
import { Verschijnt } from '@/components/Beweging'
import { berichten } from '@/lib/beheer'
import { paginaMeta, JsonLd, kruimelsJsonLd } from '@/lib/seo'

export const metadata: Metadata = paginaMeta({
  titel: 'Nieuws',
  omschrijving:
    'Het laatste nieuws van Oogcontact bij Gerard: nieuwe collecties, afwijkende ' +
    'openingstijden en wat er verder speelt in de winkel.',
  pad: '/nieuws/',
})

const KRUIMELS = [
  { naam: 'Home', pad: '/' },
  { naam: 'Nieuws', pad: '/nieuws/' },
]

/** "2026-09-16" wordt "16 september 2026". */
function nederlandseDatum(iso: string): string {
  if (!iso) return ''
  const [jaar, maand, dag] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam',
  }).format(new Date(Date.UTC(jaar ?? 1970, (maand ?? 1) - 1, dag ?? 1, 12)))
}

export default async function NieuwsOverzicht() {
  const alles = await berichten()

  return (
    <>
      <JsonLd data={kruimelsJsonLd(KRUIMELS)} />

      <Sectie className="pt-36 md:pt-44">
        <Kruimelpad kruimels={KRUIMELS} />
        <SectieKop
          niveau={1}
          bovenkop="Nieuws"
          kop="Wat er speelt in de winkel"
          inleiding="Nieuwe monturen, afwijkende openingstijden en waar we mee bezig zijn."
          className="mt-6"
        />
      </Sectie>

      <Sectie licht compact>
        {alles.length === 0 ? (
          <p className="leesbreedte text-lead text-tekst-zacht">
            Er staat op dit moment geen nieuws. Kom gerust langs in de winkel, of kijk op{' '}
            <a
              href="https://www.instagram.com/oogcontactbijgerard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-messing-diep underline underline-offset-4"
            >
              Instagram
            </a>{' '}
            — daar laten we het vaakst zien wat er binnenkomt.
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {alles.map((bericht, i) => (
              <Verschijnt key={bericht.slug} als="li" vertraging={i * 0.06}>
                <article className="h-full rounded-groot border border-ivoor-rand bg-ivoor-zacht p-7 transition-colors hover:border-messing-diep">
                  <p className="text-bijschrift uppercase tracking-[0.14em] text-messing-diep">
                    <time dateTime={bericht.datum}>{nederlandseDatum(bericht.datum)}</time>
                  </p>
                  <h2 className="mt-4 text-kop-3">
                    <Link
                      href={`/nieuws/${bericht.slug}/`}
                      className="text-tekst no-underline transition-colors hover:text-messing-diep"
                    >
                      {bericht.titel}
                    </Link>
                  </h2>
                  <p className="mt-4 text-basis text-tekst-zacht">{bericht.samenvatting}</p>
                  <p className="mt-6">
                    <Link
                      href={`/nieuws/${bericht.slug}/`}
                      className="inline-flex items-center gap-2 text-bijschrift text-messing-diep no-underline"
                    >
                      Lees verder
                      <span className="alleen-voor-schermlezers">over {bericht.titel}</span>
                      <svg viewBox="0 0 20 20" className="w-4" aria-hidden="true">
                        <path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </p>
                </article>
              </Verschijnt>
            ))}
          </ul>
        )}
      </Sectie>

      <Oproep
        kop="Even langskomen?"
        tekst="Je bent van harte welkom in de winkel. Maak je een afspraak, dan hebben we echt de tijd voor je."
        knop="Afspraak maken"
      />
    </>
  )
}
