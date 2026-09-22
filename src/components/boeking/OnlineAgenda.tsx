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

import { KnopLink } from '@/components/Knop'
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

/*
  Hier lag een kleurcorrectie over het agendavlak, om de lichtgrijze teksten van
  OO2 donkerder te maken. Die is er weer uit.

  Reden: op een telefoon bleef het vak leeg, terwijl het op een laptop gewoon
  werkte. Zo'n filter (`filter: url(#...)` op een iframe) is precies het soort
  ding waar Safari over struikelt, en een agenda die het op een telefoon niet
  doet is veel erger dan tekst die aan de lichte kant is. De helft van de
  bezoekers zit op een telefoon.

  Om dezelfde reden staat de afronding niet meer op de omhullende div met
  `overflow-hidden`, maar rechtstreeks op het vlak zelf. Ook dat is een bekende
  plek waar WebKit een ingesloten vlak kan laten verdwijnen.

  De leesbaarheid blijft dus een punt, maar dat hoort bij de bron. Wat je OO2
  daarover kunt vragen staat in docs/agenda-koppelen.md.
*/

export function OnlineAgenda() {
  return (
    <div>
      <iframe
        src={AGENDA_ADRES}
        title="Online agenda van Oogcontact bij Gerard"
        // De hoogte kunnen wij niet meebewegen met de inhoud: het vlak komt van
        // een ander adres en zegt niet hoe groot het is. Daarom een ruime vaste
        // hoogte, met een eigen schuifbalk als het niet past.
        className="block h-[44rem] w-full rounded-groot border border-inkt-rand bg-white md:h-[48rem]"
      />

      {/*
        De uitweg. Bewust een echte knop en geen klein linkje: blijft het vak om
        wat voor reden dan ook leeg, dan moet je meteen zien waar je heen moet.
        Dat gebeurt eerder op een telefoon dan op een laptop.
      */}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <KnopLink
          href={BEDRIJF.onlineAgenda}
          uiterlijk="omlijnd"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open de agenda in een nieuw tabblad
        </KnopLink>
        <p className="text-bijschrift text-tekst-licht-zacht">
          Of bel ons even op{' '}
          <a
            href={`tel:${BEDRIJF.telefoon.link}`}
            className="text-messing underline underline-offset-4"
          >
            {BEDRIJF.telefoon.weergave}
          </a>
          , dan plannen we het samen.
        </p>
      </div>
    </div>
  )
}
