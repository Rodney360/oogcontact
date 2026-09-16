# Zelf aan de site werken, op je eigen Mac

Deze handleiding is voor Gerard. Je hoeft niets van programmeren te weten.
Je typt een paar dingen over, en verder vertel je in gewone taal wat je wilt.

Neem het rustig door: **één stap tegelijk**. Werkt iets niet, sla dan niets
over, maar vraag het even. Je kunt hier niets kapotmaken: de live site
verandert pas als jij daar zelf opdracht toe geeft.

> De installatiestappen hieronder komen uit de officiële handleiding van
> Claude Code: <https://code.claude.com/docs/en/quickstart>. Verandert daar
> iets, dan is die pagina leidend.

---

## Wat je nodig hebt

- Een Mac met **macOS 13 of nieuwer**
- Een internetverbinding
- Een Claude-abonnement (Pro of Max)
- Een GitHub-account, met toegang tot de repository van de site

Even over de woorden die je gaat tegenkomen:

| Woord | Wat het betekent |
|---|---|
| **Terminal** | Een venster waarin je opdrachten typt in plaats van klikt. |
| **Repository** (of "repo") | De map met alle bestanden van de site, met alle geschiedenis erbij. |
| **Branch** | Een aparte werkversie. Je verandert daarin iets zonder dat de live site meteen verandert. |
| **Pull request** (of "PR") | Het voorstel: "dit heb ik veranderd, mag dit naar de live site?" |
| **Preview** | Een tijdelijke versie van de site waarop je je wijziging kunt bekijken voordat hij live gaat. |

---

## Stap 1 — De Terminal openen

Druk op **Command (⌘) + spatie**, typ `Terminal` en druk op Enter.

Er opent een venster met witte of zwarte tekst. Dat is de Terminal. Meer is het
niet: je typt er een regel en drukt op Enter.

Verder in deze handleiding staan regels in een grijs kader. Die typ je over
(of kopieer je) in de Terminal en dan druk je op Enter.

---

## Stap 2 — Node installeren

Node is het programma waar de site op draait. Controleer eerst of je het al hebt:

```
node -v
```

Zie je iets als `v22.22.2`? Dan is het goed en ga je door naar stap 3.

Zie je `command not found`? Download Node dan via
<https://nodejs.org> — kies de knop met **LTS** erin. Open het gedownloade
bestand en klik de installatie door. Sluit daarna de Terminal, open hem opnieuw
en probeer `node -v` nog eens.

---

## Stap 3 — Claude Code installeren

Typ deze regel over:

```
curl -fsSL https://claude.ai/install.sh | bash
```

Er loopt wat tekst voorbij. Als het klaar is, sluit je de Terminal en open je
hem opnieuw (dat is nodig, anders vindt hij het nieuwe programma nog niet).

Controleer of het gelukt is:

```
claude --version
```

Zie je een versienummer? Dan staat het goed.

> Heb je liever een venster met knoppen dan de Terminal? Er is ook een
> Claude-app voor de Mac: <https://claude.ai/download>. De stappen hieronder
> gaan uit van de Terminal, omdat dat op elke Mac hetzelfde werkt.

---

## Stap 4 — Inloggen

Typ:

```
claude
```

De eerste keer opent je browser met de vraag om in te loggen. Log in met het
account waarop je Claude-abonnement staat. Daarna hoef je dit nooit meer te doen.

Je ziet nu een prompt waarin je kunt typen. Typ `/help` als je wilt zien wat er
allemaal kan. Sluiten doe je door `exit` te typen, of met **Ctrl + C**.

---

## Stap 5 — De site naar je Mac halen

Dit doe je maar één keer. Typ de regels één voor één:

```
cd ~/Documents
```

```
git clone https://github.com/Rodney360/oogcontact.git
```

```
cd oogcontact
```

```
npm install
```

Die laatste regel duurt een minuut of twee. Dat is normaal.

Je hebt nu een map `oogcontact` in je map Documenten. Daar staat de hele site in.

---

## Stap 6 — De site bekijken op je eigen Mac

```
npm run dev
```

Open je browser en ga naar **http://localhost:3000**

Daar staat de site, precies zoals hij live is. Dit is jouw eigen versie: wat je
hier ziet, ziet niemand anders. Wijzig je iets in de bestanden, dan zie je het
meteen in de browser.

Stoppen doe je met **Ctrl + C** in de Terminal.

> Je hebt geen wachtwoorden of sleutels nodig. Het contactformulier en de
> afspraakmodule draaien dan in **testmodus**: ze doen alsof, en laten in de
> Terminal zien wat er verstuurd zou zijn. Er gaat dus nooit per ongeluk een
> echte e-mail of een echte afspraak uit terwijl je aan het proberen bent.

---

## Stap 7 — Iets laten veranderen

Open een tweede Terminal-venster (**Command + N**) zodat de site blijft draaien
in het eerste. Ga naar de map en start Claude:

```
cd ~/Documents/oogcontact
```

```
claude
```

Begin **altijd** met de nieuwste versie ophalen. Typ tegen Claude:

> Haal eerst de nieuwste main op en maak een nieuwe branch voor deze wijziging.

Vraag daarna gewoon in het Nederlands wat je wilt. Bijvoorbeeld:

> Zet op de contactpagina dat we op 5 mei gesloten zijn.

> Maak een nieuwsbericht dat we vanaf volgende week de nieuwe collectie van
> Gotti in de winkel hebben.

> De foto op de pagina Zonnebrillen mag vervangen worden door een andere.

Claude laat zien wat hij wil veranderen en vraagt of het goed is. Kijk het na
en zeg ja of nee. Ben je iets niet met hem eens, zeg dat dan gewoon — je mag
hem net zo goed corrigeren.

Vraag als laatste altijd:

> Draai npm run check en laat zien of alles goed gaat.

---

## Stap 8 — Je wijziging voorstellen

Als je tevreden bent, typ je tegen Claude:

> Commit dit en open een pull request met de preview-link erbij.

Claude zet je wijziging klaar en geeft je twee links:

1. Een link naar de **pull request** op GitHub — het voorstel.
2. Een link naar de **preview** — daar kun je zien hoe het geworden is.

**Bekijk de preview altijd even**, op je computer én op je telefoon. Klopt het?
Dan mag het naar de live site: ga naar de pull request op GitHub en klik op de
groene knop **Merge pull request**. Een paar minuten later staat het live.

Klopt het nog niet? Zeg dat tegen Claude en laat hem het aanpassen. De preview
wordt dan vanzelf bijgewerkt.

---

## Kleine dingen: het beheerscherm is makkelijker

Voor **nieuwsberichten, een vakantiemelding, afwijkende openingstijden en de
merkenlijst** hoef je dit alles niet te doen. Daar is een beheerscherm voor,
waarin je gewoon kunt typen en klikken.

Zie **[docs/handleiding-beheer.md](handleiding-beheer.md)**.

---

## Je hoeft dit niet op je Mac te doen

Je kunt ook gewoon in je browser werken, zonder iets te installeren:

1. Ga naar <https://claude.ai/code>
2. Kies de repository `Rodney360/oogcontact`
3. Vertel in gewone taal wat je wilt

Er wordt dan ergens in de cloud een computer voor je klaargezet die hetzelfde
doet als hierboven. Handig als je even snel iets wilt laten aanpassen, of als
je niet achter je eigen Mac zit.

---

## Als er iets misgaat

| Wat je ziet | Wat je doet |
|---|---|
| `command not found: claude` | Sluit de Terminal en open hem opnieuw. Helpt dat niet, doe stap 3 nog eens. |
| `command not found: node` of `npm` | Doe stap 2 opnieuw. |
| De site op localhost:3000 laadt niet | Draait `npm run dev` nog in het andere Terminal-venster? Zo niet, start hem opnieuw. |
| `Permission denied` bij git | Je bent niet ingelogd bij GitHub. Vraag even hulp; dit is eenmalig. |
| Er staat iets in het rood en je weet het niet | Kopieer de tekst en plak hem in Claude met de vraag: "wat betekent dit en wat moet ik doen?" |

Kom je er niet uit? Vraag het gerust. Er gaat niets stuk: zolang je niet op
**Merge pull request** klikt, verandert er niets aan de live site.
