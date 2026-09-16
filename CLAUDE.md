# Oogcontact bij Gerard

De website van **Oogcontact bij Gerard**, een zelfstandige opticien aan het
Overwinningsplein 100 in Groningen. De winkel is van Gerard en Gerda Bugel.

Deze site vervangt de oude WordPress-site volledig. Het hoofddoel is dat
bezoekers een afspraak maken (online, bellen of WhatsApp) en dat de warme,
persoonlijke sfeer van de winkel voelbaar wordt.

---

## Waar alles staat

```
src/
  app/            de pagina's (Next.js App Router) en de API-routes
  components/     de losse onderdelen waar pagina's uit zijn opgebouwd
  content/        de feiten: openingstijden, diensten, merken, kleuren
    beheer/       wat Gerard en Gerda via /keystatic aanpassen
  lib/            de logica: openingstijden, agenda, e-mail, validatie
                  veldregels.ts draait ook in de browser, validatie.ts alleen
                  op de server (die laatste gebruikt Zod, en dat is te zwaar
                  om mee te sturen naar een bezoeker)
  styles/         globals.css met de huisstijl als Tailwind-tokens
config/
  beeld.mjs       welke foto op welke plek staat
  url-map.mjs     van oude WordPress-URL naar nieuwe URL
scripts/          crawlen, beeld verwerken, logo maken, contrast controleren,
                  nieuws migreren, url-map en teksten-review genereren
content-archive/  de complete oude site als bronmateriaal (niet bewerken)
assets-original/  alle originele foto's van de oude site
assets-new/       hier komen nieuwe foto's in (zie de README daar)
docs/             handleidingen, open punten, werklog
tests/            unit-tests (node) en Playwright-tests
```

## Commando's

```bash
npm run dev          # de site lokaal bekijken op http://localhost:3000
npm run build        # bouwen zoals Vercel dat doet
npm run check        # lint + typecheck + contrast + unit-tests (doe dit vóór een PR)
npm run test:unit    # alleen de snelle tests
npm run test:e2e     # de Playwright-tests (browser nodig)
npm run images       # foto's opnieuw verwerken na een wijziging in config/beeld.mjs
npm run crawl        # de oude WordPress-site opnieuw ophalen (zelden nodig)
```

Losse scripts die je zelden nodig hebt:

```bash
node scripts/maak-logo.mjs               # het logo opnieuw vectoriseren
node scripts/migreer-nieuws.mjs          # de oude nieuwsberichten overzetten
node scripts/genereer-url-map.mjs        # docs/url-map.md bijwerken
node scripts/genereer-teksten-review.mjs # docs/teksten-review.md bijwerken
```

---

## Huisstijlregels

**Aanspreekvorm.** Overal **"je/jij"**, nooit "u". Dat geldt ook voor knoppen,
foutmeldingen, e-mails en meta-teksten. De oude site wisselde die twee door
elkaar; dat is bewust rechtgetrokken.

**Kleuren.** Staan in `src/content/kleuren.mjs` en zijn overgenomen in
`src/styles/globals.css` als Tailwind-tokens. Het ivoor (`#FBF2E6`) komt
letterlijk uit het logo. Er is precies **één accentkleur**: messing.
`npm run check:contrast` controleert of elke gebruikte combinatie voldoet aan
WCAG 2.2 AA. Verander je een kleur, pas hem dan op beide plekken aan.

**Lettertypen.** Fraunces voor koppen, Manrope voor lopende tekst. Allebei via
`next/font`, dus zelf gehost: de browser van de bezoeker legt geen verbinding
met Google.

**Tekstgrootte.** Elke maat staat in `globals.css` als een `clamp()`: een
ondergrens voor een telefoon, een bovengrens voor een breed scherm, en daar
tussenin groeit hij mee met de schermbreedte. Lopende tekst loopt van **17px**
op een telefoon naar **18px** vanaf ongeveer 720 pixels breed. **Niets wordt
ooit kleiner dan 16px** - veel bezoekers zijn 45+ en komen juist voor hun ogen.
Zet dus nooit een vaste `px`- of `rem`-maat op tekst; gebruik de tokens.

**Beweging.**
- Alleen `transform` en `opacity`. Nooit iets dat de pagina laat verspringen.
- `prefers-reduced-motion` wordt altijd gerespecteerd: dan geen vastgezette
  scènes, geen parallax, alleen zachte overgangen. Dat staat in `globals.css`
  én in `src/components/Beweging.tsx`.
- Magnetische knoppen en de eigen cursor: alleen op apparaten met een muis.
- Op mobiel dezelfde sfeer, lichter uitgevoerd.

**Knoppen.** Minimaal 44 × 44 pixels, altijd een zichtbare focusring.

---

## Werkafspraken

**`main` is de live site.** Elke wijziging gaat via een pull request; Vercel
maakt daar automatisch een preview-link bij. Nooit rechtstreeks naar `main`.

**Begin altijd vanaf de nieuwste `main`.** Eén onderwerp per branch, kleine
pull requests, met de preview-link erbij.

**Gerard en Gerda werken mee via Keystatic.** Wat zij daar opslaan (nieuws,
vakantiemelding, openingstijden, merken) komt als commit in de repo. Haal dus
altijd eerst `main` binnen voordat je begint, los conflicten netjes op en
overschrijf nooit werk van een ander.

**`docs/WERKLOG.md`:** schrijf na elke sessie 2 tot 4 regels: datum, wie, wat er
veranderd is en wat er nog openstaat.

**Verzin geen feiten.** Merknamen, prijzen, openingstijden, keurmerken en
diensten komen alleen van de huidige site, de online agenda of van Gerard en
Gerda zelf. Ontbreekt iets? Zet er een duidelijke `TODO` bij en noteer het in
`docs/open-punten.md`.

---

## Dingen om te weten

**Zonder sleutels werkt alles.** Staat er geen API-sleutel ingesteld, dan
draaien het formulier en de boekingsmodule in testmodus: ze laten in de
terminal zien wat er verstuurd zou zijn, in plaats van het echt te doen. Zo kun
je altijd bouwen en testen, ook in de cloud. Zie `.env.example`.

**Geheimen horen in Vercel.** Nooit in de repo en niet in de
omgevingsvariabelen van de cloudomgeving.

**URL's.** De site draait met `trailingSlash: true`. Daardoor blijft elke oude
WordPress-URL letterlijk werken. `config/url-map.mjs` is de enige bron voor de
redirects; `next.config.ts` en de tests gebruiken allebei dat bestand.

**Foto's.** `config/beeld.mjs` bepaalt welke foto waar staat. Een foto wisselen
is één regel aanpassen en `npm run images` draaien. Verander nooit wat er op
een foto staat, en schrijf altijd een goede Nederlandse alt-tekst.

**Let op bij het testen.** De formulieren hebben een snelheidsbegrenzer die in
het geheugen van de server telt: vijf inzendingen per tien minuten. Draai je de
browsertests een paar keer achter elkaar tegen dezelfde draaiende server, dan
krijg je een terechte 429. Herstart de server dan even; in de CI start er altijd
een verse.

**Tests van de logica** draaien rechtstreeks op TypeScript met
`node --experimental-strip-types`. Daarom gebruiken `src/lib/` en
`src/content/` onderling relatieve imports mét `.ts`-extensie, en het
alias `@/` alleen in `src/app/` en `src/components/`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
