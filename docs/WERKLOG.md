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
