# Vercel: wie is de eigenaar, en waarom je previews niet kunt openen

Kort de situatie, want hier lopen twee dingen door elkaar:

- De **repository** staat op GitHub onder `Rodney360`. Gerard werkt daar als
  medewerker en kan gewoon pull requests samenvoegen. Daar is niets mis mee.
- Het **Vercel-project** staat in het team `projects-c1cc`. Dat zie je aan elke
  preview-link: `oogcontact-git-...-projects-c1cc.vercel.app`.
- Gerard logt in op Vercel met het account `g-bugel-6898`. Dat account zit niet
  in dat team.

Daardoor gebeurt dit: je opent een preview-link, je bent ingelogd bij Vercel,
en je krijgt alsnog "geen toegang". Niet omdat de link stuk is, maar omdat
preview-deploys standaard achter een slot zitten (*Deployment Protection*), en
dat slot alleen openzwaait voor leden van het team dat het project bezit.

Het komt steeds terug omdat het slot per deployment werkt. Een **Share**-link
helpt één keer, voor één bouw; de volgende push zit weer dicht. Alleen de
instelling op het project geldt voor alles wat erna komt.

---

## De snelle oplossing (twee minuten, door de eigenaar)

Iemand die bij het team `projects-c1cc` kan:

1. Ga naar
   <https://vercel.com/projects-c1cc/oogcontact/settings/deployment-protection>.
2. Zet **Vercel Authentication** op **Disabled** (of haal *Standard Protection*
   weg).
3. **Save**.

Daarna werkt elke preview-link, voor iedereen met de link. Die links zijn niet
te vinden via Google, maar wel openbaar. Voor deze site is dat prima: er staat
niets geheims op een preview.

## De echte oplossing: het project overzetten

Zolang het project in een ander team staat, blijft Gerard voor elk wissewasje
afhankelijk van iemand anders — voor het slot, voor de omgevingsvariabelen van
de agenda en de e-mail, en voor het domein. Als Gerard degene is die er vanaf nu
het meest in werkt, hoort het project bij zijn account.

**Wie het doet:** de eigenaar van `projects-c1cc` start het, Gerard accepteert.

1. Vercel → project **oogcontact** → **Settings → General**.
2. Helemaal onderaan: **Transfer Project**.
3. Kies als bestemming het account van Gerard (`g-bugel-6898`).
4. Gerard krijgt een verzoek en accepteert dat.

**Loop daarna deze vier dingen na**, want die willen nog weleens meeverhuizen
zonder dat ze het goed doen:

- Staan de **Environment Variables** er nog? (`EASYAPPOINTMENTS_*`,
  `RESEND_API_KEY`, `TURNSTILE_*`, `NEXT_PUBLIC_SITE_URL`.)
- Staat het **domein** `oogcontactbijgerard.nl` er nog bij, en is het geldig?
- Is de koppeling met de **GitHub-repository** nog intact? Zo niet: opnieuw
  koppelen via Settings → Git.
- Staat **Deployment Protection** uit? (Zie hierboven.)

Daarna maakt Vercel bij elke pull request weer een preview, en kan Gerard die
zelf openen.

## Lukt "Transfer Project" niet?

Dat gebeurt: Vercel laat je alleen overzetten naar een team waar je zelf in
zit. Staat Gerards account daar niet tussen, dan biedt Vercel alleen
*Create Team* aan en houdt het op.

Er is dan een weg die altijd werkt: **Gerard maakt er zelf een nieuw project
van.** Vercel bouwt gewoon opnieuw uit dezelfde repository; er hoeft niets aan
de code te veranderen.

1. Gerard logt in op <https://vercel.com> met zijn eigen account en koppelt dat
   aan GitHub.
2. **Add New → Project** → kies de repository `Rodney360/oogcontact`.
   Ziet hij hem niet staan, dan moet de Vercel-app nog toegang krijgen tot die
   repository; dat doet de eigenaar van de repository eenmalig.
3. Instellingen overnemen: framework **Next.js**, de rest kan op de standaard
   blijven staan.
4. **Environment Variables overtypen.** Die staan niet in de repo, dus haal ze
   uit het oude project: `EASYAPPOINTMENTS_*`, `RESEND_API_KEY`,
   `MAIL_AFZENDER`, `MAIL_ONTVANGER`, `TURNSTILE_*`, `NEXT_PUBLIC_SITE_URL`.
   Zie `.env.example` voor de volledige lijst.
5. **Deployment Protection uitzetten** in het nieuwe project, zodat previews
   meteen te openen zijn.
6. Laat het een keer bouwen en kijk of de site klopt op de nieuwe Vercel-URL.

**Pas als dat goed is, het domein verhuizen.** Een domein kan maar bij één
project horen:

1. Eerst in het **oude** project: Settings → Domains → `oogcontactbijgerard.nl`
   verwijderen.
2. Daarna in het **nieuwe** project: Settings → Domains → toevoegen.

Wijst het domein al naar Vercel, dan zit er een paar minuten tussen waarin de
site er niet uit ziet zoals het hoort. Doe dit dus op een rustig moment, niet
vlak voor sluitingstijd. Staat het domein nog helemaal niet bij Vercel, dan is
dit juist het makkelijkste moment om over te stappen.

**Koppel daarna het oude project los van GitHub** (Settings → Git →
Disconnect), of verwijder het. Anders bouwen straks twee projecten bij elke
push, krijg je dubbele meldingen onder elke pull request, en weet niemand meer
welke preview de goede is.

## Het live zetten strandt op dezelfde oorzaak

Sinds het live zetten via GitHub loopt (de taak "Live zetten" in
`.github/workflows/ci.yml`), mislukt die taak bij elke samenvoeging naar `main`.
De site blijft daardoor staan zoals hij is, terwijl `main` allang verder is.

Wat de uitslag op GitHub laat zien:

| Stap | Uitkomst |
|---|---|
| Kijken of de sleutel klaarstaat | gelukt - `VERCEL_TOKEN` bestaat dus |
| Instellingen van het project ophalen | **mislukt** |

De foutmelding daarbij:

```
Error: Could not retrieve Project Settings.
```

De twee kenmerken in `ci.yml` kloppen: `VERCEL_ORG_ID` en `VERCEL_PROJECT_ID`
zijn dezelfde als in de berichtjes die Vercel bij elke pull request achterlaat.
Het is dus niet de instelling maar de **sleutel** die geen toegang heeft tot het
team `projects-c1cc`. Zo'n sleutel is waarschijnlijk aangemaakt onder een
persoonlijk account; dan ziet hij het project simpelweg niet.

**De oplossing:** een nieuwe token aanmaken met dat team als bereik.

1. Vercel → **Account Settings → Tokens → Create Token**.
2. Bij **Scope** het team `projects-c1cc` kiezen, niet het persoonlijke account.
3. De token kopiëren.
4. GitHub → **Settings → Secrets and variables → Actions** → `VERCEL_TOKEN`
   bijwerken.
5. Bij de laatste mislukte run op **Re-run failed jobs** drukken. Alles wat op
   `main` staat te wachten gaat dan in één keer live.

Dit is dezelfde oorzaak als het slot op de preview-links hierboven: het project
zit in een team waar de rest niet bij kan.

## Zolang het nog niet geregeld is

Alles wat we maken gaat via een pull request naar `main`, en `main` staat live.
De productiesite heeft dat slot niet. Kijk dus gewoon op
<https://oogcontactbijgerard.nl> — ook voor de verborgen pagina
`/agenda-controle/`. Ververs wel hard (Ctrl+Shift+R), anders kijk je naar de
versie in je browsercache.

---

## Bericht dat je kunt doorsturen

> Hoi,
>
> De previews van het Vercel-project `oogcontact` kan ik niet openen. Ik ben wel
> ingelogd bij Vercel (als `g-bugel-6898`), maar het project staat in het team
> `projects-c1cc` en daar zit ik niet in. Preview-deploys staan achter
> Deployment Protection, dus ik krijg "geen toegang".
>
> Zou je twee dingen willen doen?
>
> 1. Deployment Protection uitzetten:
>    https://vercel.com/projects-c1cc/oogcontact/settings/deployment-protection
>    → Vercel Authentication → Disabled → Save.
> 2. Het project overzetten naar mijn account, zodat ik dit soort dingen
>    voortaan zelf kan: Settings → General → Transfer Project → `g-bugel-6898`.
>    Ik accepteer het verzoek dan meteen. Staat mijn account daar niet tussen
>    (je ziet dan alleen "Create Team"), laat het dan even weten — dan zet ik
>    er zelf een nieuw project naast en verhuizen we het domein daarna.
>
> Ik ga vanaf nu het meeste werk aan de site doen, dus het scheelt ons allebei
> tijd als ik er zelf bij kan.
>
> Bedankt!
