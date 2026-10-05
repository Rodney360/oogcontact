# De online agenda

Op `/afspraak-maken/` staat de agenda van **OO2**, ingesloten in onze eigen
pagina. Wie daar een afspraak maakt, boekt echt: in de echte agenda, op een
tijd die echt vrij is. Er kan dus niets dubbel geboekt worden.

Dat is precies wat de oude WordPress-site ook deed. In
`content-archive/_raw/pages.json` staat nog de originele regel:

```html
<iframe loading="lazy" src="https://oogcontactbijgerard.oo2.online" width="100%" height="750">
```

---

## Waarom niet in onze eigen vormgeving?

Daarvoor zou de site zelf de vrije tijden moeten kunnen ophalen en er een
afspraak in moeten kunnen zetten. Dat kan alleen via de API van
Easy!Appointments, het programma achter OO2.

**OO2 geeft die API niet uit.** Niet in dit pakket en ook niet in een duurder
pakket; Gerard heeft het in september 2026 gevraagd. Daarmee vervalt de route
met een sleutel of met een gebruikersnaam en wachtwoord.

Een kalender die zelf tijden verzint is geen alternatief: dan krijgt iemand een
moment te zien dat allang bezet is.

---

## Wat dat betekent voor de teksten

De site kan niet in de agenda kijken. **Alles wat de bezoeker binnen dat vlak
ziet, komt uit OO2**: de namen van de afspraken en hoe lang ze duren.

Staat op de site "oogmeting, ongeveer 60 minuten" en in OO2 nog 30, dan spreken
de pagina en de agenda elkaar tegen. Die twee moeten dus gelijk staan, en dat
gebeurt **in OO2**, niet hier. Zie `docs/open-punten.md`.

---

## Onze eigen module staat in de wacht

`src/components/boeking/Boeking.tsx` is af en blijft gewoon in de repo staan,
samen met:

- `src/lib/agenda/` — het praten met Easy!Appointments, inclusief testmodus
- `src/app/api/` — de routes die de tijden ophalen en een afspraak wegschrijven
- `/agenda-controle/` — de pagina die stap voor stap nakijkt of een koppeling
  het doet (staat niet in het menu en niet in de sitemap)

Hij staat alleen op geen enkele pagina meer. Komt er ooit toch een API — omdat
OO2 van gedachten verandert, of omdat jullie overstappen naar een ander
programma — dan zijn dit de stappen:

1. Zet in Vercel `EASYAPPOINTMENTS_URL` klaar, plus `EASYAPPOINTMENTS_API_KEY`
   of `EASYAPPOINTMENTS_GEBRUIKER` en `EASYAPPOINTMENTS_WACHTWOORD`.
2. Kijk op `/agenda-controle/` of de site binnenkomt.
3. Zet in `src/app/afspraak-maken/page.tsx` `<OnlineAgenda />` terug naar
   `<Boeking voor={voor} />`.

> Een sleutel of wachtwoord hoort alleen in Vercel. Nooit in een bestand dat
> meegaat in een commit, en nooit in een chat of een mail.

---

## Nog één ding om te proberen

Easy!Appointments heeft een koppeling met Google Agenda. Zet OO2 die voor
jullie open, dan lopen de afspraken ook in een Google-agenda, en die heeft een
geheim agenda-adres dat onze site wél mag lezen. Dan kunnen we de echte vrije
tijden in onze eigen vormgeving laten zien. Boeken zou nog steeds via OO2 gaan.

Of OO2 die instelling voor klanten openzet, weten we niet. Het is één mailtje
waard.

---

## De taal en de kleuren van de agenda

Alles binnen dat vlak is van OO2. Een browser laat onze site daar bewust niet
aan de binnenkant komen, dus wij kunnen de teksten en de kleuren daarin niet
aanpassen. Dat gebeurt in OO2 zelf.

**De taal: opgelost.** De agenda stond in het Engels. Easy!Appointments heeft
een Nederlandse vertaling ingebouwd en luistert naar `?language=dutch` in het
adres. Dat staat er nu in, en de agenda is Nederlands. OO2 hoeft daar niets
voor te doen.

**De kleuren.** Onze enige accentkleur is messing: **#C9A96A** — dezelfde als de
knop "Afspraak maken". Sommige versies van Easy!Appointments hebben daar een
instelling voor (een bedrijfskleur of een eigen stukje CSS). Vraag OO2 of dat
kan, en geef die code door.

**Geen filters over dat vlak. Dat is een harde regel geworden.**

Er heeft even een kleurcorrectie overheen gelegen om die lichtgrijze teksten
donkerder te maken. Op een laptop werkte dat prima; op een iPhone bleef het vak
daarna helemaal leeg. Een agenda die het op een telefoon niet doet is veel
erger dan tekst die aan de lichte kant is, dus die correctie is er weer uit en
sindsdien doet hij het overal.

Wat we daarvan geleerd hebben: **leg niets van onze kant over dat vlak heen.**
Geen `filter`, geen omhullende div met `overflow-hidden` en een afronding, geen
`transform`. Safari rekent zo'n vlak dan opnieuw uit en geeft wit terug. De
afronding zit daarom op het vlak zelf.

De leesbaarheid blijft daarmee volledig een vraag voor OO2.

## De laatste knop: daar vallen afspraken weg

Gerard, 5 oktober 2026: de knop aan het eind van de stappen in de agenda is de
belangrijkste, want zonder die klik staat de afspraak er niet in. En juist die
knop valt niet genoeg op.

**Wat wij gedaan hebben, op onze eigen pagina.** Boven de agenda staan nu de
vier stappen, met de vierde in een messing kader: "Bevestig je afspraak — pas
dan staat hij echt in onze agenda." Direct onder de agenda staat het nog een
keer, op de plek waar je bent als je klaar bent met invullen, met de tip om in
het agendavak zelf naar beneden te scrollen als je de knop niet ziet. Op een
telefoon is het agendavak namelijk niet hoog genoeg om alles in één keer te
laten zien. Zie `src/components/boeking/AgendaStappen.tsx`.

**Wat alleen OO2 kan.** De knop zelf staat in hun vlak. Een mail die je kunt
overnemen:

> Beste OO2,
>
> Onze online agenda staat sinds kort op onze nieuwe website, en dat werkt
> prima. Eén ding merken we wel: klanten slaan de laatste stap soms over. Ze
> vullen alles in, maar klikken niet op de knop aan het eind, en dan staat de
> afspraak er niet in. Die knop valt net niet genoeg op.
>
> Zouden jullie kunnen kijken of dat in onze agenda beter kan? We denken aan:
>
> - de knop groter en in onze eigen kleur, **#C9A96A**, met donkere tekst
> - een duidelijkere tekst op de knop, bijvoorbeeld **"Afspraak bevestigen"**
> - als het kan: de teksten en datums in de agenda wat donkerder. Veel van onze
>   klanten zijn wat ouder, en het lichtgrijs is voor hen lastig te lezen
>
> Alvast hartelijk dank, en laat gerust weten als iets van onze kant nodig is.
>
> Met vriendelijke groet,
> Gerard en Gerda Bugel
> Oogcontact bij Gerard
