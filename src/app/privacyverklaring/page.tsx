import type { Metadata } from 'next'
import Link from 'next/link'

import { Sectie, SectieKop, Leeskolom } from '@/components/Sectie'
import { Kruimelpad } from '@/components/InhoudsPagina'
import { BEDRIJF, adresOpEenRegel } from '@/content/bedrijf'
import { paginaMeta, JsonLd, kruimelsJsonLd } from '@/lib/seo'

export const metadata: Metadata = paginaMeta({
  titel: 'Privacyverklaring',
  omschrijving:
    'Wat we met je gegevens doen als je het formulier invult of online een afspraak maakt. ' +
    'Kort, concreet en zonder juridisch jargon.',
  pad: '/privacyverklaring/',
})

/**
 * De privacyverklaring.
 *
 * Bewust geschreven op basis van wat deze site écht doet — niet uit een
 * standaardmodel. Er staan dus geen bepalingen in over cookies die we niet
 * plaatsen of over diensten die we niet gebruiken.
 */
export default function Privacyverklaring() {
  return (
    <>
      <JsonLd
        data={kruimelsJsonLd([
          { naam: 'Home', pad: '/' },
          { naam: 'Privacyverklaring', pad: '/privacyverklaring/' },
        ])}
      />

      <Sectie className="pt-36 md:pt-44">
        <Kruimelpad
          kruimels={[
            { naam: 'Home', pad: '/' },
            { naam: 'Privacyverklaring', pad: '/privacyverklaring/' },
          ]}
        />
        <SectieKop
          niveau={1}
          kop="Privacyverklaring"
          inleiding={
            'Hieronder lees je welke gegevens we van je bewaren, waarom we dat doen en hoe lang. ' +
            'We houden het kort en concreet: er staat alleen in wat deze website echt doet.'
          }
          className="mt-6"
        />
      </Sectie>

      <Sectie licht compact>
        <Leeskolom className="[&_h2]:mt-14 [&_h2]:text-kop-3 [&_h3]:mt-8 [&_h3]:text-kop-4 [&_li]:text-tekst-zacht [&_p]:mt-5 [&_p]:text-basis [&_p]:text-tekst-zacht [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
          <p className="text-bijschrift text-tekst-zacht">Laatst bijgewerkt: 16 september 2026.</p>

          <h2 className="!mt-8">Wie zijn wij</h2>
          <p>
            {BEDRIJF.naam}, {adresOpEenRegel()}
            {BEDRIJF.kvkNummer ? `, KvK ${BEDRIJF.kvkNummer}` : ''}. Je kunt ons bereiken via{' '}
            <a href={`mailto:${BEDRIJF.email}`} className="text-messing-diep underline underline-offset-4">
              {BEDRIJF.email}
            </a>{' '}
            of{' '}
            <a href={`tel:${BEDRIJF.telefoon.link}`} className="text-messing-diep underline underline-offset-4">
              {BEDRIJF.telefoon.weergave}
            </a>
            . Wij zijn verantwoordelijk voor de gegevens die via deze website binnenkomen.
          </p>

          <h2>Welke gegevens we krijgen, en waarom</h2>

          <h3>Als je het contactformulier invult</h3>
          <p>
            Dan krijgen we je voornaam, achternaam, telefoonnummer en e-mailadres, plus wat je
            hebt aangegeven: of je een afspraak wilt of informatie, je voorkeursdag en dagdeel,
            waar het over gaat, en je eventuele vraag of opmerking.
          </p>
          <p>
            We gebruiken die gegevens om contact met je op te nemen en je vraag te beantwoorden.
            Iets anders doen we er niet mee. We zetten je niet op een mailinglijst, we verkopen
            niets door en we bewaren het niet om er later reclame mee te sturen.
          </p>

          <h3>Als je online een afspraak maakt</h3>
          <p>
            De agenda op de pagina Afspraak maken is die van OO2, en die draait binnen onze
            pagina. Wat je daar invult - je naam, je e-mailadres, je telefoonnummer, de afspraak
            die je kiest en het moment - gaat rechtstreeks naar OO2 en komt in onze agenda te
            staan. Wij zien die afspraak, want het is onze agenda; de website zelf slaat er niets
            van op.
          </p>

          <h3>Als je gewoon wat rondkijkt</h3>
          <p>
            Dan gebeurt er bijna niets. We gebruiken Vercel Web Analytics om te zien welke
            pagina&apos;s bezocht worden. Daarbij worden <strong>geen cookies geplaatst</strong> en
            wordt <strong>geen profiel van je opgebouwd</strong>. We zien alleen aantallen: hoeveel
            mensen een pagina bekeken, vanaf wat voor apparaat, en uit welk land. Niet wie je bent.
          </p>
          <p>
            Daarom zie je op deze site ook geen cookiebanner. Die is namelijk niet nodig als er
            niets te vragen valt. Meer daarover lees je in de{' '}
            <Link href="/cookieverklaring/" className="text-messing-diep underline underline-offset-4">
              cookieverklaring
            </Link>
            .
          </p>

          <h2>Op welke grond we dit mogen</h2>
          <ul>
            <li>
              <strong>Je toestemming.</strong> Je vult het formulier zelf in en vinkt zelf aan dat
              je akkoord gaat. Je mag die toestemming altijd weer intrekken.
            </li>
            <li>
              <strong>De afspraak zelf.</strong> Om een afspraak te kunnen maken en nakomen hebben
              we je naam en contactgegevens nodig. Zonder die gegevens gaat het eenvoudigweg niet.
            </li>
            <li>
              <strong>Ons gerechtvaardigd belang.</strong> Voor de spambeveiliging en om de site
              werkend te houden.
            </li>
          </ul>

          <h2>Hoe lang we het bewaren</h2>
          <ul>
            <li>
              <strong>Een vraag via het formulier:</strong> tot je vraag beantwoord is, en daarna
              maximaal twaalf maanden in onze mailbox.
            </li>
            <li>
              <strong>Een afspraak:</strong> in onze agenda, zolang dat nodig is voor ons dossier
              en onze administratie.
            </li>
            <li>
              <strong>De bezoekcijfers:</strong> die zijn niet naar jou te herleiden en worden als
              totalen bewaard.
            </li>
          </ul>
          <p>
            Ben je klant bij ons, dan hoort bij je oogmeting een dossier. Daar geldt de wettelijke
            bewaartermijn voor. Dat staat los van deze website.
          </p>

          <h2>Wie het verder kan zien</h2>
          <p>
            We geven je gegevens niet door aan anderen, behalve aan de bedrijven die nodig zijn om
            de site te laten werken:
          </p>
          <ul>
            <li>
              <strong>Vercel</strong> — host de website en levert de bezoekcijfers.
            </li>
            <li>
              <strong>Resend</strong> — verstuurt de e-mails van het formulier en de bevestigingen.
            </li>
            <li>
              <strong>OO2</strong> — onze online agenda (Easy!Appointments), waar de afspraak in
              komt te staan.
            </li>
            <li>
              <strong>Cloudflare</strong> — controleert onzichtbaar of er een mens achter het
              formulier zit en geen robot.
            </li>
          </ul>
          <p>
            Deze partijen mogen je gegevens alleen gebruiken om die taak uit te voeren, en voor
            niets anders.
          </p>

          <h2>Wat jij kunt vragen</h2>
          <p>Je mag ons altijd vragen om:</p>
          <ul>
            <li>te vertellen welke gegevens we van je hebben;</li>
            <li>iets te verbeteren dat niet klopt;</li>
            <li>je gegevens te verwijderen;</li>
            <li>je gegevens aan jou of aan iemand anders door te geven;</li>
            <li>te stoppen met het gebruiken ervan.</li>
          </ul>
          <p>
            Stuur een mailtje naar{' '}
            <a href={`mailto:${BEDRIJF.email}`} className="text-messing-diep underline underline-offset-4">
              {BEDRIJF.email}
            </a>{' '}
            of bel ons. We reageren binnen vier weken. Vind je dat we je niet goed helpen, dan mag
            je een klacht indienen bij de{' '}
            <a
              href="https://autoriteitpersoonsgegevens.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="text-messing-diep underline underline-offset-4"
            >
              Autoriteit Persoonsgegevens
            </a>
            .
          </p>

          <h2>Beveiliging</h2>
          <p>
            De site draait volledig over een beveiligde verbinding (https). De sleutels waarmee de
            site met de agenda en de e-maildienst praat, staan op de server en komen nooit in je
            browser terecht. Alles wat je invult wordt ook op de server nog een keer gecontroleerd.
          </p>

          <h2>Als deze verklaring verandert</h2>
          <p>
            Verandert er iets aan wat we met je gegevens doen, dan passen we deze pagina aan en
            zetten we er een nieuwe datum boven.
          </p>
        </Leeskolom>
      </Sectie>
    </>
  )
}
