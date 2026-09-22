# Live gaan — de checklist

Eén papiertje om af te vinken. Alles wat hier niet staat, kan ook ná de
lancering. De uitgebreide uitleg per punt staat in `docs/open-punten.md`.

**Wie doet wat.** Dennis heeft de site samen met Claude gebouwd; het instellen
en verhuizen is niet zijn vak, en dat hoeft ook niet. Alles wat in Vercel
gebeurt is aanklikken en kunnen Gerard en Gerda zelf. Het enige echte
installeerwerk - de DNS omzetten - laten we doen door **Creative Steps**, het
hostingbedrijf in Friesland waar de huidige site draait.

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

### 3. Het domein verhuizen — Gerard en Gerda, met Creative Steps

Dit is het enige stuk waar het echt om instellen gaat. Dennis heeft de site
gebouwd, maar hoeft dit niet alleen te doen — en dat is ook niet nodig. Het
verhuizen van een domein is dagelijks werk voor een hostingbedrijf, en dat van
jullie is **Creative Steps** in Friesland. Zij beheren de huidige site en
waarschijnlijk ook het domein.

Het valt uiteen in drie stukken, en alleen het middelste ligt buiten de deur.

> **De e-mail van de winkel loopt over ditzelfde domein.**
> `info@oogcontactbijgerard.nl` hangt aan dezelfde instellingen als de website.
> Alleen de regels die naar de website wijzen (`A` en `CNAME`) mogen veranderen;
> de `MX`- en `TXT`-regels moeten precies blijven zoals ze zijn. Zeg dit er
> expliciet bij als je het uit handen geeft. Een hostingbedrijf weet dit, maar
> het is te belangrijk om op aan te nemen.

**Stap 1 — in Vercel.**

> **Eerst dit, anders loop je vast.** Het Vercel-project staat in het team
> `projects-c1cc`, en Gerards account `g-bugel-6898` zit daar niet in. Open je
> een instellingenpagina, dan geeft Vercel **404** - niet omdat de link stuk is,
> maar omdat je hem niet mag zien. Zolang dat zo is, kan Gerard hieronder niets
> doen.
>
> Los dat eerst op, want straks hangt het domein aan dit project: kun je er niet
> bij, dan heb je voor elke hapering iemand anders nodig. Hoe dat moet staat in
> `docs/vercel-toegang.md` - overzetten als dat kan, en anders zet Gerard er een
> eigen project naast uit dezelfde repository.

Vercel heeft veel schermen. Zoek niet, maar open deze twee adressen
rechtstreeks (je moet ingelogd zijn met een account dat bij het project kan):

| Waarvoor | Adres |
|---|---|
| Het webadres instellen | <https://vercel.com/projects-c1cc/oogcontact/settings/environment-variables> |
| De domeinen toevoegen | <https://vercel.com/projects-c1cc/oogcontact/settings/domains> |

*1a. Het webadres instellen.* Zonder dit verwijst de sitemap nog naar het oude
adres.

- [ ] Open het eerste adres hierboven
- [ ] Staat er al een regel `NEXT_PUBLIC_SITE_URL`? Bewerk die. Zo niet, maak
      hem aan.
- [ ] Naam: `NEXT_PUBLIC_SITE_URL` — waarde: `https://oogcontactbijgerard.nl`
- [ ] Zet hem aan voor alle omgevingen (Production, Preview, Development)
- [ ] Opslaan

*1b. Opnieuw laten bouwen.* Een instelling telt pas mee bij een nieuwe bouw.

- [ ] Ga naar <https://vercel.com/projects-c1cc/oogcontact/deployments>
- [ ] De bovenste met het label **Production** → het knopje met de drie puntjes
      → **Redeploy**
- [ ] Wachten tot hij groen is (een paar minuten)

*1c. De domeinen toevoegen.*

- [ ] Open het tweede adres hierboven
- [ ] Typ `oogcontactbijgerard.nl` in het invoerveld en voeg hem toe
- [ ] Vercel biedt meestal aan om `www.oogcontactbijgerard.nl` erbij te doen en
      door te verwijzen naar het hoofddomein. Doe dat.
- [ ] Er verschijnt nu **"Invalid Configuration"** of iets in die geest. **Dat
      is goed en hoort zo** — het domein wijst immers nog naar de oude hosting.
- [ ] Klap die melding open. Daar staat precies welke DNS-regel waar moet
      komen. **Maak daar een schermafdruk van.** Dat is wat Creative Steps
      nodig heeft.

> Ziet Vercel een keuze tussen losse DNS-regels en het overzetten van de
> naamservers ("Nameservers")? Kies de **DNS-regels**. Naamservers overzetten
> raakt ook de e-mail, en dat willen we hier niet.

De knoppen kunnen er net iets anders uitzien dan hierboven staat; Vercel
verandert zijn schermen regelmatig. Kom je er niet uit, maak dan een
schermafdruk van wat je ziet.

**Stap 2 — bij Creative Steps.** Stuur ze die schermafdruk met de mail die
hieronder staat. Zij zetten de regels om.

**Stap 3 — daarna controleren. Dat doen jullie zelf.**

- [ ] <https://oogcontactbijgerard.nl> toont de nieuwe site, met een slotje
- [ ] `www.oogcontactbijgerard.nl` komt uit op dezelfde site
- [ ] Een oud adres: <https://oogcontactbijgerard.nl/afwijkende-openingstijden/>
      hoort op het nieuwsoverzicht uit te komen
- [ ] De agenda op `/afspraak-maken/` doet het, op een telefoon én op een laptop
- [ ] **Stuur een testmail naar `info@oogcontactbijgerard.nl` en kijk of hij
      aankomt.** Dit is de belangrijkste controle van allemaal.
- [ ] In Vercel staat bij allebei de domeinen "Valid Configuration"

**Vooraf, om rustig te kunnen werken**

- [ ] Vraag Creative Steps om de huidige DNS-instellingen te bewaren of te
      exporteren. Dat is de weg terug.
- [ ] Zeg de oude hosting **nog niet** op. Laat hem een paar weken staan.
- [ ] Kies een rustig moment: dinsdagochtend, niet vrijdagmiddag en niet vlak
      voor sluitingstijd.

**De week erna**

- [ ] Het nieuwe adres aanmelden bij Google Search Console en de sitemap
      indienen
- [ ] In het Google Bedrijfsprofiel kijken of de link naar de site nog klopt
- [ ] Pas als alles een paar weken goed gaat: de oude hosting opzeggen

---

## De mail aan Creative Steps

> **Onderwerp:** Website verhuizen naar nieuwe hosting - DNS aanpassen
>
> Goedemiddag,
>
> Wij zijn Oogcontact bij Gerard in Groningen. Jullie hosten onze huidige
> website op oogcontactbijgerard.nl.
>
> We hebben een nieuwe website laten bouwen. Die draait bij Vercel en staat
> klaar; we willen het domein er nu naartoe laten wijzen. Zouden jullie ons
> daarbij kunnen helpen?
>
> Wat er moet gebeuren: de DNS-regels voor de website aanpassen naar wat Vercel
> aangeeft. In de bijlage staat een schermafdruk uit Vercel met de precieze
> waarden, voor `oogcontactbijgerard.nl` en voor `www.oogcontactbijgerard.nl`.
>
> **Belangrijk:** onze e-mail loopt over ditzelfde domein. Graag alleen de
> website-regels aanpassen en de mailinstellingen (MX en de bijbehorende
> TXT-regels) ongewijzigd laten.
>
> Een paar vragen daarbij:
>
> 1. Beheren jullie het domein zelf, of staat het bij een andere partij? In dat
>    laatste geval horen we graag waar we moeten zijn.
> 2. Kunnen jullie de huidige DNS-instellingen bewaren of voor ons exporteren,
>    zodat we terug kunnen als er iets niet goed gaat?
> 3. Wanneer schikt het jullie? Wij hebben het liefst een rustig moment op een
>    doordeweekse ochtend.
>
> De oude hosting mag nog even blijven staan; die zeggen we pas op als de
> nieuwe site een paar weken goed draait.
>
> Alvast bedankt.
>
> Met vriendelijke groet,
> Gerard en Gerda Bugel
> Oogcontact bij Gerard, Overwinningsplein 100, Groningen
> KvK 82055882

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
- [ ] Een Lighthouse-rapport op de laatste preview

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
