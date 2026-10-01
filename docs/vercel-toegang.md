# Vercel: wie kan waarbij

Bijgewerkt op 22 september 2026. Alles hieronder is op die dag nagemeten.

Kort: **het werken aan de site vraagt geen Vercel.** Alleen een handvol
instellingen doet dat, en die zijn er bijna nooit.

---

## Wat nu gewoon werkt

| | Wie kan dit | Hoe |
|---|---|---|
| Code, teksten en foto's aanpassen | Dennis én Gerard | via Claude en een pull request |
| Samenvoegen naar `main` | Dennis én Gerard | de groene knop op GitHub |
| Live zetten | gaat vanzelf | Vercel pikt `main` op, een paar minuten later staat het erop |
| Een preview openen | iedereen met de link | gewoon aanklikken |
| Nieuws, vakantiemelding, merken | Gerard en Gerda | via `/keystatic` |
| De agenda | Gerard | in OO2 zelf, dat staat los van Vercel |

Twee dingen die hier eerder als probleem stonden, zijn opgelost:

- **Previews zaten achter een inlogscherm.** Dat slot (*Deployment Protection*)
  staat uit. Nagemeten: een preview-link geeft gewoon de site terug.
- **Werk van Gerard kwam niet live.** Vercel bouwde een privé-repository alleen
  als de schrijver van de commit ook bij het Vercel-project kon. De repository
  is openbaar gemaakt en daarmee vervalt die regel. Zijn samenvoegingen gaan nu
  vanzelf live.

---

## Waarvoor je Vercel wél nodig hebt

Dit kan alleen de eigenaar van het project — op dit moment Dennis.

**Eenmalig, bij het live gaan:**

- Het domein toevoegen en de DNS-regels uitlezen die je aan Creative Steps
  doorgeeft.
- `NEXT_PUBLIC_SITE_URL` op het echte adres zetten.
- Eén keer opnieuw laten bouwen, want een instelling telt pas mee bij een
  nieuwe bouw.

De stappen staan uitgeschreven in `docs/live-gaan.md`, punt 3.

**Daarna zelden:**

- Een sleutel invullen of vervangen (de agenda, of later de e-mail).
- Een bouw die faalt en waarvan je het logboek wil lezen.
- Een versie terugdraaien.

Een paar keer per jaar, meer niet. Maar wel steeds op een moment dat het
dringend is.

---

## Gerard kan er niet bij, en overzetten kan niet

Het Vercel-project staat in `projects-c1cc`, het gratis account van Dennis.
Gerard logt in als `g-bugel-6898`. Opent hij een `vercel.com`-link van het
project, dan krijgt hij een **404** — Vercel zegt niet "geen toegang" maar doet
alsof de pagina niet bestaat. Verwarrend, maar het betekent gewoon: dit is niet
van jou.

**Het project overzetten lost dat niet op.** Vercel stelt één eis:

> *You must be an owner of the team you're transferring from, and a member of
> the team you're transferring to.*
> — <https://vercel.com/docs/projects/transferring-projects>

En een gratis account kan geen leden hebben; in de vergelijking van Vercel
staat bij **Team collaboration features** een streepje bij Hobby en *Yes* bij
Pro. Dennis kan dus nooit lid worden van Gerards account, en daarom verschijnt
dat account niet in de keuzelijst bij *Transfer Project*. Dat is geen instelling
die je aan kunt zetten; die mogelijkheid bestaat niet.

### Drie wegen, en ze zijn alle drie verdedigbaar

**1. Laten zoals het is.** Dennis doet die paar instellingen. Kost niets, en
gezien hoe weinig het er zijn is dit voorlopig prima. Nadeel: gaat er iets mis
op een moment dat Dennis er niet is, dan ligt het stil.

**2. Vercel Pro, op naam van de winkel** — ongeveer €20 per maand. Gerard maakt
het team aan en nodigt Dennis uit, Dennis zet het project over, en daarna kan
Dennis eruit. Alles verhuist mee: het domein, de sleutels, de koppeling met
GitHub, de geschiedenis, zonder dat de site eruit ligt.

**3. Gerard maakt er zelf een nieuw project van** — gratis, en makkelijker dan
het klinkt. Zie de stappen hieronder. Het project krijgt een ander
`vercel.app`-adres, en het oude project moet daarna van de repository
losgekoppeld worden; anders bouwen er twee tegelijk en weet niemand meer welke
preview de goede is.

> Hier stond eerder dat de sleutels dan opnieuw ingevuld moeten worden.
> **Dat klopt niet meer.** Nagelopen op 27 september: er is er nog maar één die
> ertoe doet.

---

## Zelf een nieuw project maken, stap voor stap

### Wat er overgezet moet worden: één regel

| Instelling | Nodig? |
|---|---|
| `EASYAPPOINTMENTS_*` | **Nee.** OO2 geeft geen API; de agenda is een ingesloten venster en heeft geen sleutel nodig |
| `RESEND_API_KEY`, `MAIL_*` | **Nee.** Het terugbelformulier staat uit, de site verstuurt nergens e-mail |
| `TURNSTILE_*` | **Nee.** Hoort bij datzelfde formulier |
| `KEYSTATIC_GITHUB_REPO` | **Nee.** De GitHub-koppeling van het beheerscherm is nooit ingesteld, dus er valt niets te kopiëren |
| `NEXT_PUBLIC_SITE_URL` | **Ja.** Op `https://oogcontactbijgerard.nl`, zodra het domein om is |

Dat is alles. Verder heeft het project niets nodig: de foto's, de teksten, de
openingstijden en de agenda zitten allemaal in de repository.

### Eerst dit: de repository moet van Gerard worden

Op 27 september geprobeerd. Gerard ziet in de importlijst van Vercel alleen
`gbugel`; **`Rodney360` staat er niet tussen**, en dat is geen instelling die
hij ergens aan kan zetten.

Nagekeken bij GitHub:

- `Rodney360` is een **persoonlijk account**, geen organisatie
  (`"type": "User"`)
- Gerard heeft op de repository `push`, maar **geen `admin`**

Op een persoonlijk account kan alleen de eigenaar bepalen welke apps erbij
mogen. Een medewerker kan dat account daarom nooit in zijn eigen Vercel-lijst
krijgen. Zolang de repository bij `Rodney360` staat, kan Gerard er dus geen
eigen project van maken - hoe vaak hij ook opnieuw inlogt.

**De oplossing: Dennis draagt de repository over aan Gerard.** GitHub →
Settings → onderaan bij "Danger Zone" → **Transfer ownership** → `gbugel`.
Gerard krijgt een verzoek en accepteert. Alles gaat mee: de geschiedenis, de
pull requests, de instellingen. Het oude adres blijft doorverwijzen, dus er
breekt niets. Dennis kan daarna gewoon als medewerker blijven meewerken.

Dat is meteen het nette einde: de code én de hosting staan dan op naam van de
winkel.

> Let op voor daarna: een sessie van Claude Code is gekoppeld aan de naam van
> de repository. Na de overdracht heet hij `gbugel/oogcontact` en moet die
> eenmalig opnieuw toegevoegd worden aan de sessie.

### De stappen, zodra de repository van Gerard is

1. Log in op <https://vercel.com> met je eigen account.
2. **Add New → Project**. Vercel vraagt of het bij GitHub mag kijken; zeg ja en
   kies het account `gbugel`.
3. Kies de repository **`oogcontact`**. Die staat er nu wel tussen, want je bent
   nu zelf de eigenaar.
4. **Project Name**: kies iets herkenbaars, bijvoorbeeld
   `oogcontact-bij-gerard`. Dat bepaalt alleen het tijdelijke
   `...vercel.app`-adres, niet het echte domein.
5. Framework staat vanzelf op **Next.js**. De rest kan op de standaard blijven.
6. **Deploy**, en wacht een paar minuten. De eerste bouw duurt langer, want alle
   foto's worden opnieuw omgezet.
7. Bekijk het resultaat op het nieuwe `...vercel.app`-adres en kijk of alles
   klopt. **Pas daarna het domein**; zie `docs/live-gaan.md`.
8. Als het domein eenmaal om is: vraag Dennis om zijn project los te koppelen
   van GitHub (Settings → Git → Disconnect). Anders bouwen er twee bij elke
   wijziging.

### Waar je op moet letten

- Doe dit **voordat** je het domein omzet, niet erna. Een domein kan maar bij
  één project horen.
- Het oude project mag blijven staan tot alles goed werkt. Dat is je weg terug.
- Het beheerscherm `/keystatic` werkt op de live site pas als de
  GitHub-koppeling ingesteld is. Dat geldt nu ook al, dus je levert er niets
  mee in.


### Eén ding dat losstaat van wie de eigenaar is

Vercel schrijft over het gratis abonnement:

> *the Hobby plan restricts users to non-commercial, personal use only.*
> — <https://vercel.com/docs/plans/hobby>

De site van een opticienszaak is commercieel gebruik. Dat verandert niet door
het project te verplaatsen — het gaat om het abonnement, niet om de eigenaar.
Zolang de site op `oogcontact.vercel.app` stond viel het niet op; met het echte
domein eraan is het onmiskenbaar een bedrijfssite.

Het blokkeert het live gaan niet, en het is een uitgave voor Gerard en Gerda.
Maar het hoort wel een keer op tafel.
