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

1. Ga naar <https://github.com/Rodney360/oogcontact/settings/access>.
2. Klik **Add people**.
3. Vul zijn GitHub-gebruikersnaam of e-mailadres in.
4. Kies rol **Write**.
5. Klik **Add**.

Hij krijgt een uitnodiging per mail. **Die moet hij aannemen**, anders werkt de
rest niet.

> **Waarom Write en niet Admin?** Met Write kan hij alles wat nodig is: code
> lezen, branches maken, pull requests openen. Admin geeft daarbovenop het
> recht om de repository te verwijderen en de beveiliging uit te zetten. Dat
> heeft hij niet nodig. Wil je later dat hij ook pull requests kan goedkeuren
> en samenvoegen, dan is **Maintain** genoeg.

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
