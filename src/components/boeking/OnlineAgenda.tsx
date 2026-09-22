/**
 * De online agenda van OO2, ingesloten in onze eigen pagina.
 *
 * OO2 geeft geen API uit - niet in ons pakket en ook niet in een ander - dus
 * de site kan de vrije tijden niet zelf ophalen en er niets in wegschrijven.
 * Wat wel kan is dit: hun agenda draait binnen onze pagina. De bezoeker boekt
 * dus echt, in de echte agenda, en er kan niets dubbel geboekt worden.
 *
 * Dit is precies wat de oude WordPress-site ook deed; het staat nog in
 * content-archive/_raw/pages.json. Insluiten is dus toegestaan.
 *
 * Wat er binnen dat vlak staat, is van OO2. Onze lettertypen en kleuren gelden
 * daar niet. Daarom staat eromheen wel onze eigen tekst, en eronder de weg
 * terug naar een mens.
 *
 * Onze eigen boekingsmodule blijft in de repo staan
 * (src/components/boeking/Boeking.tsx). Komt er ooit toch een API, dan is het
 * een kwestie van hier weer de andere kant op wijzen.
 */

import { BEDRIJF } from '@/content/bedrijf'

/**
 * Een poging om de agenda in het Nederlands te krijgen.
 *
 * De agenda stond in het Engels. Easy!Appointments heeft een Nederlandse
 * vertaling ingebouwd en luistert in de meeste versies naar deze parameter in
 * het adres. Werkt het niet, dan verandert er niets - een onbekende parameter
 * wordt gewoon genegeerd - en moet de taal in OO2 zelf omgezet worden.
 */
const AGENDA_ADRES = `${BEDRIJF.onlineAgenda}?language=dutch`

/**
 * Hoe veel donkerder de tekst in de agenda gemaakt wordt.
 *
 * De datums en de teksten van OO2 zijn lichtgrijs op wit en daardoor slecht te
 * lezen. Binnen dat vlak kunnen we niets aanpassen - dat is een andere site -
 * maar we kunnen er wel van buitenaf een kleurcorrectie overheen leggen.
 *
 * Het is een gammacorrectie: wit blijft wit (1 tot de macht wat dan ook is 1),
 * maar alles wat er lichtgrijs tussen zit wordt flink donkerder. Lichtgrijs van
 * 80% wordt bij 1.6 zo'n 70%, middengrijs van 50% wordt 33%.
 *
 * Gewoon "meer contrast" werkt hier juist averechts: dat duwt lichte tekst nog
 * dichter naar het wit toe.
 *
 * Eén getal, dus makkelijk bij te stellen. Te hoog en de kleuren binnen de
 * agenda worden modderig; te laag en je ziet er niets van.
 */
const DONKERDER = 1.6

export function OnlineAgenda() {
  return (
    <div>
      {/*
        De kleurcorrectie zelf. Hij staat hier als een onzichtbaar SVG-tekentje
        omdat de gewone CSS-filters geen gammacorrectie kennen.
      */}
      <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute size-0">
        <filter id="agenda-leesbaarder" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="gamma" exponent={DONKERDER} />
            <feFuncG type="gamma" exponent={DONKERDER} />
            <feFuncB type="gamma" exponent={DONKERDER} />
          </feComponentTransfer>
        </filter>
      </svg>

      <div className="overflow-hidden rounded-groot border border-inkt-rand bg-white">
        <iframe
          src={AGENDA_ADRES}
          title="Online agenda van Oogcontact bij Gerard"
          // De hoogte kunnen wij niet meebewegen met de inhoud: het vlak komt
          // van een ander adres en zegt niet hoe groot het is. Daarom een
          // ruime vaste hoogte, met een eigen schuifbalk als het niet past.
          className="block h-[44rem] w-full border-0 md:h-[48rem]"
          style={{ filter: 'url(#agenda-leesbaarder)' }}
        />
      </div>

      <p className="mt-5 text-bijschrift text-tekst-licht-zacht">
        Lukt het hierboven niet?{' '}
        <a
          href={BEDRIJF.onlineAgenda}
          target="_blank"
          rel="noopener noreferrer"
          className="text-messing underline underline-offset-4"
        >
          Open de agenda in een nieuw tabblad
        </a>{' '}
        — of bel ons even op {BEDRIJF.telefoon.weergave}, dan plannen we het samen.
      </p>
    </div>
  )
}
