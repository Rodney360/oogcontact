# Open punten

Wat er nog moet gebeuren of aangeleverd worden. Bijgewerkt op 16 september 2026.

Het is bewust opgedeeld in **wat ik van jou nodig heb** en **wat ik zelf nog
doe**. Bij elk punt staat waarom het nodig is en wat er gebeurt zolang het er
niet is — want de site werkt zonder al deze dingen gewoon.

---

## 1. Wat ik van jou nodig heb

### 1.1 Nu, om verder te kunnen

**De repository koppelen aan Vercel.**
Zodra dat gedaan is, krijgt elke branch automatisch een preview-link en gaat een
merge naar `main` vanzelf live. Ik heb geen Vercel-token of CLI nodig; de
koppeling tussen GitHub en Vercel doet alles.
*Wat je doet:* ga naar <https://vercel.com/new>, kies de repository
`Rodney360/oogcontact`, en klik op Deploy. Meer is het niet — de instellingen
staan al goed in de repo.

**Branch-bescherming op `main`.**
Zodat er niets per ongeluk rechtstreeks naar de live site gaat en de controles
altijd eerst moeten slagen. Ik kan dit niet zelf instellen; daar heb ik
beheerrechten op de repository voor nodig.
*Wat je doet:* GitHub → de repository → Settings → Branches → Add branch
protection rule → naam `main` → vink aan: "Require a pull request before
merging" en "Require status checks to pass".

### 1.2 Zodra de site staat

**API-sleutel van de online agenda (Easy!Appointments).**
Ik heb gecontroleerd dat de API bestaat en werkt: `oogcontactbijgerard.oo2.online`
antwoordt met "niet ingelogd" in plaats van "bestaat niet". Er is dus alleen een
sleutel nodig, geen verbouwing.
*Wat je doet:* log in op <https://oogcontactbijgerard.oo2.online>, ga naar
Instellingen → API (of Integrations → API), zet de API aan en kopieer de
sleutel. Stuur hem naar mij, of zet hem zelf in Vercel onder Settings →
Environment Variables als `EASYAPPOINTMENTS_API_KEY`.
*Zolang die er niet is:* de boekingsmodule draait in testmodus met
voorbeeldtijden, met een duidelijke melding erbij dat het een test is. De
bezoeker kan intussen gewoon bellen of appen.

**Resend-account voor de e-mail.**
Hiermee gaat het ingevulde formulier naar de winkel en krijgt de klant een
bevestiging.
*Wat je doet:* maak een gratis account op <https://resend.com>, voeg het domein
`oogcontactbijgerard.nl` toe en zet de twee DNS-regels klaar die Resend noemt
(SPF en DKIM). Die regels raken de e-mail van de winkel niet: ze staan náást de
bestaande MX-records. Zet daarna de sleutel in Vercel als `RESEND_API_KEY`.
*Zolang die er niet is:* het formulier werkt, maar er wordt niets verstuurd. In
plaats daarvan komt de inzending in het logboek te staan.

**Cloudflare Turnstile.**
Onzichtbare spambescherming. De bezoeker merkt er niets van.
*Wat je doet:* maak een gratis account op <https://dash.cloudflare.com>, ga naar
Turnstile, voeg `oogcontactbijgerard.nl` toe en kies "Invisible". Je krijgt twee
sleutels; zet ze in Vercel als `NEXT_PUBLIC_TURNSTILE_SITE_KEY` en
`TURNSTILE_SECRET_KEY`.
*Zolang die er niet is:* de honeypot en de snelheidsbegrenzer houden al het
meeste tegen. Dit is een extra laag, geen noodzaak.

### 1.3 Gegevens die ik niet zelf mag verzinnen

| Wat | Waarvoor | Wat er nu staat |
|---|---|---|
| **KvK-nummer** | Hoort in de voettekst. Verplicht voor een webshop, netjes voor een winkel. | De regel wordt weggelaten zolang het nummer er niet is. |
| **Link naar het Google Bedrijfsprofiel** | Voor de vindbaarheid en om reviews te kunnen tonen. | Nog geen link op de site. |
| **Bevestiging van de merkenlijst** | Zie hieronder. | De lijst van de oude site wordt getoond. |
| **Land van herkomst per merk** | Het kleine label bij elk merk. | Alleen getoond waar ik het zeker weet; de rest blijft leeg. |
| **Wat Gerda precies doet in de winkel** | Voor haar stuk op Over ons. | Zie hieronder — hier is al een antwoord voor. |

**Over de merken.** De merknamen staan al op de huidige site, dus die hoefde ik
niet te vragen. Op de pagina Brillen en Zonnebrillen staan:

> Etnia Barcelona, Gigi Studios, Gotti, Einstoffen, Odette Lunettes, Penn and
> Ink, Bloomdale, Baruch, Calvin Klein, Liu Jo, Caroline Abram, Colibris,
> Visionario, Gloryfy (sportbrillen), Randolph. Glazen van Essilor (Varilux,
> Eyezen, Stellest). Loepbrillen van Admetec.

Twee dingen daarbij:

1. **Klopt deze lijst nog?** Hij komt van pagina's die in juni 2025 voor het
   laatst zijn bijgewerkt. Er kunnen merken bij gekomen of afgevallen zijn.
   Serengeti staat wel op Instagram maar niet op de site — hoort die erbij?
2. **Er zit een spanning in het verhaal.** De site zegt "bewust niet de bekende
   modemerken", maar noemt wel Calvin Klein en Liu Jo. Ik heb de tekst zo
   geschreven dat hij klopt: de nadruk ligt op kleine makers, zonder te beweren
   dat er uitsluitend kleine merken zijn. Wil je dat anders, laat het weten.

Ik heb het land van herkomst alleen ingevuld waar dat algemeen bekend is —
Etnia Barcelona en Gigi Studios (Spanje), Gotti en Einstoffen (Zwitserland),
Liu Jo (Italië), Caroline Abram (Frankrijk), Odette Lunettes (België), Gloryfy
(Oostenrijk). **Ook die wil ik graag bevestigd hebben.** Van Randolph, Penn and
Ink, Bloomdale, Baruch, Colibris, Visionario en Calvin Klein heb ik het
leeggelaten; die verschijnen zonder label tot jij ze invult. Dat kun je zelf
doen in het beheerscherm, onder Merken.

**Over Gerda.** Je vroeg me dit aan jou te vragen, maar het antwoord staat al op
de huidige site, onder "En wie is Gerda…": zij doet **de inkoop van de kleinere
merken en het etaleren in de winkel**, Gerard en Gerda leerden elkaar kennen als
collega's bij OMC Noord (nu Eyescan), ze vormen al vijftien jaar een team, en
hun kinderen hebben meegeholpen om de winkel op te bouwen. Daar heb ik haar
stuk mee geschreven. **Lees het even na** — als er iets bij moet of anders
moet, hoor ik het graag.

### 1.4 Foto's

De nieuwe winkelfoto's kunnen erin zodra ze er zijn. Zet ze in `assets-new/`
en wijs ze aan in `config/beeld.mjs`; in `assets-new/README.md` staat precies
hoe. De oude foto's blijven gewoon beschikbaar.

Een paar bestaande foto's zijn kleiner dan waar ze staan:

| Foto | Waar hij staat | Formaat |
|---|---|---|
| `oog.jpg` | Het oog bij de scène over nauwkeurig meten | 612 × 408 |
| `leeskaart-2.jpg` | De pijler "Ervaring" | 612 × 304 |
| `Vision-R-800-...png` | Het meetapparaat | 768 × 540 |
| De vijf categoriefoto's | De aanbodpagina's | 667 × 1000 |

Ze werken prima op de plek waar ze nu staan — de site vraagt niet meer dan er
is. Scherper kan alleen met een groter origineel. Heb je die nog ergens (bij de
fotograaf, of bij de leverancier), dan wordt het mooier.

### 1.5 Een beslissing over de opslag van de foto's

**Dit is de enige plek waar ik van jouw richtlijn ben afgeweken, dus ik leg het
even uit.** Je schreef: worden de originele foto's samen groter dan ongeveer
200 MB, overleg dan eerst over opslag in Vercel Blob. Ze zijn samen **233 MB**.

Ik heb ze toch alvast gecommit, om één reden: de cloudcomputer waarop ik werk
wordt na elke sessie gewist. Niet committen betekende: alles kwijt. Dat leek me
duidelijk erger dan een zware repository, en het is omkeerbaar.

Waar die 233 MB in zit: **205 MB zit in 15 bestanden**, en die worden geen van
alle op de site gebruikt. De grootste is een persfoto van een leverancier van
47,5 MB (5792 × 8688 pixels), die er twee keer in staat. Ook twee video's van
elk 22 MB staan er dubbel in. De overige 241 foto's — inclusief álle
winkelfoto's en de professionele portretten — zijn samen maar 28 MB.

Drie mogelijkheden:

1. **Zo laten.** 233 MB is voor GitHub prima. Enige nadeel: het binnenhalen van
   de repository duurt de eerste keer een paar minuten langer.
2. **De 15 grote bestanden naar Vercel Blob.** Dan gaat de repository naar
   ongeveer 30 MB. Kost wat instelwerk en een Blob-token.
3. **De grootste weggooien.** De 95 MB aan leverancierspersfoto's staat nergens
   op de site en komt daar ook niet.

**Mijn advies: optie 1, en later eventueel optie 2.** Maar het is jouw keuze —
zeg het maar, dan regel ik het.

---

## 2. Wat ik zelf nog doe

- [ ] De homepage met alle scènes uit §5 van de opdracht
- [ ] De overige pagina's opbouwen met de nieuwe teksten
- [ ] `docs/teksten-review.md` zodat jullie de teksten kunnen goedkeuren
- [ ] `docs/handleiding-beheer.md` voor Gerard en Gerda
- [ ] De privacy- en cookieverklaring, op basis van wat de site echt doet
- [ ] De Instagram-grid (zie hieronder)
- [ ] Lighthouse-metingen en het rapport
- [ ] De 404-pagina

---

## 3. Dingen waar ik tegenaan liep

**Google-reviews.** De opdracht zegt: alleen tonen als er echte reviews zijn.
Ik heb geen toegang tot het Google Bedrijfsprofiel en kan dus niet zien of ze er
zijn. Het blok "vertrouwen" gaat daarom voorlopig over de keurmerken ANVC en
NUVO. Zodra ik de link naar het bedrijfsprofiel heb, kijk ik hiernaar.

**Instagram.** Een feed van Instagram halen kan tegenwoordig niet meer zonder
een betaalde dienst (zoals Behold) of een app-registratie bij Meta. Ik bouw het
daarom zó dat de foto's in het beheerscherm gezet kunnen worden — een handeling
van een minuut, zo nu en dan — met een knop "Volg ons op Instagram" erbij. Wil
je liever een automatische feed, dan is daar een abonnement voor nodig; zeg het
maar.

**De pagina Algemene voorwaarden** verwijst op de oude site naar een pdf van de
brancheorganisatie (NUVO, versie 2018). Die pdf is bewaard. Klopt het dat dit de
voorwaarden zijn die jullie voeren, en is 2018 nog de actuele versie?

**Twee pagina's met dezelfde inhoud.** In WordPress bestonden
`/ultiem-nauwkeurig-zicht/` en `/home/ultiem-nauwkeurig-zicht/` allebei, met
bijna dezelfde tekst. Dat is niet goed voor de vindbaarheid. Er is er nu nog
één; de andere verwijst ernaartoe.

**De naam van de hero-foto.** Het bestand heette `cropped-James-Dean.png`. Er
staat geen James Dean op — het is een portret in zwart-wit van een jonge man met
een ronde bril. Hij heeft nu de naam `hero-portret` gekregen. Wel even checken:
**mag deze foto gebruikt worden?** Als hij van een leverancier of een fotobank
komt, is het goed om te weten onder welke voorwaarden.
