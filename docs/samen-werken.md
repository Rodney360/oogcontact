# Met z'n tweeën aan de site werken

Deze handleiding is voor het moment dat er een tweede persoon meedoet, met een
eigen account. Je doet dit één keer; daarna werkt het gewoon.

Er staan twee soorten stappen in:

- **Jij doet dit** — jij bent eigenaar van de repository en van Vercel.
- **Hij doet dit** — de nieuwe persoon, op zijn eigen computer of telefoon.

Reken op een half uur, waarvan het meeste wachten is.

---

## Waarom eerst iets rechtgezet moet worden

Op dit moment is er **één branch**, en die is tegelijk de live site. Zolang je
alleen werkt gaat dat goed. Met z'n tweeën gaat het gegarandeerd mis:

- jullie schrijven allebei in hetzelfde bestand en overschrijven elkaar;
- elke opgeslagen wijziging staat meteen op de echte site, zonder dat iemand
  er eerst naar heeft kunnen kijken.

Stap 1 en 2 hieronder zetten dat recht. **Doe die eerst**, vóór je iemand
toegang geeft. Het kost vijf minuten en het scheelt een hoop gedoe.

---

## Stap 1 — Een `main`-branch maken (jij, 2 minuten)

`main` wordt de live site. Al het andere werk gebeurt op losse branches die
daar pas na een controle in komen.

1. Ga naar <https://github.com/Rodney360/oogcontact/branches>.
2. Klik rechtsboven op **New branch**.
3. Naam: `main`. Source: de branch die er nu staat
   (`claude/confident-allen-klr376`).
4. Klik **Create new branch**.
5. Ga naar **Settings → General**. Bij **Default branch** staat nu nog de oude
   branch. Klik op het pijltjes-icoon, kies `main`, bevestig.

> Waarom dit moet: de automatische controle op GitHub (lint, tests, contrast)
> is al ingesteld om te draaien bij elke pull request en bij elke wijziging op
> `main`. Zonder `main` slaat hij een deel over.

---

## Stap 2 — Live zetten en beschermen (jij, 5 minuten)

**2a. Vercel laten weten wat de live site is.**

1. Ga naar je project op <https://vercel.com>.
2. **Settings → Git**.
3. Bij **Production Branch** zet je `main`.
4. Opslaan.

Vanaf nu: alles op `main` gaat live, en elke andere branch krijgt automatisch
een eigen preview-link. Dat is precies wat je wilt — dan kun je eerst kijken.

**2b. Zorgen dat er niets per ongeluk live gaat.**

Dit is het enige stukje GitHub waar je echt even moet opletten: het formulier
staat vol met vinkjes, en de meeste moet je juist *niet* aanzetten. Hieronder
staat precies wat je doet.

Ga naar <https://github.com/Rodney360/oogcontact/settings/branches>.

GitHub laat je een van twee schermen zien. Kijk welke tekst je ziet:

- Zie je een knop **Add branch protection rule** → volg **variant A**.
- Zie je alleen **Rulesets** of **New ruleset** → volg **variant B**.

---

### Variant A — "Add branch protection rule"

Klik op **Add branch protection rule**. Je krijgt één lange pagina.

**Bovenaan: Branch name pattern**

Typ: `main`

Meer niet. Geen sterretjes, geen slashes.

**Daaronder: een lijst vinkjes.** Loop hem van boven naar beneden langs:

| Wat er staat | Wat je doet |
|---|---|
| Require a pull request before merging | **Aanvinken** |
| ↳ Require approvals | **Uitvinken** (zie de waarschuwing hieronder) |
| ↳ Dismiss stale pull request approvals… | Laat staan |
| ↳ Require review from Code Owners | Laat staan |
| ↳ Require approval of the most recent… | Laat staan |
| ↳ Restrict who can dismiss pull request reviews | Laat staan |
| ↳ Allow specified actors to bypass… | Laat staan |
| Require status checks to pass before merging | **Voorlopig overslaan** (zie onderaan) |
| Require conversation resolution before merging | **Aanvinken** |
| Require signed commits | Laat staan |
| Require linear history | Laat staan |
| Require deployments to succeed before merging | Laat staan |
| Lock branch | Laat staan |
| Do not allow bypassing the above settings | Laat staan |
| Restrict who can push to matching branches | Laat staan |
| Allow force pushes | Laat staan (uit) |
| Allow deletions | Laat staan (uit) |

Klik onderaan op **Create** (of **Save changes**).

> **Waarschuwing bij "Require approvals".** Zodra je *Require a pull request*
> aanvinkt, zet GitHub daaronder vaak vanzelf *Require approvals* aan, met 1
> goedkeuring. Dat klinkt logisch, maar je mag je eigen pull request niet
> goedkeuren. Werk je alleen, dan zit je daarmee klem. Zet hem dus uit, of zet
> het getal op **0**. Zodra er een tweede persoon meewerkt kun je hem alsnog
> op 1 zetten — dan kijken jullie elkaars werk na, en dat is precies de
> bedoeling.

---

### Variant B — "Rulesets"

1. **New ruleset → New branch ruleset**.
2. **Ruleset Name**: `Beschermde main`
3. **Enforcement status**: zet op **Active**.
4. **Bypass list**: laat leeg.
5. **Target branches** → **Add target** → **Include default branch**.
6. Daaronder de lijst **Rules**:

| Wat er staat | Wat je doet |
|---|---|
| Restrict creations | Laat staan |
| Restrict updates | Laat staan |
| Restrict deletions | **Aanvinken** |
| Require linear history | Laat staan |
| Require deployments to succeed | Laat staan |
| Require signed commits | Laat staan |
| Require a pull request before merging | **Aanvinken** |
| ↳ Required approvals | Zet op **0** |
| ↳ Dismiss stale reviews on push | Laat staan |
| ↳ Require review from Code Owners | Laat staan |
| ↳ Require approval of the most recent push | Laat staan |
| ↳ Require conversation resolution | **Aanvinken** |
| Require status checks to pass | **Voorlopig overslaan** |
| Block force pushes | **Aanvinken** |
| Require code scanning results | Laat staan |

7. Klik onderaan op **Create**.

---

### De controles pas later aanzetten

*Require status checks to pass* laat je nu nog met rust. Dat vinkje heeft een
zoekveldje waarin je moet aanwijzen wélke controles moeten slagen — en die
verschijnen daar pas nadat ze één keer gedraaid hebben.

Dus:

1. Nu: de regel aanmaken zonder dat vinkje.
2. Bij de eerstvolgende pull request draait de controle voor het eerst.
3. Daarna kom je hier terug (**Edit** bij de regel), vinkt **Require status
   checks to pass** aan, en kiest in het zoekveldje:
   - `Lint, typecheck, contrast en tests`
   - `Playwright`
4. Opslaan.

### Let op: op dit account wordt de regel niet afgedwongen

Bij het aanmaken meldt GitHub dit:

> Your rulesets won't be enforced on this private repository until you move to
> GitHub Team organization account.

Dat klopt en het is niet op te lossen met een vinkje. Op een **privé**-repository
onder een gewoon persoonlijk account doet GitHub niets met deze regels. De
ruleset staat er wel, hij slaapt alleen.

**Wat je daardoor mist, en wat niet:**

| | Werkt het? |
|---|---|
| Wijzigen via een pull request | ja |
| Preview-link per branch van Vercel | ja |
| De controle draait op elke pull request | ja |
| Groen of rood zien vóór je samenvoegt | ja |
| GitHub die je tegenhoudt als het rood is | **nee** |

Je ziet dus nog steeds alles; je wordt alleen niet fysiek gestopt. Het verschil
is een vangnet, niet de werkwijze zelf.

**De afspraak die het vangnet vervangt.** Zolang dit zo is, geldt gewoon:

1. Niemand duwt rechtstreeks naar `main`. Alles gaat via een pull request.
2. Vóór je op **Merge** drukt kijk je naar het blok onderaan de pull request.
   Staat daar een groen vinkje bij **All checks have passed**, dan mag het.
   Staat er een rood kruisje, dan niet — hoe klein de wijziging ook lijkt.
3. Rood? Klik op **Details**, plak de foutmelding in Claude en vraag hem het
   op te lossen.

**Wil je het vangnet er alsnog bij?** Twee manieren:

- De repository **openbaar** maken. Dan worden rulesets gratis afgedwongen.
  Maar dan kan iedereen ook de originele foto's en het complete archief van de
  oude site zien. Geen sleutels — die staan in Vercel — maar het is wel
  materiaal van Gerard en Gerda. Dat is hun beslissing.
- **Betalen** voor GitHub Team. Zie <https://github.com/pricing>.

Ga je later alsnog over, dan hoef je niets opnieuw in te stellen: de ruleset
staat er al en begint vanzelf te werken.

### Hoe je controleert dat het werkt

Ga naar <https://github.com/Rodney360/oogcontact/branches>. Staat er achter
`main` een schildje of het woord **Protected**, dan wordt de regel afgedwongen.
Staat dat er niet, dan slaapt hij nog — zie hierboven.

---

## Stap 3 — Hem toegang geven tot de code (jij, 2 minuten)

Hij heeft een GitHub-account nodig. Heeft hij dat niet, dan maakt hij er eerst
een aan op <https://github.com/signup> — gratis, twee minuten.

**Wat je eerst nodig hebt:** zijn **GitHub-gebruikersnaam**. Niet zijn
weergavenaam ("Gerard Bugel") en niet zijn e-mailadres — zoeken op e-mail werkt
meestal niet, omdat dat standaard verborgen staat.

Hij vindt zijn gebruikersnaam zo: inloggen op github.com, rechtsboven op zijn
profielfoto klikken, en bovenin het uitklapmenu staat "Signed in as **xxx**".

1. Ga naar <https://github.com/Rodney360/oogcontact/settings/access>.
2. Klik op de groene knop **Add people**.
3. Er opent een venstertje met een zoekveld. Typ zijn gebruikersnaam.
4. **Onder het zoekveld klapt een regeltje uit** met zijn profielfoto en
   gebruikersnaam. Daar klik je op. (Geen aparte pagina; het verschijnt in
   hetzelfde venstertje terwijl je typt. Komt er niets: typ minstens drie
   letters, en controleer de spelling.)
5. Klik op **Add [naam] to this repository**.

Hij krijgt een uitnodiging per mail. **Die moet hij aannemen**, anders werkt de
rest niet. Komt de mail niet aan, dan kan hij ook rechtstreeks naar
<https://github.com/Rodney360/oogcontact/invitations>. Een uitnodiging verloopt
na zeven dagen.

> **Je krijgt geen keuze tussen rollen, en dat hoort zo.** Deze repository staat
> onder een persoonlijk account. De rollen Read / Triage / Write / Maintain /
> Admin bestaan alleen bij repositories van een organisatie. Wie je hier
> toevoegt krijgt schrijfrechten: code lezen, branches maken, pull requests
> openen en samenvoegen. Wat hij *niet* kan: de instellingen van de repository
> aanpassen of hem verwijderen. Dat is precies genoeg.
>
> Zie je tóch een lijst met rollen, kies dan **Write**.

---

## Stap 4 — Hem de preview laten zien (jij, 2 minuten)

**Dit is niet optioneel.** De preview-links van Vercel zitten achter een
inlogscherm: wie niet bij het Vercel-project kan, krijgt een loginpagina in
plaats van de site. Zonder dit kan hij dus nooit kijken naar wat hij zelf
gemaakt heeft voordat het live gaat.

Kies één van twee:

**A. Hem toevoegen aan Vercel** (als hij toch aan de site gaat werken)

1. Ga naar je project op <https://vercel.com>.
2. **Settings → Members** (of bovenin bij je team → **Members**).
3. **Invite** → zijn e-mailadres → rol **Member**.

> **Let op:** wie bij Vercel kan, kan ook bij de API-sleutels (de online agenda,
> de e-mail). Geef dit alleen aan iemand die dat mag zien.

**B. Het inlogscherm van de previews uitzetten** (als hij er verder niets te
zoeken heeft)

1. Project → **Settings → Deployment Protection**.
2. Bij **Vercel Authentication**: uitzetten, of op *alleen productie* zetten.
3. Opslaan.

Daarna is elke preview-link te openen door iedereen die hem heeft. Dat is voor
deze site geen ramp — het is toch een openbare winkelsite — maar bedenk dat een
preview ook werk kan bevatten dat nog niet af is, en dat de boekingsmodule en
het formulier daar in testmodus staan.

> Wil je alleen af en toe iets laten zien zonder een van beide? Op een
> deployment in Vercel zit ook een **Share**-knop, die een tijdelijke link
> maakt waar geen login voor nodig is.

---

## Stap 5 — Hij koppelt zijn Claude-account aan GitHub (hij, 5 minuten)

Dit doet hij zelf, met zijn eigen account.

1. Hij logt in op <https://claude.ai>.
2. Hij gaat naar <https://claude.ai/connect-github> en koppelt zijn
   GitHub-account.
3. Tijdens die koppeling vraagt GitHub voor welke repositories Claude mag
   werken. Hij kiest **Rodney360/oogcontact** (of "All repositories").
4. Werkt stap 3 niet omdat de app nog niet op de repository staat, dan
   installeer jij hem eenmalig:
   <https://github.com/apps/claude/installations/select_target> → kies het
   account `Rodney360` → vink `oogcontact` aan.

---

## Stap 6 — Hij begint een sessie (hij, 2 minuten)

**Makkelijkste manier: in de browser.** Niets installeren.

1. Hij gaat naar <https://claude.ai/code>.
2. Hij kiest de repository `Rodney360/oogcontact`.
3. Hij typt wat hij veranderd wil hebben, in gewone taal.

De omgeving installeert zichzelf: er staat een startscript in de repo
(`.claude/hooks/sessie-start.sh`) dat de pakketten en de testbrowser klaarzet.
Hij hoeft niets te weten van Node of npm.

**Liever op zijn eigen computer?** Dan volgt hij `docs/starten-op-je-mac.md`.
Dat is dezelfde handleiding die jij gebruikt hebt.

---

## Stap 7 — Alleen tekst en foto's aanpassen? Dan hoeft dit allemaal niet

Nieuwsberichten, een mededeling bovenaan, afwijkende openingstijden en de
merken gaan via het beheerscherm op `/keystatic`. Daar is geen code voor nodig
en ook geen Claude-account — alleen een GitHub-account met toegang tot de
repository (stap 3).

Zie `docs/handleiding-beheer.md`.

---

## Prompts om te kopiëren

Twee stukken tekst die je vader (of jij) in Claude kan plakken. Ze schelen
uitleg, en ze houden de afspraken uit deze handleiding op één plek.

### De standaardstart — plak dit bij elke nieuwe sessie

```text
Je werkt aan de website van Oogcontact bij Gerard, in de repository
Rodney360/oogcontact. Lees eerst CLAUDE.md.

Begin zo:
1. Haal de nieuwste main binnen.
2. Maak daarvandaan een nieuwe branch voor dit ene onderwerp.

Wat ik veranderd wil hebben:

>>> HIER IN GEWONE TAAL OPSCHRIJVEN WAT ER ANDERS MOET <<<

Waar ik je aan houd:
- Verzin geen feiten. Merknamen, prijzen, openingstijden, keurmerken en
  diensten komen alleen van de huidige site, van de online agenda, of van mij.
  Weet je iets niet zeker: vraag het mij. Krijg je geen antwoord, zet er dan
  een TODO bij en noteer het in docs/open-punten.md.
- Overal "je" en "jij", nooit "u".
- Tekst nooit kleiner dan 16 pixels.
- Verander nooit wat er op een foto staat, en schrijf altijd een goede
  Nederlandse alt-tekst.
- Leg in gewone taal uit wat je gedaan hebt. Ik ben geen programmeur.

Als je klaar bent:
1. Draai `npm run check` en laat me zien wat eruit komt. Lukt bouwen of de
   browsertests niet in deze omgeving, zeg dat dan gewoon - de controle op
   GitHub vangt dat af.
2. Commit en push naar je eigen branch.
3. Open een pull request en geef me de preview-link van Vercel erbij.
4. Voeg hem pas samen als het vinkje van de controle op GitHub groen is,
   en pas nadat iemand de preview bekeken heeft.
5. Schrijf twee tot vier regels in docs/WERKLOG.md.
```

### De ontbrekende gegevens invullen — een klus die alleen Gerard kan doen

```text
Lees docs/open-punten.md. Daarin staat welke gegevens er nog ontbreken op de
site: dingen die alleen ik weet, zoals het KvK-nummer en welke merken we
voeren.

Loop dat met mij door. Stel me één vraag tegelijk, in gewone taal, en zet mijn
antwoord daarna op de juiste plek in de site. Weet ik iets niet, sla het dan
over en laat de TODO staan - verzin niets.

Als we klaar zijn: `npm run check`, pushen naar een eigen branch, een pull
request openen met de preview-link erbij, en twee tot vier regels in
docs/WERKLOG.md. Pas samenvoegen als de controle groen is.
```

---

## Hoe je daarna samenwerkt zonder elkaar in de weg te zitten

**Eén onderwerp per branch.** Niet "allerlei kleine dingen", maar
"contactpagina" of "nieuwe winkelfoto's". Kleine wijzigingen zijn makkelijker
na te kijken en makkelijker terug te draaien.

**Begin altijd bij de nieuwste `main`.** Ook als je net klaar bent met iets
anders. In Claude Code: zeg "haal eerst de nieuwste main binnen". Op je Mac:

```bash
git checkout main
git pull origin main
```

**Werk nooit tegelijk in hetzelfde bestand.** Zeg even tegen elkaar waar je
mee bezig bent. Overlap je toch, dan meldt GitHub een conflict — vervelend,
niet gevaarlijk, en Claude lost het voor je op.

**Kijk naar elkaars preview voordat er iets live gaat.** Bij elke pull request
zet Vercel automatisch een link neer. Die open je op je telefoon én op een
groot scherm.

**Schrijf na elke sessie twee tot vier regels in `docs/WERKLOG.md`.** Datum,
wie, wat er veranderd is, wat er nog openstaat. Dat is hoe je van elkaar ziet
wat er gebeurd is.

---

## Live zetten zonder dat Dennis erbij hoeft

Dit kwam er op 20 september meteen uit, de eerste keer dat werk van Gerard
samengevoegd werd. De wijziging stond wel in `main`, maar kwam niet op de live
site. In Vercel stond die regel op **Blocked**.

**Wat er gebeurde.** De repository is privé. Vercel bouwt een privé-repository
alleen als de **schrijver van de commit** ook toegang heeft tot het project op
Vercel. Op het gratis abonnement (Hobby) is dat precies één persoon: de
eigenaar. En bij "Squash and merge" zet GitHub de opener van de pull request
als schrijver van de nieuwe commit op `main`. Vandaar dat de preview van Gerard
wél klaarkwam en het live zetten daarna niet.

**Hoe het nu geregeld is.** Het live zetten gebeurt niet meer door Vercel zelf,
maar door GitHub, met een **sleutel in plaats van een naam**. Daardoor maakt het
niet meer uit wie de wijziging gemaakt of samengevoegd heeft. Gerard kan dus
gewoon zelf samenvoegen.

Het zit in twee bestanden:

- **`.github/workflows/ci.yml`**, de taak **"Live zetten"**. Die draait alleen
  bij een wijziging op `main`, en alleen als de controle en de browsertests
  allebei groen zijn. Een kapotte versie gaat dus nooit meer live — dat kon
  eerst wél.
- **`vercel.json`** zet het automatische live zetten door Vercel zelf uit voor
  `main` (`git.deploymentEnabled`), zodat het niet twee keer gebeurt.

Previews blijven precies zoals ze waren: die maakt Vercel nog gewoon zelf, bij
elke branch en elke pull request.

**Wat je ervoor terugkrijgt en wat het kost:** een wijziging staat nu een paar
minuten later live dan vroeger, want eerst draait de hele controle en pas
daarna het bouwen. Dat is de prijs voor twee dingen: iedereen kan live zetten,
en er gaat nooit meer een rode versie de deur uit.

### Eenmalig instellen (Dennis, 2 minuten)

Er is nog één ding nodig, en alleen de eigenaar van het Vercel-account kan het
doen. Daarna nooit meer.

De twee kenmerken van het project (`VERCEL_ORG_ID` en `VERCEL_PROJECT_ID`)
staan met de waarde erbij in `.github/workflows/ci.yml`. Dat zijn geen
wachtwoorden: ze staan in het adres van je Vercel-pagina en in de berichtjes
die Vercel bij elke pull request achterlaat, en zonder de sleutel hieronder kun
je er niets mee. Zet ze **niet** ook als secret — dat heeft geen nut en het
ging de eerste keer juist daarop mis.

Wat er nog mist is de **sleutel**. Die hoort in de kluis van GitHub, niet in een
bestand: wat eenmaal in de repository staat, blijft voor altijd in de
geschiedenis staan, ook als je het later weghaalt.

**1. Maak de sleutel aan bij Vercel.**

Ga naar <https://vercel.com/account/tokens> → **Create Token**.

| Veld | Wat je invult |
|---|---|
| Token Name | `github-actions-oogcontact` |
| Scope | je eigen account (`projects-c1cc`) |
| Expiration | `No Expiration`, of een jaar als je hem liever ververst |

Klik **Create**. Je ziet de sleutel **één keer** — laat het scherm open staan.

**2. Zet hem in de kluis van GitHub.**

Open in een tweede tabblad
<https://github.com/Rodney360/oogcontact/settings/secrets/actions> →
**New repository secret**:

| Veld | Wat je invult |
|---|---|
| Name | `VERCEL_TOKEN` |
| Secret | de sleutel uit stap 1 |

Let op de naam: hoofdletters en een liggend streepje, precies zo. Klik
**Add secret**.

**3. Klaar.** De eerstvolgende wijziging die op `main` komt, gaat er vanzelf
mee live. Je ziet het gebeuren op
<https://github.com/Rodney360/oogcontact/actions> — onderaan de rij staat dan
**Live zetten**, met het adres van de nieuwe versie erbij.

> Verandert de sleutel ooit, of is hij per ongeluk ergens anders terechtgekomen
> — in een chat, een mailtje, een schermafdruk — verwijder hem dan bij Vercel en
> maak een nieuwe. Een sleutel geeft volledige toegang tot het account: deployen,
> projecten aanpassen en de omgevingsvariabelen uitlezen. Het vervangen kost een
> minuut en er gaat niets van verloren.

### Als het toch niet lukt

| Wat je ziet | Wat je doet |
|---|---|
| "VERCEL_TOKEN is nog niet ingesteld" | Stap 2 is niet af, of er staat een typefout in de naam. |
| "Not authorized" of "Forbidden" | De sleutel is verlopen, ingetrokken of hoort bij het verkeerde account. Maak een nieuwe (stap 1) en werk `VERCEL_TOKEN` bij. |
| "Could not retrieve Project Settings" | De twee nummers in `ci.yml` kloppen niet meer, bijvoorbeeld omdat het project hernoemd of verplaatst is. Haal ze op in Vercel onder Settings → General. Staan ze ook als secret, haal die dan weg: een secret wint niet meer, maar verwarring blijft. |
| Je wilt het opnieuw proberen zonder iets te veranderen | Ga naar <https://github.com/Rodney360/oogcontact/actions>, kies links **Controle**, klik rechtsboven op **Run workflow** en kies `main`. |
| De taak "Live zetten" draait helemaal niet | Dan is de controle of zijn de browsertests rood. Los dat eerst op — zo hoort het te werken. |

### Als je er helemaal vanaf wilt

De regel van Vercel geldt alleen voor **privé**-repositories. Maak je de
repository openbaar, dan vervalt hij vanzelf en kan deze hele constructie weer
weg. Er staan geen sleutels of wachtwoorden in de repo — die staan in Vercel —
dus dat kan veilig. Bijkomend voordeel: de ruleset op `main` (zie hierboven)
gaat dan ook echt werken. Nadeel: iedereen kan de code, de teksten en het
archief van de oude site inzien. Dat is iets om met Gerard en Gerda te
bespreken.

---

## Wat je vooral niet moet doen

- **Geen sleutels in de repo.** Wachtwoorden en API-sleutels horen in Vercel,
  onder Settings → Environment Variables. Nooit in een bestand dat meegaat in
  een commit. Zie `.env.example`.
- **Niet rechtstreeks naar `main` duwen.** Na stap 2b kan dat ook niet meer.
- **Niets uitzetten om sneller te kunnen werken.** De controles bestaan omdat
  ze dingen vinden die je zelf niet ziet.

---

## Als iets niet werkt

| Wat je ziet | Wat er aan de hand is |
|---|---|
| "Repository not found" in Claude | De uitnodiging van stap 3 is nog niet aangenomen, of de Claude-app staat nog niet op de repository (stap 5, punt 4). |
| Claude ziet de repository niet in de lijst | Opnieuw koppelen via <https://claude.ai/connect-github> en daarbij `oogcontact` aanvinken. |
| De controle op GitHub is rood | Klik op de rode kruisjes bij de pull request; daar staat wat er misging. Plak dat in Claude en vraag hem het op te lossen. |
| Geen preview-link bij de pull request | Stap 2a is nog niet gedaan, of Vercel is nog aan het bouwen (een paar minuten; de foto's worden opnieuw verwerkt). |
| Conflict bij het samenvoegen | Jullie hebben in hetzelfde bestand gewerkt. Vraag Claude: "los het conflict met main op". |
| Een regel in Vercel staat op **Blocked** | Dat hoort niet meer voor te komen. Gebeurt het toch: zie "Live zetten zonder dat Dennis erbij hoeft" hierboven. |
| De wijziging staat in `main`, maar de live site verandert niet | Kijk op <https://github.com/Rodney360/oogcontact/actions> bij de bovenste regel of de taak **Live zetten** groen is. Is hij rood, klik erop: daar staat wat er misging. Is hij er niet, dan was de controle rood. |
