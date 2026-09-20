/**
 * Welke foto staat waar op de site.
 *
 * Dit is de enige plek waar dat staat. Wil je ergens een andere foto?
 * Verander dan hieronder de regel `bron` van die plek en draai `npm run images`.
 * Verder hoef je niets aan te passen.
 *
 * bron      pad binnen assets-original/ of assets-new/
 * verhouding  breedte:hoogte waarop wordt bijgesneden (null = laten zoals hij is)
 * zwaartepunt waar de aandacht ligt bij het bijsnijden ('attention' laat sharp
 *             zelf het interessantste deel kiezen; of 'north', 'centre', ...)
 * alt       de beschrijving voor wie de foto niet ziet. Beschrijf wat er echt
 *           op staat - geen bestandsnaam, geen merknaam als die er niet op staat.
 * breedtes  welke breedtes er gemaakt worden (de grootste is de bovengrens)
 */

/** @typedef {{bron: string, verhouding: [number, number]|null, zwaartepunt?: string, alt: string, breedtes: number[], stijl?: 'warm'|'neutraal'|'zwartwit'}} Beeld */

const PORTRET = /** @type {[number, number]} */ ([3, 4])
const STAAND = /** @type {[number, number]} */ ([4, 5])
const LIGGEND = /** @type {[number, number]} */ ([3, 2])
const BREED = /** @type {[number, number]} */ ([16, 9])
const VIERKANT = /** @type {[number, number]} */ ([1, 1])

const GROOT = [640, 1024, 1440, 1920]
const MIDDEN = [400, 640, 900, 1280]
const KLEIN = [300, 480, 720]

/** @type {Record<string, Beeld>} */
export const BEELDEN = {
  // --- Home: hero ------------------------------------------------------
  'hero-portret': {
    bron: '2025-01/cropped-James-Dean.png',
    verhouding: BREED,
    zwaartepunt: 'attention',
    alt: 'Close-up in zwart-wit van een jonge man met een ronde bril met schildpadmontuur.',
    breedtes: GROOT,
    stijl: 'neutraal',
  },

  // --- Home: het verhaal van Gerard en Gerda ---------------------------
  'gerard-en-gerda': {
    bron: '2023-02/Oogcontact__Natasja_Nienhuis_Fotografie-1017-scaled.jpg',
    verhouding: LIGGEND,
    zwaartepunt: 'attention',
    alt: 'Gerard en Gerda samen in de winkel, lachend naar elkaar.',
    breedtes: MIDDEN,
    stijl: 'warm',
  },
  // De twee portretten: eigen foto's uit de winkel, staand aangeleverd (9:16).
  // Ze worden bijgesneden op 3:4 en in zwart-wit gezet, net als hiervoor, zodat
  // ze naast elkaar één geheel blijven.
  'gerard-portret': {
    bron: 'Geer close-up 2.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Portret in zwart-wit van Gerard met bril, voor de monturenwand in de winkel.',
    breedtes: MIDDEN,
    stijl: 'zwartwit',
  },
  'gerda-portret': {
    bron: 'Ger close up refr.ruimte.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Portret in zwart-wit van Gerda met bril, lachend in de meetruimte.',
    breedtes: MIDDEN,
    stijl: 'zwartwit',
  },

  // --- Home: de vier pijlers -------------------------------------------
  'pijler-aandacht': {
    bron: '2022-01/IMG_1906-scaled.jpg',
    verhouding: VIERKANT,
    zwaartepunt: 'attention',
    alt: 'De grote eiken tafel in de winkel, met stoelen eromheen en bloemen erop.',
    breedtes: KLEIN,
    stijl: 'warm',
  },
  'pijler-apparatuur': {
    bron: '2021-12/Soof-Geer-apparatuur-scaled.jpg',
    verhouding: VIERKANT,
    zwaartepunt: 'attention',
    alt: 'Gerard kijkt door een meetapparaat terwijl hij iemands ogen onderzoekt.',
    breedtes: KLEIN,
    stijl: 'warm',
  },
  'pijler-ervaring': {
    bron: '2023-02/leeskaart-2.jpg',
    verhouding: VIERKANT,
    zwaartepunt: 'attention',
    alt: 'Een bril met oranje montuur op een leeskaart met letters in aflopende grootte.',
    breedtes: [300, 480, 612],
    stijl: 'neutraal',
  },
  'pijler-locatie': {
    bron: '2021-10/IMG_1073-scaled.jpg',
    verhouding: VIERKANT,
    zwaartepunt: 'attention',
    alt: 'De verlichte etalage van de winkel in de avond, met het logo op het glas.',
    breedtes: KLEIN,
    stijl: 'neutraal',
  },

  // --- Home: de scene over nauwkeurig meten -----------------------------
  // Nieuwe foto van Gerard achter de spleetlamp (3213 x 5712), ruim genoeg
  // voor elke maat hier. Het origineel is een staande telefoonfoto, dus er
  // gaat flink wat van boven en onder af; 4:5 is precies de verhouding
  // waarin hij op de pagina staat, zodat hij daarna niet nog eens
  // bijgesneden wordt. 'attention' laat sharp zelf het gezicht en het
  // apparaat vasthouden.
  'meting-scene': {
    bron: 'Geer spleetlamp.jpg',
    verhouding: STAAND,
    zwaartepunt: 'attention',
    alt: 'Gerard kijkt door de spleetlamp in de meetruimte, met de Vision-R 800 boven hem.',
    breedtes: MIDDEN,
    stijl: 'neutraal',
  },
  'meting-apparaat': {
    bron: '2022-02/Vision-R-800-Left-PNG-768x540-1.png',
    verhouding: LIGGEND,
    zwaartepunt: 'centre',
    alt: 'De Vision-R 800, het apparaat waarmee de oogmeting wordt gedaan.',
    breedtes: [400, 768],
    stijl: 'neutraal',
  },

  // --- De collectie ------------------------------------------------------
  'collectie-1': {
    bron: '2023-02/Oogcontact__Natasja_Nienhuis_Fotografie-1030-scaled.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Monturen op houten standaards in de winkel, met een campagnebeeld op de achtergrond.',
    breedtes: MIDDEN,
    stijl: 'warm',
  },
  'collectie-2': {
    bron: '2021-10/IMG_1011-scaled.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Brillen naast elkaar op een verlichte wandplank in de winkel.',
    breedtes: MIDDEN,
    stijl: 'warm',
  },
  'collectie-3': {
    bron: '2021-06/IMG_0038-scaled.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Een wand vol zonnebrillen op smalle planken in de winkel.',
    breedtes: MIDDEN,
    stijl: 'warm',
  },
  'collectie-4': {
    bron: '2021-06/IMG_0051-scaled.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Monturen uitgestald op de planken langs de wand van de winkel.',
    breedtes: MIDDEN,
    stijl: 'warm',
  },
  'collectie-5': {
    bron: '2021-07/IMG_0267-scaled.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Een uitstalling met monturen en een campagnebeeld in de winkel.',
    breedtes: MIDDEN,
    stijl: 'warm',
  },
  'collectie-6': {
    bron: '2021-07/IMG_0271-scaled.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Brillen op een plank, met warm licht erboven.',
    breedtes: MIDDEN,
    stijl: 'warm',
  },

  // --- Aanbod: de vijf categorieen --------------------------------------
  'aanbod-brillen': {
    bron: '2023-03/OogcontactbijGerard-Brillen.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Gerard en Gerda houden lachend twee brillen voor hun ogen.',
    breedtes: [320, 480, 667],
    stijl: 'warm',
  },
  'aanbod-contactlenzen': {
    bron: '2023-03/OogcontactbijGerard-Contactlenzen.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Een zachte contactlens op een vingertop.',
    breedtes: [320, 480, 667],
    stijl: 'neutraal',
  },
  'aanbod-zonnebrillen': {
    bron: '2023-03/OogcontactbijGerard-Zonnebrillen-e1680783150422.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Gerard en Gerda met zonnebrillen op, allebei met een arm omhoog.',
    breedtes: [320, 480, 667],
    stijl: 'warm',
  },
  'aanbod-kinderbrillen': {
    bron: '2023-03/OogcontactbijGerard-Kinderbrillen.jpg',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Een meisje met een bril met rond montuur kijkt in de camera.',
    breedtes: [320, 480, 667],
    stijl: 'warm',
  },
  // Het origineel is liggend (1166 x 763). In het staande vak van 3:4 past er
  // dus maar 572 pixels breed uit zonder op te blazen; vandaar deze breedtes.
  'aanbod-loepbrillen': {
    bron: 'loepbril-verlichting.webp',
    verhouding: PORTRET,
    zwaartepunt: 'attention',
    alt: 'Close-up van een loepbril: twee loepjes in de glazen en een lampje op het montuur.',
    breedtes: [400, 572],
    stijl: 'neutraal',
  },

  // --- De winkel ---------------------------------------------------------
  // De vorige foto hier (2021-06/winkel-bewerkt-website-3.png) had een sterke
  // gele zweem van het winkellicht; met de warme kleurcorrectie erbovenop werd
  // dat te veel. Deze is nieuw, neutraal belicht en 5712 pixels breed.
  'winkel-tafel': {
    bron: 'Winkel alles.jpg',
    verhouding: BREED,
    zwaartepunt: 'centre',
    alt: 'De winkel van binnen: visgraatvloer, een lange eiken tafel met stoelen, en wanden vol monturen.',
    breedtes: GROOT,
    stijl: 'neutraal',
  },
  'winkel-gevel': {
    bron: '2021-10/IMG_1074-scaled.jpg',
    verhouding: LIGGEND,
    zwaartepunt: 'attention',
    alt: 'De winkel van buiten in de avond, met het verlichte logo Oogcontact by Gerard op de ruit.',
    breedtes: MIDDEN,
    stijl: 'neutraal',
  },
  'winkel-deur': {
    bron: '2021-06/Winkel-GerGeer-2.jpg',
    verhouding: LIGGEND,
    zwaartepunt: 'attention',
    alt: 'Gerard en Gerda in de deuropening van de winkel aan het Overwinningsplein.',
    breedtes: MIDDEN,
    stijl: 'warm',
  },
}

/** Het beeld dat gedeeld wordt als iemand een link doorstuurt. */
export const DEEL_BEELD = 'winkel-tafel'
