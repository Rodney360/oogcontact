# Live gaan — de checklist

Eén papiertje om af te vinken. Alles wat hier niet staat, kan ook ná de
lancering. De uitgebreide uitleg per punt staat in `docs/open-punten.md`.

Bijgewerkt op 1 oktober 2026.

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

### 2. De agenda in OO2 gelijktrekken — Gerard. **Nu het belangrijkst.**

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

Doen als laatste, pas als Gerard en Gerda zeggen dat alles goed is.

Dit kan alleen de eigenaar van het Vercel-project. Gerard kan er niet bij; zie
`docs/vercel-toegang.md` voor waarom dat zo is en wat de keuzes zijn.

Het domein draait nu nog op de oude WordPress-site bij Creative Steps
(nagemeten op 22 september: nginx, PHP, Plesk). Er is dus nog niets verhuisd.

**Nagemeten op 1 oktober 2026.** `oogcontactbijgerard.nl` en
`www.oogcontactbijgerard.nl` wijzen allebei naar `93.119.12.33`. Dat is geen
adres van Vercel: Vercel antwoordt vanaf `216.198.79.x`, `64.29.17.x` of
`76.76.21.x`. Creative Steps heeft dus wél iets gezet, maar het wijst niet naar
Vercel. Een verwijzing kan er een paar uur over doen om overal bekend te zijn,
dus meet het nog eens na voordat je ze erop aanspreekt.

**Waarom een verwijzing alleen niet genoeg is.** Vercel kijkt bij elk bezoek
naar de domeinnaam in het verzoek en zoekt daar het bijbehorende project bij.
Staat het domein niet ín het project, dan kent Vercel die naam niet en krijgt de
bezoeker een foutpagina van Vercel — hoe goed de DNS ook staat. Datzelfde
toevoegen zet ook het SSL-certificaat in gang. **Dus eerst Vercel, dan de DNS**,
en niet andersom.

**In Vercel — een kwartier, Dennis**

- [ ] Settings → **Domains** → `oogcontactbijgerard.nl` toevoegen
- [ ] En ook `www.oogcontactbijgerard.nl` toevoegen. Vercel stuurt de een naar
      de ander door; welke kant op mag je zelf kiezen
- [ ] Vercel toont daarna per domein de **DNS-regels** die nodig zijn. Neem die
      over of maak er een schermafdruk van — die gaan naar Creative Steps
- [ ] Settings → **Environment Variables** → `NEXT_PUBLIC_SITE_URL` op
      `https://oogcontactbijgerard.nl`. Zonder dit blijven de sitemap, de
      deelplaatjes en de verwijzingen voor Google naar `vercel.app` wijzen
- [ ] **Opnieuw laten bouwen** (Deployments → de bovenste → Redeploy). Een
      instelling telt pas mee bij een nieuwe bouw

**Bij Creative Steps**

- [ ] De DNS-regels laten omzetten. De mail die je kunt overnemen staat
      verderop in deze checklist, onder "De mail aan Creative Steps"
- [ ] **Alleen de A- en CNAME-regels.** De MX-regels en de bijbehorende
      TXT-regels met rust laten: de e-mail van de winkel loopt over hetzelfde
      domein en gaat er anders uit

**Daarna controleren**

- [ ] `https://oogcontactbijgerard.nl` toont de nieuwe site
- [ ] `https://www.oogcontactbijgerard.nl` komt op hetzelfde uit
- [ ] Een paar oude adressen nalopen, bijvoorbeeld
      <https://oogcontactbijgerard.nl/afwijkende-openingstijden/> — die hoort op
      het nieuwsoverzicht uit te komen
- [ ] De agenda op telefoon én laptop
- [ ] Ververs hard (Ctrl+Shift+R of Cmd+Shift+R). Je browser onthoudt de oude
      site langer dan je denkt

- [ ] Liever op een rustig moment: er zitten een paar minuten tussen waarin de
      site niet bereikbaar is


### 4. Het beheerscherm aan GitHub koppelen — Dennis

**Zonder dit kunnen Gerard en Gerda niets opslaan.** Het beheerscherm op
`/keystatic` schrijft dan in de bestanden op de computer waar de site draait,
en op Vercel bestaat die maar heel even en is hij alleen-lezen. Opslaan doet
dan niets, zónder foutmelding.

De site vangt dat nu af: is de koppeling er niet, dan toont `/keystatic` een
melding "Nog niet gekoppeld" in plaats van een scherm dat doet alsof het werkt.
Dat is een vangnet, geen oplossing — dit moet dus nog gebeuren.

**1. Zet de repository klaar in Vercel.**

Settings → Environment Variables → Add New:

| Veld | Invullen |
|---|---|
| Key | `KEYSTATIC_GITHUB_REPO` |
| Value | `Rodney360/oogcontact` |
| Type | **Config** (geen wachtwoord) |
| Environments | Production |

Daarna **Deployments → ⋯ → Redeploy**.

**2. Laat Keystatic de GitHub-app voor je maken.**

Ga naar `https://oogcontactbijgerard.nl/keystatic`. Je krijgt nu een knop om
een GitHub-app aan te maken. Die regelt zelf de juiste instellingen:

- rechten: **Contents** schrijven, **Metadata** lezen, **Pull requests** lezen
- het terugkeeradres `https://oogcontactbijgerard.nl/api/keystatic/github/oauth/callback`
- inloggen met GitHub meteen bij het installeren

Installeer de app daarna op `Rodney360/oogcontact`.

**3. Zet de vier waarden in Vercel.** Keystatic laat ze na afloop zien:

| Key | Type |
|---|---|
| `KEYSTATIC_GITHUB_CLIENT_ID` | Secret |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Secret |
| `KEYSTATIC_SECRET` | Secret |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | **Config** — die begint met `NEXT_PUBLIC_` en komt dus in de browser |

Daarna weer **Redeploy**.

**4. Controleren.** Open `/keystatic`, log in met GitHub, verander iets kleins
(bijvoorbeeld een punt in de mededeling), klik **Save**, en kijk of er een
nieuwe commit in de repo verschijnt. Zo ja: het werkt, en Gerard en Gerda
kunnen zelf aan de slag.

- [ ] `KEYSTATIC_GITHUB_REPO` gezet en opnieuw gebouwd
- [ ] GitHub-app aangemaakt en geïnstalleerd op de repository
- [ ] De vier waarden in Vercel gezet en opnieuw gebouwd
- [ ] Een testwijziging opgeslagen en teruggezien als commit

*Lukt de knop in stap 2 niet, dan kun je de app ook met de hand aanmaken op
GitHub → Settings → Developer settings → GitHub Apps → New GitHub App, met
precies de rechten en het terugkeeradres hierboven, webhook uit, en "Request
user authorization (OAuth) during installation" aan.*


---

## De mail aan Creative Steps

Versturen pas nadat de twee domeinen in Vercel staan — dan heb je de regels die
hieronder ingevuld moeten worden. Vercel noemt ze per domein op het
Domains-scherm; neem ze letterlijk over en verzin ze niet zelf, want ze
verschillen per project.

> Beste Creative Steps,
>
> Dank voor het meedenken, fijn dat jullie meteen reageren.
>
> Onze nieuwe website is klaar en komt te draaien bij Vercel. Daarvoor moet de
> DNS van `oogcontactbijgerard.nl` verhuizen. Een SSL-certificaat hoeven jullie
> niet te regelen: Vercel maakt en vernieuwt dat automatisch zodra het domein
> naar hen wijst. We kunnen het ook niet aanleveren, want de sleutel blijft bij
> Vercel. Scheelt jullie in elk geval werk.
>
> Twee regels zijn het:
>
> - `oogcontactbijgerard.nl` → TODO: de regel uit het Domains-scherm van Vercel
> - `www.oogcontactbijgerard.nl` → TODO: de regel uit het Domains-scherm van
>   Vercel
>
> Het websiteverkeer loopt daarna rechtstreeks naar Vercel en niet meer via
> jullie server. Mochten jullie overwegen het via jullie server door te sturen:
> dat hoeft wat ons betreft niet, het mag gerust rechtstreeks. Maar hoor het
> graag als jullie daar anders over denken.
>
> Eén ding waar ik jullie aandacht voor wil vragen: onze e-mail loopt over
> hetzelfde domein. Zouden alleen die twee website-regels aangepast kunnen
> worden, en de MX-regels met de bijbehorende TXT-regels ongewijzigd blijven?
> Dan houden we `info@oogcontactbijgerard.nl` gewoon draaiend.
>
> Voor jullie techneut staat de achtergrond hier:
> <https://vercel.com/docs/domains/working-with-ssl>
>
> Alvast bedankt, en laat vooral weten wanneer het jullie schikt.
>
> Met vriendelijke groet,
> Gerard en Gerda Bugel
> Oogcontact bij Gerard
> Overwinningsplein 100, Groningen

Wat er daarna gebeurt: Vercel ziet de nieuwe regels zelf, zet het certificaat
klaar — meestal binnen een paar minuten, soms een uur — en het domein komt op
"Valid Configuration" te staan. In dat tussenpoosje kan een browser kort
waarschuwen over een onveilige verbinding. Dat lost zichzelf op; ververs even.

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
