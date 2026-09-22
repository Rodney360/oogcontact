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

export function OnlineAgenda() {
  return (
    <div>
      <div className="overflow-hidden rounded-groot border border-inkt-rand bg-white">
        <iframe
          src={BEDRIJF.onlineAgenda}
          title="Online agenda van Oogcontact bij Gerard"
          // De hoogte kunnen wij niet meebewegen met de inhoud: het vlak komt
          // van een ander adres en zegt niet hoe groot het is. Daarom een
          // ruime vaste hoogte, met een eigen schuifbalk als het niet past.
          className="block h-[44rem] w-full border-0 md:h-[48rem]"
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
