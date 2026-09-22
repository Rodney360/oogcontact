# Live gaan — de checklist

Eén papiertje om af te vinken. Alles wat hier niet staat, kan ook ná de
lancering. De uitgebreide uitleg per punt staat in `docs/open-punten.md`.

Bijgewerkt op 22 september 2026.

Gerard heeft de afspraakduren en de namen in OO2 nagelopen. Daarmee staat alles
op groen behalve het verhuizen van het domein.

---

## Dit moet af, anders gaat er iets mis

### 1. ~~De mailsleutel (Resend)~~ — vervallen, zolang het formulier uit staat

Het terugbelformulier staat uit (`config/schakelaars.mjs`). Daarmee verstuurt de
site nergens meer e-mail, en is de sleutel van Resend **niet meer nodig om live
te kunnen**. Bezoekers bellen, appen, mailen, of kiezen zelf een moment in de
agenda.

Zet je het formulier ooit weer aan, dan moet dit eerst geregeld zijn — anders
vult iemand het in, ziet "bedankt", en hoort daarna nooit meer iets. De stappen
staan hieronder, maar ze zijn nu dus niet dringend.

- [ ] Gratis account op <https://resend.com>
- [ ] Domein `oogcontactbijgerard.nl` toevoegen
- [ ] De twee DNS-regels zetten die Resend noemt (SPF en DKIM). Die komen
      **naast** de bestaande MX-records en raken de gewone e-mail van de winkel
      dus niet.
- [ ] In Vercel → Settings → Environment Variables:
      - `RESEND_API_KEY` → de sleutel
      - `MAIL_AFZENDER` → `Oogcontact bij Gerard <website@oogcontactbijgerard.nl>`
      - `MAIL_ONTVANGER` → `info@oogcontactbijgerard.nl`
- [ ] Opnieuw laten bouwen (redeploy) — een instelling telt pas mee bij een
      nieuwe bouw
- [ ] Zelf een testbericht sturen via het formulier en kijken of het aankomt

### 2. ~~De agenda in OO2 gelijktrekken~~ — Gerard. **Gedaan op 22 september.**

De agenda op de site is die van OO2 zelf. Alles wat de bezoeker daarin ziet
komt dus **uit OO2**, niet van ons.

- [ ] De duur per afspraak aanpassen. Op de site staat:
      - oogmeting — 60 minuten
      - oogmeting en montuuradvies — 90 minuten
      - montuur bijstellen — 15 minuten
      - contactlenzen aanmeten — 60 minuten
      - contactlenzen opnieuw aanmeten — 45 minuten
- [ ] De namen van de afspraken naast die op `/afspraak-maken/` leggen en
      gelijkmaken
- [x] ~~De taal op Nederlands zetten~~ — opgelost vanaf de site zelf, OO2
      hoeft daar niets voor te doen

### 3. Het domein verhuizen — Dennis

Doen als laatste, pas als Gerard en Gerda zeggen dat alles goed is. Reken op een
half uur werk en daarna een uurtje wachten. Kies een rustig moment: geen
vrijdagmiddag, en niet vlak voor sluitingstijd.

> **De e-mail van de winkel loopt over ditzelfde domein.**
> Verander alleen de regels die naar de website wijzen (`A` en `CNAME`). Laat de
> `MX`-regels en de `TXT`-regels met rust — daar hangt `info@oogcontactbijgerard.nl`
> aan. Zet je het domein over naar de naamservers van Vercel, dan moet je álle
> bestaande regels eerst overnemen, anders staat de mail stil. Alleen de
> A/CNAME-regels aanpassen bij de huidige provider is veiliger.

**Vooraf**

- [ ] Maak een schermafdruk of export van alle huidige DNS-regels. Dat is je
      weg terug.
- [ ] Zet de TTL van de A- en CNAME-regels een dag van tevoren laag (300
      seconden), dan gaat het omzetten straks snel.
- [ ] Zeg de oude WordPress-hosting **nog niet** op. Laat hem een paar weken
      staan voor het geval je terug moet.

**Het omzetten**

- [ ] In Vercel: Settings → Environment Variables → `NEXT_PUBLIC_SITE_URL` op
      `https://oogcontactbijgerard.nl`, en opnieuw laten bouwen. Zonder dat
      verwijst de sitemap nog naar het oude adres.
- [ ] In Vercel: Settings → Domains → `oogcontactbijgerard.nl` toevoegen, en
      daarna ook `www.oogcontactbijgerard.nl`.
- [ ] Vercel toont per domein precies welke DNS-regel erbij hoort. Neem die
      waarden letterlijk over bij de partij waar het domein nu staat. Verzin ze
      niet: ze verschillen per situatie.
- [ ] Wachten tot Vercel bij allebei "Valid Configuration" zegt en het
      certificaat klaar is. Meestal minuten, soms een uur.

**Daarna controleren**

- [ ] <https://oogcontactbijgerard.nl> toont de nieuwe site, met een slotje
- [ ] `www.oogcontactbijgerard.nl` komt uit op dezelfde site
- [ ] Een oud adres: <https://oogcontactbijgerard.nl/afwijkende-openingstijden/>
      hoort op het nieuwsoverzicht uit te komen
- [ ] <https://oogcontactbijgerard.nl/sitemap.xml> noemt het nieuwe domein, niet
      het oude of een vercel.app-adres
- [ ] De agenda op `/afspraak-maken/` doet het, op een telefoon én op een laptop
- [ ] **Stuur een testmail naar `info@oogcontactbijgerard.nl` en kijk of hij
      aankomt.** Dit is de belangrijkste controle van allemaal.

**De week erna**

- [ ] Het nieuwe adres aanmelden bij Google Search Console en de sitemap
      indienen
- [ ] In het Google Bedrijfsprofiel kijken of de link naar de site nog klopt
- [ ] Pas als alles een paar weken goed gaat: de oude hosting opzeggen

---

## Sterk aan te raden vóór de lancering

- [ ] **De mail naar OO2** over de leesbaarheid en de kleur `#C9A96A`. De
      datums en teksten in de agenda zijn lichtgrijs op wit; wij kunnen daar
      van onze kant niets aan doen. Staat klaar in `docs/agenda-koppelen.md`.
- [x] ~~KvK-nummer~~ — binnen: 82055882, staat in de voettekst.
- [ ] **De merkenlijst bevestigen.** Klopt hij nog, en uit welk land komt elk
      merk? Elf merken hebben nu geen landlabel. Zelf aan te passen via
      `/keystatic` onder Merken.
- [ ] **Alle teksten één keer rustig doorlezen.** `docs/teksten-review.md` zet
      elke pagina onder elkaar, zodat je niet hoeft te klikken.

---

## Kan ook ná de lancering

- [ ] Cloudflare Turnstile (extra spamfilter; de honeypot en de
      snelheidsbegrenzer houden nu al het meeste tegen)
- [ ] Link naar het Google Bedrijfsprofiel
- [ ] Een foto van het slijpen (wat een goede foto is, staat in
      `docs/open-punten.md` §1.4)
- [ ] Beslissen over de opslag van de originele foto's — 233 MB in de
      repository. Advies: zo laten.
- [ ] Een Lighthouse-rapport op de laatste preview (taak van Dennis)

---

## Het terugbelformulier staat uit

Sinds 22 september 2026. De voorkeur gaat uit naar appen of zelf een moment
kiezen in de agenda; een formulier waar iemand op moet wachten past daar niet
bij.

Er is niets weggegooid. In `config/schakelaars.mjs` staat één regel:

```js
export const TERUGBELFORMULIER_AAN = false
```

Zet die op `true` en het formulier staat weer op `/afspraak-maken/` én
`/contact/`. De tests lezen diezelfde regel en doen dan vanzelf weer mee. Denk
er dan wel aan dat de sleutel van Resend geregeld moet zijn.

---

## Wat het al doet, zonder dat er iets geregeld hoeft te worden

- De **agenda van OO2** op `/afspraak-maken/` — echte tijden, echte afspraken
- **Bellen, appen en mailen** vanaf elke pagina
- Alle **oude adressen** van de WordPress-site
- Het **beheerscherm** op `/keystatic`: nieuws, vakantiemelding, afwijkende
  openingstijden en merken
