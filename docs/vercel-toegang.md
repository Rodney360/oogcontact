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

**3. Gerard maakt er zelf een nieuw project van** — gratis. Werkt, maar de
sleutels moeten opnieuw ingevuld worden, het project krijgt een ander
`vercel.app`-adres, en het oude project moet eerst van de repository
losgekoppeld worden. Anders bouwen er twee tegelijk en weet niemand meer welke
preview de goede is.

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
