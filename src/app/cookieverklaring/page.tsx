import type { Metadata } from 'next'
import Link from 'next/link'

import { Sectie, SectieKop, Leeskolom } from '@/components/Sectie'
import { Kruimelpad } from '@/components/InhoudsPagina'
import { BEDRIJF } from '@/content/bedrijf'
import { paginaMeta, JsonLd, kruimelsJsonLd } from '@/lib/seo'

export const metadata: Metadata = paginaMeta({
  titel: 'Cookieverklaring',
  omschrijving:
    'Deze site plaatst geen trackingcookies en heeft daarom geen cookiebanner. ' +
    'Hier lees je precies wat er wel gebeurt.',
  pad: '/cookieverklaring/',
})

/** De cookieverklaring. Kort, want er valt weinig te melden. */
export default function Cookieverklaring() {
  return (
    <>
      <JsonLd
        data={kruimelsJsonLd([
          { naam: 'Home', pad: '/' },
          { naam: 'Cookieverklaring', pad: '/cookieverklaring/' },
        ])}
      />

      <Sectie className="pt-36 md:pt-44">
        <Kruimelpad
          kruimels={[
            { naam: 'Home', pad: '/' },
            { naam: 'Cookieverklaring', pad: '/cookieverklaring/' },
          ]}
        />
        <SectieKop
          niveau={1}
          kop="Cookieverklaring"
          inleiding="Deze website plaatst geen trackingcookies. Daarom zie je hier ook geen cookiebanner."
          className="mt-6"
        />
      </Sectie>

      <Sectie licht compact>
        <Leeskolom className="[&_h2]:mt-14 [&_h2]:text-kop-3 [&_li]:text-tekst-zacht [&_p]:mt-5 [&_p]:text-basis [&_p]:text-tekst-zacht [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
          <p className="text-bijschrift text-tekst-zacht">Laatst bijgewerkt: 16 september 2026.</p>

          <h2 className="!mt-8">Waarom er geen banner is</h2>
          <p>
            Zo&apos;n venstertje met &quot;accepteer alle cookies&quot; is verplicht zodra een site
            iets op je computer zet om je te volgen. Dat doen wij niet. Er valt dus niets te
            vragen, en daarom staat er ook niets in de weg als je de site opent.
          </p>
          <p>
            Dat is een bewuste keuze geweest bij het bouwen van deze site. Het scheelt jou een klik
            en het scheelt ons het gevoel dat we iets doen wat we zelf ook vervelend vinden.
          </p>

          <h2>Wat er wel gebeurt</h2>

          <h3 className="mt-8 text-kop-4">Bezoekcijfers zonder cookies</h3>
          <p>
            We gebruiken Vercel Web Analytics om te zien welke pagina&apos;s bekeken worden. Dat
            werkt zonder cookies en zonder een profiel van je op te bouwen. We zien aantallen —
            hoeveel mensen op een pagina kwamen, vanaf wat voor soort apparaat en uit welk land.
            We kunnen daarin niet zien wie je bent, en we kunnen je bezoek van vandaag niet
            koppelen aan dat van morgen.
          </p>

          <h3 className="mt-8 text-kop-4">Spambeveiliging bij het formulier</h3>
          <p>
            Vul je het contactformulier in of maak je online een afspraak, dan controleert
            Cloudflare Turnstile onzichtbaar of er een mens achter zit en geen robot. Daarvoor kan
            kort iets in je browser opgeslagen worden. Dat gebeurt alleen op de pagina&apos;s met
            een formulier, het is puur om spam tegen te houden, en er wordt niets mee gevolgd.
          </p>

          <h3 className="mt-8 text-kop-4">De video over de oogmeting</h3>
          <p>
            Op de pagina over nauwkeurig meten staat een video van YouTube. Die wordt pas geladen
            als je op afspelen klikt, en dan via youtube-nocookie.com. Zolang je niet klikt, legt
            je browser dus geen verbinding met YouTube en wordt er niets opgeslagen. Klik je wel,
            dan gelden vanaf dat moment de voorwaarden van YouTube.
          </p>

          <h3 className="mt-8 text-kop-4">De kaart</h3>
          <p>
            De plattegrond bij het adres is een tekening die we zelf gemaakt hebben — geen
            ingesloten Google Maps. Klik je op &quot;Route plannen&quot;, dan ga je naar de
            kaartenapp op je eigen apparaat. Vanaf dat moment gelden de voorwaarden daarvan.
          </p>

          <h2>Wat er niet gebeurt</h2>
          <ul>
            <li>Geen trackingcookies.</li>
            <li>Geen advertentienetwerken.</li>
            <li>Geen Google Analytics.</li>
            <li>Geen knoppen van Facebook of Instagram die meekijken.</li>
            <li>Geen lettertypen die bij Google opgehaald worden — die staan op onze eigen server.</li>
            <li>Geen profielen, geen doorverkoop, geen advertenties die je achterna reizen.</li>
          </ul>

          <h2>Vragen?</h2>
          <p>
            Lees ook de{' '}
            <Link href="/privacyverklaring/" className="text-messing-diep underline underline-offset-4">
              privacyverklaring
            </Link>
            , of stuur een mailtje naar{' '}
            <a href={`mailto:${BEDRIJF.email}`} className="text-messing-diep underline underline-offset-4">
              {BEDRIJF.email}
            </a>
            . We leggen het graag uit.
          </p>
        </Leeskolom>
      </Sectie>
    </>
  )
}
