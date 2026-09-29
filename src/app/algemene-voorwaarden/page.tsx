import type { Metadata } from 'next'

import { Sectie, SectieKop, Leeskolom } from '@/components/Sectie'
import { Kruimelpad } from '@/components/InhoudsPagina'
import { KnopLink } from '@/components/Knop'
import { BEDRIJF } from '@/content/bedrijf'
import { paginaMeta, JsonLd, kruimelsJsonLd } from '@/lib/seo'

export const metadata: Metadata = paginaMeta({
  titel: 'Algemene voorwaarden',
  omschrijving:
    'Wij werken met de algemene voorwaarden voor optiekbedrijven van brancheorganisatie NUVO. ' +
    'Hier kun je ze nalezen.',
  pad: '/algemene-voorwaarden/',
})

/**
 * De algemene voorwaarden.
 *
 * De oude site verwees naar een pdf van de brancheorganisatie. Die pdf is
 * bewaard en staat hier ook. De voorwaarden zelf schrijven we niet over: dat
 * is niet aan ons, en een eigen samenvatting kan afwijken van het origineel.
 */
export default function AlgemeneVoorwaarden() {
  return (
    <>
      <JsonLd
        data={kruimelsJsonLd([
          { naam: 'Home', pad: '/' },
          { naam: 'Algemene voorwaarden', pad: '/algemene-voorwaarden/' },
        ])}
      />

      <Sectie className="pt-36 md:pt-44">
        <Kruimelpad
          kruimels={[
            { naam: 'Home', pad: '/' },
            { naam: 'Algemene voorwaarden', pad: '/algemene-voorwaarden/' },
          ]}
        />
        <SectieKop
          niveau={1}
          kop="Algemene voorwaarden"
          inleiding={
            'Wij werken met de algemene voorwaarden voor optiekbedrijven van NUVO, de ' +
            'brancheorganisatie waar we bij aangesloten zijn.'
          }
          className="mt-6"
        />
      </Sectie>

      <Sectie licht compact>
        <Leeskolom className="[&_p]:mt-5 [&_p]:text-basis [&_p]:text-tekst-zacht">
          <p className="!mt-0">
            Deze voorwaarden gaan over wat je van ons mag verwachten en wat wij van jou verwachten:
            over bestellen, betalen, levering, garantie en wat er gebeurt als je ergens niet
            tevreden over bent.
          </p>
          <p>
            We schrijven ze hier niet in eigen woorden na. De voorwaarden zijn opgesteld door de
            brancheorganisatie, en een samenvatting van ons zou daarvan kunnen afwijken. Je leest
            ze daarom rechtstreeks in het originele document.
          </p>

          <div className="mt-10">
            <KnopLink
              href="/documenten/algemene-voorwaarden-optiekbedrijven.pdf"
              uiterlijk="messing"
              formaat="groot"
            >
              Voorwaarden lezen (pdf)
            </KnopLink>
          </div>

          <p className="mt-12 border-t border-ivoor-rand pt-8">
            Iets niet duidelijk, of ergens niet tevreden over? Laat het ons vooral weten.{' '}
            <a href={`tel:${BEDRIJF.telefoon.link}`} className="text-messing-diep underline underline-offset-4">
              Bel ons
            </a>{' '}
            of mail naar{' '}
            <a href={`mailto:${BEDRIJF.email}`} className="text-messing-diep underline underline-offset-4">
              {BEDRIJF.email}
            </a>
            . In de winkel komen we er meestal samen prima uit.
          </p>
        </Leeskolom>
      </Sectie>
    </>
  )
}
