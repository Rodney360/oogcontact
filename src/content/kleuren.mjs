/**
 * De kleuren van Oogcontact bij Gerard.
 *
 * Dit bestand is de enige bron: src/styles/globals.css neemt deze waarden over
 * als Tailwind-tokens en scripts/check-contrast.mjs controleert ze op
 * leesbaarheid. Verander een kleur dus hier, niet ergens anders.
 *
 * Herkomst: het ivoor komt letterlijk uit het logo (#FBF2E6). Het inkt en het
 * messing zijn daarop gekozen: donker genoeg om het lichte logo te laten staan,
 * warm genoeg om bij de winkel te passen (eiken vloer, cognac leer, koffie).
 */

export const KLEUREN = {
  // Donkere vlakken - de basis van de site
  inkt: '#11151C',          // diepste achtergrond
  inkt_zacht: '#1A202A',    // kaarten en verhoogde vlakken op donker
  inkt_rand: '#2A3240',     // fijne scheidingslijnen op donker (decoratief)
  inkt_rand_sterk: '#69748A', // randen van invoervelden en knoppen op donker

  // Lichte vlakken - warm ivoor, rechtstreeks uit het logo
  ivoor: '#FBF2E6',         // lichte achtergrond en tekst op donker
  ivoor_zacht: '#F4E9D9',   // kaarten op ivoor
  ivoor_rand: '#E2D3BC',    // fijne scheidingslijnen op ivoor (decoratief)
  ivoor_rand_sterk: '#8C7F6B', // randen van invoervelden en knoppen op ivoor

  // Tekst
  tekst_op_ivoor: '#1B2028',        // lopende tekst op lichte vlakken
  tekst_op_ivoor_zacht: '#4A5361',  // bijschriften op lichte vlakken
  tekst_op_inkt: '#FBF2E6',         // lopende tekst op donkere vlakken
  tekst_op_inkt_zacht: '#B9AF9F',   // bijschriften op donkere vlakken

  // Het enige accent: messing. Warm, verfijnd, past bij het eiken en het leer.
  messing: '#C9A96A',               // accent op donkere vlakken
  messing_diep: '#7A5A22',          // accent op lichte vlakken (donkerder, voor contrast)
  messing_zacht: '#E7D3A8',         // subtiele vlakken en randen

  // Statuskleuren, bewust ingetogen gehouden
  open: '#6FBF8B',                  // "nu geopend" op donker
  open_diep: '#1F6B3C',             // "nu geopend" op ivoor
  fout: '#FF9B8A',                  // foutmelding op donker
  fout_diep: '#A32D18',             // foutmelding op ivoor
}

/**
 * Elke combinatie die de site echt gebruikt, met de eis die erbij hoort.
 * soort: 'tekst' (4.5:1) | 'grote_tekst' (3:1) | 'ui' (3:1)
 *
 * Puur decoratieve haarlijnen (inkt_rand, ivoor_rand) staan hier bewust niet
 * in: die dragen geen betekenis en vallen buiten WCAG 1.4.11. Zodra een lijn
 * wel iets betekent - de rand van een invoerveld bijvoorbeeld - gebruik je
 * inkt_rand_sterk of ivoor_rand_sterk, en die staan er wel in.
 */
export const CONTRAST_PAREN = [
  { voorgrond: 'tekst_op_ivoor', achtergrond: 'ivoor', soort: 'tekst', gebruik: 'lopende tekst op licht' },
  { voorgrond: 'tekst_op_ivoor', achtergrond: 'ivoor_zacht', soort: 'tekst', gebruik: 'lopende tekst op lichte kaart' },
  { voorgrond: 'tekst_op_ivoor_zacht', achtergrond: 'ivoor', soort: 'tekst', gebruik: 'bijschrift op licht' },
  { voorgrond: 'tekst_op_ivoor_zacht', achtergrond: 'ivoor_zacht', soort: 'tekst', gebruik: 'bijschrift op lichte kaart' },

  { voorgrond: 'tekst_op_inkt', achtergrond: 'inkt', soort: 'tekst', gebruik: 'lopende tekst op donker' },
  { voorgrond: 'tekst_op_inkt', achtergrond: 'inkt_zacht', soort: 'tekst', gebruik: 'lopende tekst op donkere kaart' },
  { voorgrond: 'tekst_op_inkt_zacht', achtergrond: 'inkt', soort: 'tekst', gebruik: 'bijschrift op donker' },
  { voorgrond: 'tekst_op_inkt_zacht', achtergrond: 'inkt_zacht', soort: 'tekst', gebruik: 'bijschrift op donkere kaart' },

  { voorgrond: 'messing', achtergrond: 'inkt', soort: 'tekst', gebruik: 'accenttekst en links op donker' },
  { voorgrond: 'messing', achtergrond: 'inkt_zacht', soort: 'tekst', gebruik: 'accenttekst op donkere kaart' },
  { voorgrond: 'messing_diep', achtergrond: 'ivoor', soort: 'tekst', gebruik: 'accenttekst en links op licht' },
  { voorgrond: 'messing_diep', achtergrond: 'ivoor_zacht', soort: 'tekst', gebruik: 'accenttekst op lichte kaart' },

  { voorgrond: 'inkt', achtergrond: 'messing', soort: 'tekst', gebruik: 'tekst op de messing knop' },
  { voorgrond: 'inkt', achtergrond: 'ivoor', soort: 'tekst', gebruik: 'tekst op de ivoren knop' },
  { voorgrond: 'ivoor', achtergrond: 'inkt', soort: 'tekst', gebruik: 'tekst op de donkere knop' },

  // Randen van invoervelden en knoppen zijn onderdeel van de bediening en
  // moeten daarom 3:1 halen (WCAG 2.2, 1.4.11 Contrast van niet-tekstuele onderdelen).
  { voorgrond: 'inkt_rand_sterk', achtergrond: 'inkt', soort: 'ui', gebruik: 'rand van invoerveld en knop op donker' },
  { voorgrond: 'ivoor_rand_sterk', achtergrond: 'ivoor', soort: 'ui', gebruik: 'rand van invoerveld en knop op licht' },
  { voorgrond: 'ivoor_rand_sterk', achtergrond: 'ivoor_zacht', soort: 'ui', gebruik: 'rand van invoerveld op lichte kaart' },
  { voorgrond: 'messing', achtergrond: 'inkt', soort: 'ui', gebruik: 'focusring op donker' },
  { voorgrond: 'messing_diep', achtergrond: 'ivoor', soort: 'ui', gebruik: 'focusring op licht' },

  { voorgrond: 'open', achtergrond: 'inkt', soort: 'tekst', gebruik: '"nu geopend" op donker' },
  { voorgrond: 'open_diep', achtergrond: 'ivoor', soort: 'tekst', gebruik: '"nu geopend" op licht' },
  { voorgrond: 'fout', achtergrond: 'inkt', soort: 'tekst', gebruik: 'foutmelding in formulier op donker' },
  { voorgrond: 'fout_diep', achtergrond: 'ivoor', soort: 'tekst', gebruik: 'foutmelding in formulier op licht' },
]
