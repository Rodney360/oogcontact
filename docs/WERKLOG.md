# Werklog

Na elke sessie twee tot vier regels: de datum, wie er gewerkt heeft, wat er
veranderd is en wat er nog openstaat. Zo weten Dennis en Gerard van elkaar wat
er gebeurd is, ook als er een tijd tussen zit.

Nieuwste bovenaan.

---

## 2026-09-16 — Dennis (Claude Code, cloud)

De hele site opnieuw opgebouwd, vanaf niets, als vervanging van WordPress.

- **Archief:** de complete oude site opgehaald en vastgelegd — 15 pagina's,
  5 nieuwsberichten en alle 256 originele foto's staan in de repo, zodat er
  niets verdwijnt als WordPress wordt opgezegd.
- **Basis:** Next.js 16 met TypeScript en Tailwind 4, een huisstijl waarvan het
  contrast automatisch op WCAG AA gecontroleerd wordt, het logo als SVG, en een
  beeldpipeline die van de originelen AVIF en WebP maakt.
- **Werking:** boekingsmodule op de pagina zelf, aanvraagformulier, e-mail via
  Resend en een beheerscherm (Keystatic) voor nieuws, vakantiemeldingen,
  afwijkende openingstijden en merken. Zonder API-sleutels draait alles in
  testmodus.
- **Teksten:** opnieuw geschreven op basis van het archief en daarna nagekeken
  op verzonnen feiten en op de aanspreekvorm. Dat leverde 37 correcties op,
  waaronder medische claims zonder grond, een verzonnen taakverdeling tussen
  Gerard en Gerda, en getallen uit 2021 die nu niet meer kloppen. Alles staat
  op een rij in `docs/teksten-review.md`.
- **Gemeten:** 107 browsertests op desktop en mobiel groen, 27 snelle tests
  groen, alle kleurcombinaties voldoen aan WCAG AA. Na compressie 158 tot
  197 kB JavaScript, LCP tussen 0,4 en 1,0 seconde, CLS 0,000.
- **Openstaand:** zie `docs/open-punten.md`. Het belangrijkste: de koppeling met
  Vercel, de API-sleutel van de online agenda, het KvK-nummer en de nieuwe
  winkelfoto's.

---

## 2026-09-16 (later) — Dennis (Claude Code, cloud)

- **Menubalk nagelopen.** Alle 17 links (6 in de balk, 5 in het uitklapmenu,
  op drie schermbreedtes plus mobiel) brengen je naar de juiste pagina. Wat er
  wél mis was: Escape sloot het uitklapmenu niet, en er zat een fout in de
  pagina die pas in de live-versie zichtbaar was (zie hieronder). Er staat nu
  een browsertest op de menubalk zelf: `tests/e2e/menu.spec.ts`.
- **Verborgen fout opgelost.** In de live-versie klapte React de hele pagina na
  het laden opnieuw op: een SVG-titel op de kaart en een verkeerd geschreven
  eigenschap op de foto's ('fetchpriority' in plaats van 'fetchPriority')
  zorgden ervoor dat de server en de browser niet precies hetzelfde maakten.
  Dat is niet altijd te zien, maar een klik die net op dat moment valt gaat
  verloren. Beide zijn gerepareerd; de browser meldt nu op geen enkele pagina
  nog iets.
- **Eerste scherm op mobiel rustiger.** De bovenregel herhaalde de kop
  ("Opticien in Groningen" boven "Je opticien in Groningen") en staat nu op het
  adres. De inleiding is van vier zinnen naar twee gegaan. "Afspraak maken" en
  "Bel of app ons" zijn op de telefoon weg uit de hero: die keuzes staan al in
  de balk onderin, die altijd in beeld blijft. Die balk heeft meer vorm
  gekregen: hij zweeft nu als een afgerond blok boven de pagina in plaats van
  een streep tegen de onderrand, en de voettekst verdwijnt er niet meer achter.
- **Nog open:** zie `docs/open-punten.md`. Ongewijzigd: de sleutel van de
  online agenda, Resend, Turnstile, het KvK-nummer en de nieuwe winkelfoto's.

---

## 2026-09-16 (avond) — Dennis (Claude Code, cloud)

- **Terugknop gerepareerd.** Het menu onthield op welke pagina het geopend was.
  Klikte je in het menu door en drukte je daarna op terug, dan kwam je op die
  pagina terug en stond het menu opeens weer open — met een scherm dat niet
  meer wilde scrollen. Het menu gaat nu bij elke paginawissel dicht. Twee
  browsertests erbij, voor mobiel en voor desktop.
- **Hero-foto meer in beeld op een staand scherm.** Een vullende foto sneed op
  een telefoon zo veel weg dat er alleen nog een oog overbleef. De foto staat
  daar nu in de bovenste 62% van het scherm en loopt onderaan zacht uit in de
  achtergrond. Je ziet er ongeveer anderhalf keer zo veel van. Het schakelt op
  de verhouding van het scherm, niet op de breedte, dus een tablet rechtop
  krijgt hetzelfde en diezelfde tablet gedraaid gewoon de vullende foto. Op
  desktop verandert er niets: daar was de foto al vrijwel helemaal te zien.
- **Nog open:** zie `docs/open-punten.md`. Het eerste punt is nu een
  `main`-branch, zodat er weer previews per wijziging komen.

---

## 2026-09-16 (laat) — Dennis (Claude Code, cloud)

- **Menu op mobiel was niet meer dicht te krijgen.** Het opengeklapte menu
  bedekt het hele scherm en lag daarmee ook over de sluitknop rechtsboven en
  over het logo heen. Je zag de knop wel, maar hij was niet aan te tikken; op
  een telefoon kwam je het menu dus alleen nog uit door ergens naartoe te gaan.
  De bovenste balk ligt nu boven het menu. Daarnaast gaat het menu ook dicht
  als je naast de onderdelen tikt.
- **De pagina scrolde achter het open menu door.** `overflow: hidden` was niet
  genoeg: het soepele scrollen (Lenis) verzet de pagina zelf. Dat wordt nu
  stilgezet zolang het menu open staat.
- **Staarten van letters in de kop werden afgesneden.** Elk woord van de kop
  zit in een vakje dat afsnijdt, zodat het woord van onderaf in beeld kan
  schuiven. Dat vakje was precies zo hoog als de regel, dus de g van
  "Groningen" en de p van "opticien" werden onderaan recht afgehakt. Het vakje
  is nu ruimer zonder extra plek in te nemen.
- Vier browsertests erbij; 120 groen.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-17 — Dennis (Claude Code, cloud)

- **Zwevende pijl terug naar de homepage.** Linksonder, tegenover de
  WhatsApp-knop rechtsonder. Op een telefoon een rond knopje boven de vaste
  balk, vanaf tablet met het woord "Home" erbij. Niet te zien op de homepage
  zelf. Het logo linksboven deed dit al en blijft dat doen; allebei staan nu
  in een browsertest.
- **Tekstgroottes schalen nu overal mee.** Alleen de koppen deden dat al; de
  lopende tekst stond op een vaste 18px en viel op een telefoon daardoor fors
  uit. Alles staat nu in `clamp()`: lopende tekst 17 -> 18px, inleidingen
  18 -> 20px, lead 20 -> 28px, koppen 22/28/36 -> 32/48/80px. De regelafstand
  is op een telefoon iets krapper. Ondergrens blijft 16px, zoals afgesproken.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-17 (later) — Dennis (Claude Code, cloud)

- **Logo op de homepage deed niets.** Stond je al op de homepage, dan viel er
  voor de browser niets te navigeren en bleef je staan waar je was — precies
  op het moment dat je het logo gebruikt, namelijk halverwege een lange
  pagina. Het logo brengt je daar nu rustig terug naar boven. Vanaf een andere
  pagina gaat het gewoon naar de homepage, bovenaan.
- **Het zwevende knopje linksonder doet nu mee.** Op de homepage wordt het een
  pijl omhoog ("Naar boven"), die pas verschijnt zodra je een schermhoogte ver
  bent. Elders blijft het de pijl naar links terug naar de homepage.
- Het soepele scrollen doet het scrollen als dat aanstaat; bij "minder
  beweging" spring je er meteen naartoe in plaats van dat het scherm
  langsvliegt. Vier browsertests erbij; 132 groen.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-17 (avond) — Dennis (Claude Code, cloud)

- **Hero-tekst kleiner en rustiger.** De kop gaat van 36 naar 32px op een
  telefoon (68 in plaats van 80px op een breed scherm), de inleiding van 20
  naar 18px (24 in plaats van 28). Eigen tokens `--text-hero` en
  `--text-hero-lead`, want die tekst staat over een foto en mag rustiger zijn
  dan een kop op een egale achtergrond. De openingsstatus en het
  telefoonnummer blijven zoals ze waren (16px).
- **"Scherper" bleek niet aan de weergave te liggen.** Nagemeten: met en
  zonder de resterende transform van de animatie is het beeld pixel voor pixel
  identiek, en `-webkit-font-smoothing` maakt ook niets uit. De tekst stond
  gewoon half over het gezicht heen, en dat leest als onscherp.
- **Foto op een staand scherm van 62 naar 40svh.** Nu staat de foto bovenin en
  de tekst eronder op een egale achtergrond. Dat levert bovendien meer foto
  op: in een lager vak wordt hij minder ver opgeblazen, dus zie je ongeveer
  tweederde in plaats van veertig procent. Op een liggend scherm verandert er
  niets; daar is het contrast achter de tekst 14,5:1 voor de kop en 7,7:1 voor
  de inleiding, ruim boven de norm.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-18 — Dennis (Claude Code, cloud)

Nagelopen op vijf toestelmaten (iPhone SE 375x667, Galaxy A 360x740, iPhone 13
mini 375x812, iPhone 15 393x852, iPhone 15 Pro Max 430x932). Op de grote
toestellen zag het er goed uit, op de kleine niet.

- **Hero paste zich niet aan het toestel aan.** De foto had een vaste hoogte
  (40% van het scherm), maar de tekst begint op een kleine telefoon veel hoger
  dan op een grote. Op een SE liep de foto daardoor 86px over de tekst heen.
  De foto krijgt nu precies de ruimte die boven de tekst overblijft: een strook
  van 181px op een SE, 505px op een Pro Max, en nergens nog overlap.
- **Koptekstbalk minder doorschijnend** (85 naar 95 procent). Elke lichte foto
  die eronderdoor schoof, schemerde erdoorheen en flikkerde achter het logo
  langs.
- **Zwevende knopje linksonder alleen nog vanaf tablet.** Op een telefoon lag
  het op bijna elke schermafdruk over een knop of een regel tekst heen, en op
  de lichte stukken was het een donkere vlek. Het logo bovenin doet precies
  hetzelfde en staat altijd in beeld.
- Nagemeten en niet aangepast: de foto's zijn hooguit 0,65 scherm hoog en de
  witruimte tussen de secties zit al op de ondergrens. Daar zat de onrust niet.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-18 (later) — Dennis (Claude Code, cloud)

- **"Advies op maat" als kop op de homepage.** Dat was de titel van de oude
  WordPress-homepage, dus het is hun eigen claim en niets nieuws. Het staat nu
  op de grootste plek van de site. De bovenregel werd "Opticien in Groningen",
  zodat die zoekterm zichtbaar op de pagina blijft staan nu de kop hem niet
  meer bevat; hij staat ook nog in de paginatitel, de meta-omschrijving en de
  gegevens voor Google.
- Het adres is uit de hero gehaald. Gemeten: "Overwinningsplein 100,
  Groningen" loopt op een telefoon over twee regels, en dat maakt het eerste
  scherm juist weer onrustig. Het adres staat verderop bij "Bezoek de winkel",
  in de voettekst en op de contactpagina.
- De inleiding begint nu met "Rust, tijd en aandacht" in plaats van "Rust, tijd
  en eerlijk advies": anders stond "advies" twee keer vlak onder elkaar.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-19 — Dennis (Claude Code, cloud)

- **Klaargezet voor een tweede persoon.** `docs/samen-werken.md` beschrijft in
  stappen hoe je iemand toegang geeft (GitHub, Claude, Vercel) en hoe je daarna
  samenwerkt zonder elkaar te overschrijven.
- Er staat nu een sjabloon voor pull requests in `.github/pull_request_template.md`,
  met een lijstje van wat er nagekeken moet zijn en een plek voor de preview-link.
- **Blijft het dringendst:** er is nog steeds maar één branch, en die is
  tegelijk de live site. Met twee mensen gaat dat mis. Stap 1 en 2 van
  `docs/samen-werken.md` zetten dat recht; dat kan alleen de eigenaar van de
  repository doen.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-20 — Dennis (Claude Code, cloud)

- `main` is aangemaakt en is nu de standaardbranch; Vercel zet alleen `main`
  nog live en elke andere branch krijgt een preview.
- De ruleset "Beschermde main" staat klaar, maar **slaapt**: GitHub dwingt
  regels niet af op een privé-repository onder een persoonlijk account. Dat is
  bewust zo gelaten voor nu. De afspraak die het vangnet vervangt staat in
  `docs/samen-werken.md`: alles via een pull request, en nooit samenvoegen als
  de controle rood is.
- Eerste pull request geopend, zodat de controle op GitHub voor het eerst
  draait en er een preview-link komt.
- **Nog open:** zie `docs/open-punten.md`. De volgende stap is je vader
  toevoegen (stap 3 in `docs/samen-werken.md`).

---

## 2026-09-20 (later) — Dennis (Claude Code, cloud)

- Je vader (`gbugel`) is toegevoegd met schrijfrechten en heeft de uitnodiging
  aangenomen. Zijn eerste testsessie liep goed: `npm run check` groen,
  exitcode 0.
- Wat daarbij opviel: Node gaf bij elke testronde een waarschuwing
  (`MODULE_TYPELESS_PACKAGE_JSON`) die eruitzag alsof er iets mis was. Er stond
  geen `"type"` in package.json. Nu wel — dat is veilig, want het project heeft
  geen enkel los `.js`-bestand. Nagekeken: 27 snelle tests, bouwen en 130
  browsertests allemaal groen, en de waarschuwing is weg.
- **Nog open:** PR #1 samenvoegen, en stap 4 (preview-toegang voor gbugel).

---

## 2026-09-20 — Gerard (Claude Code, cloud)

- **"op maat" in de kop van de homepage valt nu op:** cursief en in het messing
  van de Afspraak-knop, net als de slogan in de voettekst.
- De nadruk staat in de tekst zelf (`"Advies *op maat*"` in
  `src/content/teksten/home.json`); de Hero leest die sterretjes. Schrijf je
  later een andere kop, dan verhuist de nadruk gewoon mee.
- Fraunces wordt nu ook cursief geladen, zodat de browser de letters niet zelf
  scheef hoeft te zetten.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-20 (nog later) — Dennis (Claude Code, cloud)

- **Uitgezocht waarom de live site achterliep** na het samenvoegen van Gerards
  pull request. Niet de code: die bouwt hier, bouwt op Vercel en de controle op
  GitHub is groen, ook op `main` zelf. Vercel blokkeerde het live zetten omdat
  de **schrijver** van de samengevoegde commit (`gbugel`) geen toegang heeft
  tot het Vercel-project. Op een privé-repository bouwt Vercel alleen commits
  van iemand die daar wél bij kan, en op het gratis abonnement is dat één
  persoon. Bij "Squash and merge" zet GitHub de opener van de pull request als
  schrijver — vandaar dat de preview wél klaarkwam en het live zetten niet.
- De drie uitwegen staan uitgeschreven in `docs/samen-werken.md` en de keuze
  staat als eerste punt in `docs/open-punten.md`: zelf samenvoegen met "Create
  a merge commit", de repository openbaar maken, of Vercel Pro.
- **`main` binnengehaald** in deze branch, zodat Gerards cursieve "op maat"
  erbij zit. Enige botsing zat in dit werklog; beide stukken staan er nog.
  Nagekeken: 27 snelle tests, bouwen en 130 browsertests groen, en de
  Vercel-preview van deze branch kwam gewoon klaar.
- **Nog open:** PR #1 samenvoegen (dat zet meteen ook Gerards wijziging live),
  stap 4 (preview-toegang voor gbugel) en de keuze hierboven.

---

## 2026-09-20 (later) — Gerard (Claude Code, cloud)

- **Controlepagina voor de agenda:** `/agenda-controle/` loopt de koppeling met
  OO2 stap voor stap na en zegt in gewone taal waar het hangt — adres,
  inloggegevens, diensten, medewerker, vrije tijden. Geen sleutels in beeld,
  niet in het menu, niet in de sitemap, en op `noindex`.
- **`docs/agenda-koppelen.md`** is nieuw: drie manieren om de koppeling te
  leggen, met een mail aan OO2 die je kunt overnemen.
- **Rechtgezet:** in het beheerscherm van OO2 is géén knop om een API-sleutel
  aan te maken; bij Easy!Appointments staat die in een bestand op de server.
  `docs/open-punten.md` en `.env.example` zeggen nu het juiste.
- **Nog open:** de koppeling zelf. Die kan pas als OO2 de API aanzet of als
  inloggen met een beheerdersaccount blijkt te werken.

---

## 2026-09-20 (avond) — Gerard (Claude Code, cloud)

- **Afspraken buiten openingstijden zijn van de site af.** Die service bieden we
  niet meer aan. Weg uit dertien paginateksten, uit drie veelgestelde vragen,
  uit het blokje op /over-ons/, uit de boekingsmodule, uit llms.txt en uit de
  voettekst. De constante `BUITEN_OPENINGSTIJDEN` bestaat niet meer.
- **"(betaald)" is bij het parkeren weggehaald**, overal waar het stond: de
  paginateksten, llms.txt en de bevestigingsmail. De informatie zelf blijft
  staan: parkeren kan direct voor de deur, de bus stopt pal voor de winkel.
- `docs/teksten-review.md` opnieuw gegenereerd.
- **Nog open:** zie `docs/open-punten.md`; de agendakoppeling wacht nog op OO2.

---

## 2026-09-20 (eind van de dag) — Dennis (Claude Code, cloud)

- **Live zetten gaat nu via GitHub in plaats van via Vercel.** Gerard moest
  steeds wachten tot Dennis zijn werk live zette: Vercel bouwt een privé-
  repository alleen als de schrijver van de commit ook toegang heeft tot het
  Vercel-project, en op het gratis abonnement is dat één persoon. Twee
  samenvoegingen bleven daardoor hangen. De taak **"Live zetten"** in
  `.github/workflows/ci.yml` doet het nu met een sleutel in plaats van met een
  naam, dus het maakt niet meer uit wie de wijziging maakt of samenvoegt.
- Die taak draait alleen op `main` en alleen als de controle én de
  browsertests groen zijn. Een kapotte versie kan dus niet meer live — dat kon
  eerst wél, want Vercel keek nergens naar.
- `vercel.json` (nieuw) zet het automatische live zetten door Vercel zelf uit
  voor `main`, zodat het niet dubbel gebeurt. Previews blijven ongewijzigd:
  die maakt Vercel nog gewoon zelf, bij elke branch en pull request.
- **Nog te doen door Dennis, eenmalig:** één sleutel klaarzetten in de kluis
  van GitHub (`VERCEL_TOKEN`). De twee kenmerken van het project staan in
  `ci.yml` zelf — dat zijn geen wachtwoorden, ze staan ook in de berichtjes
  die Vercel bij elke pull request achterlaat. Twee minuten, in stappen in
  `docs/samen-werken.md`. Tot die tijd stopt de taak met een melding en blijft
  de live site staan.
- **Nog open:** PR #1 samenvoegen, en zie verder `docs/open-punten.md`.

---

## 2026-09-20 (avond) — Dennis (Claude Code, cloud)

- **PR #1 samengevoegd.** De controle en de 130 browsertests waren groen op
  `main`, maar de nieuwe taak **Live zetten** viel om op de eerste Vercel-stap:
  `Could not retrieve Project Settings`. De site bleef daardoor staan zoals hij
  stond — precies zoals het hoort: mislukt live zetten verandert niets.
- **Oorzaak:** de twee kenmerken van het project stonden als secret in GitHub.
  Een secret kun je niet nakijken, dus een typefout of twee verwisselde waarden
  merk je pas als het misgaat. Ze staan nu met de waarde erbij in `ci.yml` —
  het zijn geen wachtwoorden, ze staan ook in Vercels eigen berichten bij elke
  pull request. Alleen de sleutel blijft in de kluis.
- **Twee dingen erbij** om de volgende keer sneller te zijn: de stap "Kijken
  bij wie de sleutel hoort" (`vercel whoami`) zegt meteen of het aan de sleutel
  ligt of aan het project, en met **Run workflow** op de Actions-pagina kun je
  het live zetten opnieuw proberen zonder eerst iets aan de site te veranderen.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-20 (laat) — Gerard (Claude Code, cloud)

- **Vastgelegd waarom preview-links niet te openen zijn:** het Vercel-project
  staat in het team `projects-c1cc`, Gerard logt in met `g-bugel-6898`, en
  preview-deploys zitten achter Deployment Protection. `docs/vercel-toegang.md`
  beschrijft de snelle oplossing (het slot eraf) en de echte (het project
  overzetten naar Gerard), met een bericht dat doorgestuurd kan worden.
- **Overzetten bleek niet te kunnen:** Vercel laat alleen overzetten naar een
  team waar je zelf in zit, dus bood het alleen "Create Team" aan. Het document
  beschrijft nu ook de weg die wel werkt: Gerard maakt er zelf een project van
  uit dezelfde repository, en daarna verhuist het domein.
- **Dringend:** zolang dit niet geregeld is, kan Gerard geen enkele preview
  bekijken en moet hij wachten tot iets live staat.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-20 (nacht) — Gerard (Claude Code, cloud)

- **De foto bij "Ultiem nauwkeurig zicht" op de homepage is kleiner.** In de
  versie zonder vastgezette scène (tablet, en iedereen die minder beweging
  gevraagd heeft) stond hij op de volle kolombreedte: 1326 bij 1768 pixels op
  een scherm van 1440 breed, dus hoger dan het scherm zelf. Nu maximaal 480
  pixels breed, in dezelfde 4:5-verhouding als de vastgezette versie. Op een
  telefoon verandert er niets.
- **En de foto is vervangen.** `assets-new/Geer spleetlamp.jpg` (3213 x 5712)
  staat nu op die plek, in 4:5 - precies de verhouding waarin hij op de pagina
  komt, zodat hij daarna niet nog eens bijgesneden wordt. Nieuwe alt-tekst:
  Gerard achter de spleetlamp, met de Vision-R 800 boven hem.
- Gerard heeft in één keer een hele reeks nieuwe winkelfoto's geüpload naar
  `assets-new/`. Alleen deze is nu in gebruik; de rest staat klaar.

---

## 2026-09-20 (heel laat) — Gerard (Claude Code, cloud)

- **De twee zwart-witportretten bij "Het verhaal van Gerard en Gerda" zijn
  vervangen** door eigen foto's uit de winkel: `Geer close up aan tafel.jpg`
  voor Gerard en `Ger close up refr.ruimte.jpg` voor Gerda. Allebei 2268 x 4032,
  bijgesneden op 3:4 en nog steeds in zwart-wit, zodat ze naast elkaar één
  geheel blijven.
- Let op: diezelfde twee foto's staan ook op `/over-ons/`, bij de namen van
  Gerard en Gerda. Die veranderen dus mee.
- Nieuwe alt-teksten, beschreven naar wat er echt op staat.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-20 (afsluitend) — Gerard (Claude Code, cloud)

- **Nieuwe foto bij de loepbrillen:** `loepbril-verlichting.webp` in plaats van
  het Admetec-model. Te zien op de aanbodtegel op de homepage en boven aan
  `/loepbrillen/`.
- Het origineel is liggend (1166 x 763), en in het staande vak van 3:4 komt er
  zonder opblazen maar 572 pixels breed uit. De breedtes staan daarom op
  [400, 572]; op een scherm met veel pixels is hij daardoor iets zachter dan de
  andere tegels. Een staande foto van dezelfde loepbril zou dat oplossen.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-20 (avond, tijden) — Gerard (Claude Code, cloud)

- **Nieuwe tijden bij het afspraak maken**, op verzoek van Gerard en Gerda:
  oogmeting 60 minuten, oogmeting en montuuradvies 90, montuur bijstellen 15,
  contactlenzen aanmeten 60, contactlenzen opnieuw aanmeten 45. De rest blijft
  op een half uur. Overal staat "ongeveer" ervoor, zoals hiervoor ook.
- **Let op:** dit is de lijst van de site. Draait straks de koppeling met de
  agenda, dan wint de duur die in OO2 staat. Die moet daar dus ook aangepast
  worden, anders lopen ze uit elkaar.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-20 (avond, koffie) — Gerard (Claude Code, cloud)

- **"De koffie staat klaar." weggehaald** uit het blok "Zullen we eens goed naar
  je ogen kijken?" onderaan de homepage. De zin stond daar achter het
  mailadres. Alleen in dat ene tekstvak; elders op de site blijft hij staan.
- **De uitleg bij Lenscontrole klopte niet** en is vervangen door de tekst van
  Gerard en Gerda zelf: de reguliere controle, of de lenzen nog comfortabel
  zitten, of de sterkte nog goed is, en de conditie van de ogen.
- `docs/teksten-review.md` opnieuw gegenereerd.
- **Nog open:** zie `docs/open-punten.md`; het live zetten wacht nog op een
  Vercel-token met toegang tot het team.

---

## 2026-09-20 (werkplaats) — Gerard (Claude Code, cloud)

- **De eigen werkplaats staat nu op de site.** Gerard en Gerda slijpen de glazen
  zelf; dat stond nergens. Er is een kaartje "Eigen werkplaats" bij "Hoe wij
  werken" op Over ons, en een alinea bij "Glazen" op de brillenpagina.
- Bewust geen uitspraak over hoe snel een bril daardoor klaar is - dat weet ik
  niet en dat mag ik niet verzinnen.
- **Nog te maken:** een foto van het slijpen, liggend, met Gerard aan de
  machine. Wat er op zo'n foto moet staan, staat in `docs/open-punten.md`.

---

## 2026-09-20 (winkel en monturen) — Gerard (Claude Code, cloud)

- **De gelige winkelfoto is vervangen.** De oude (`winkel-bewerkt-website-3.png`)
  had een sterke gele zweem van het winkellicht, en de warme kleurcorrectie
  maakte dat erger. Er staat nu `Winkel alles.jpg`, neutraal belicht en 5712
  pixels breed. Die foto staat op Over ons en is ook het beeld dat meegaat als
  iemand de site deelt.
- **Rechtgezet: de inkoop doen Gerard en Gerda samen.** Op vijf plekken stond
  dat Gerda dat alleen doet. Het etaleren blijft van Gerda.
- **Rechtgezet: de monturen liggen niet in een kast maar hangen aan de wand.**
  Zes plekken, inclusief de merkenpagina en de oproep onderaan de collectie.
- **Nieuw stukje bij "Wie is Gerda"** over hoe het echt gaat: Gerard meet je
  ogen, daarna loopt Gerda met je langs de wand en pakt het montuur dat bij je
  gezicht hoort.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-20 (wie doet wat) — Gerard (Claude Code, cloud)

- **Rechtgezet: de oogmeting doet Gerard, niet allebei.** Stond zo in de eerste
  zin van de homepage en in de inleiding van de contactlenzenpagina.
- De homepage begint nu met: "Rust, tijd en aandacht. Gerard meet je ogen
  nauwkeurig, daarna zoekt Gerda samen met je het montuur dat echt bij je past."
  Daarmee staat de taakverdeling meteen in het eerste wat iemand leest.
- **Nieuw kaartje "Ieder zijn vak"** bij "Hoe wij werken" op Over ons, dat het
  wat uitgebreider vertelt.
- Zinnen als "wij, Gerard en Gerda, nemen de tijd voor je" zijn blijven staan:
  die gaan over de winkel, niet over wie meet.
- **Ook het aanmeten van contactlenzen doet Gerard**, bevestigd door hemzelf.
- **De dubbele winkelfoto op Over ons is weg.** Daar stonden twee
  overzichtsfoto's van dezelfde ruimte onder elkaar. De nieuwste blijft; de
  oude (`Winkel-helemaal-3`) is eruit, ook als slot in `config/beeld.mjs`.
  Eronder staat nu de foto van Gerard en Gerda in de deuropening, net als
  hiervoor.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-20 (portret omgewisseld) — Gerard (Claude Code, cloud)

- **Ander portret van Gerard:** `Geer close-up 2.jpg` in plaats van
  `Geer close up aan tafel.jpg`. Rustiger beeld, en de achtergrond is bijna
  helemaal monturenwand, wat naast het portret van Gerda beter samengaat.
- De alt-tekst zegt niet meer "lachend", want op deze foto kijkt hij rustig.
- **Nog open:** zie `docs/open-punten.md`; het live zetten wacht nog op een
  Vercel-token met toegang tot het team.

---

## 2026-09-20 (waarom live zetten strandt) — Gerard (Claude Code, cloud)

- **De oorzaak van het mislukte live zetten staat nu vast** en is opgeschreven
  in `docs/vercel-toegang.md`: `VERCEL_TOKEN` bestaat wel, maar heeft geen
  toegang tot het team `projects-c1cc`. De stap "Instellingen van het project
  ophalen" faalt met "Could not retrieve Project Settings". De twee kenmerken
  in `ci.yml` kloppen wel; het is dus de sleutel.
- **Wat er moet gebeuren:** een nieuwe token met dat team als bereik, in GitHub
  zetten, en bij de laatste mislukte run op "Re-run failed jobs" drukken. Dan
  gaat alles wat op `main` klaarstaat in één keer live.
- Dezelfde oorzaak houdt ook de preview-links op slot.

---

## 2026-09-20 (keurmerken en loepbrillen) — Gerard (Claude Code, cloud)

- **ANVC en NUVO verwijzen nu naar hun eigen site**: anvc.nl en nuvo.nl. Op drie
  plekken: de voettekst, het blok "Vertrouwen" op de homepage en de pagina Over
  ons. De pillen in de voettekst zijn meteen 44 pixels hoog geworden, zoals de
  huisstijlregel voor knoppen vraagt.
- Bij NUVO stond "Brancheorganisatie voor optiekbedrijven"; dat is nu de eigen
  naam: Nederlandse Unie van Optiekbedrijven.
- **De knop op de loepbrillenpagina leidt naar een kortere lijst.** Hij gaat
  naar `/afspraak-maken/?voor=loepbrillen`, en dan staan in stap 1 alleen de
  twee loepbrilafspraken. Eronder staat "Laat alles zien" voor wie toch iets
  anders zoekt.
- **Nu op alle vijf de aanbodpagina's.** Welke afspraken bij welke pagina horen
  staat in `ONDERWERPEN` in `src/content/diensten.ts`:

  | Pagina | Wat je ziet |
  |---|---|
  | brillen, zonnebrillen, kinderbrillen | oogmeting, oogmeting en montuuradvies, glazen inmeten, bril afhalen, montuur bijstellen (5) |
  | contactlenzen | aanmeten, opnieuw aanmeten, lenscontrole (3) |
  | loepbrillen | informatie, aanmeten en oogmeting (2) |

- De agenda kent geen aparte afspraken voor zonnebrillen en kinderbrillen; dat
  begint allebei met een oogmeting en loopt verder als een gewone bril. Die
  pagina's krijgen daarom dezelfde lijst als de brillenpagina.

---

## 2026-09-20 (laat) — Dennis (Claude Code, cloud)

- **De repository is openbaar gemaakt, en dat loste alles op.** De hele dag
  bleef werk van Gerard hangen op `Blocked`: Vercel bouwt een privé-repository
  alleen als de schrijver van de commit ook toegang heeft tot het project, en
  op het gratis abonnement is dat één persoon. Negen samenvoegingen stonden
  daardoor niet online, terwijl de controle steeds groen was. Die regel geldt
  niet voor openbare repositories.
- **De omweg is eruit.** De taak "Live zetten" in `ci.yml` en `vercel.json`
  zijn verwijderd. Vercel zet `main` weer zelf live, zoals in het begin —
  alleen nu voor iedereen die samenvoegt. Eenvoudiger dan het was.
- Wat we onderweg wél hebben overgehouden: de controle en de browsertests
  draaien nog steeds bij elke pull request en bij elke wijziging op `main`.
- **Nieuw aandachtspunt:** de ruleset op `main` sliep omdat GitHub regels niet
  afdwingt op een privé-repository onder een persoonlijk account. Nu de
  repository openbaar is, wordt hij wél afgedwongen. Even nalopen of de regels
  staan zoals je ze wilt — zie `docs/open-punten.md`.
- **Nog open:** zie `docs/open-punten.md`.

---

## 2026-09-20 (merken) — Gerard (Claude Code, cloud)

- **Vier merken eruit** (Calvin Klein, Baruch, Colibris en Liu Jo) en **Serengeti
  erbij** als zonnebrilmerk. Aangepast in `src/content/merken.ts` en in de
  merkenrijtjes op de homepage, de brillenpagina en de zonnebrillenpagina.
- **Er stond een notitie van mij op de site.** In de zonnebrillentekst stond
  letterlijk "(Zet Randolph als open punt: ...)". Die is eruit, de vraag staat
  nu in `docs/open-punten.md`, en de test die zulke restjes vangt is
  aangescherpt zodat er niets meer tussen "zet" en "als open punt" mag staan.
- **Italië is van de site af.** Liu Jo was het enige Italiaanse merk, en Gerard
  bevestigde dat er geen Italiaanse merken meer gevoerd worden. Op zes plekken
  aangepast: homepage, Over ons, collectie (tekst, meta en een vraag), aanbod
  en llms.txt. De landen die de homepage toont zijn nu België, Frankrijk,
  Nederland, Oostenrijk, Spanje en Zwitserland.
- **Bloomdale komt uit Nederland**, bevestigd door Gerard. Daarmee is dat de
  eerste herkomst in de lijst die niet meer onder voorbehoud staat.
- **Randolph is een zonnebrilmerk**, ook bevestigd, en staat nu in het rijtje op
  de zonnebrillenpagina.

---

## 2026-09-20 (Visioffice) — Gerard (Claude Code, cloud)

- **Foto van de Visioffice erbij** op `/ultiem-nauwkeurig-zicht/`, onder de
  sectie "Van meting naar glas: inmeten met Visioffice". Bewust smal gehouden
  (maximaal 352 pixels breed): hij staat middenin lopende tekst, niet als
  banner.
- Het origineel is een staande telefoonfoto; hij wordt vanaf de bovenkant
  bijgesneden (`north`), want daar staat het scherm met de naam erop.
  `attention` koos de onderkant en sneed dat scherm af.
- `InhoudsPagina` kan nu een foto bij één sectie zetten (`beeldBijSectie`).
  Klopt de kop niet, dan komt er gewoon geen foto; er verdwijnt nooit tekst.
- Voorlopig alleen daar, op verzoek van Gerard.

---

## 2026-09-21 (lang weekend) — Gerard (Claude Code, cloud)

- **Rechtgezet: bij "Afwijkende openingstijden" stond dat bezoekers de reden
  zien.** Dat klopt niet — de reden wordt nergens op de site getoond, alleen in
  de lijst in het beheerscherm. De site zegt alleen "Gesloten · wij zijn weer
  open op woensdag vanaf 9.30 uur". Aangepast in `keystatic.config.ts` en in
  `docs/handleiding-beheer.md`.
- Dat is ook het antwoord op de vraag hoe je een lang weekend meldt zonder het
  breed uit te meten: de dagen invullen bij afwijkende openingstijden, en de
  mededelingenbalk bovenaan ongemoeid laten.
- **Nog open:** afwijkende dagen doorgeven aan Google via
  `specialOpeningHoursSpecification` in de structuurgegevens. Nu staat daar
  alleen de gewone week, dus Google kan op zo'n dag "geopend" tonen.
