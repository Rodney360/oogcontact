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

**De taal.** De agenda stond in het Engels. Easy!Appointments heeft een
Nederlandse vertaling ingebouwd. We proberen hem nu op te vragen met
`?language=dutch` in het adres van de agenda. Helpt dat niet, dan staat de taal
vast in de instellingen bij OO2: log in als beheerder en kijk bij Settings →
General naar een keuze als "Language" of "Localization". Kun je daar niet bij,
dan kan OO2 het omzetten.

**De kleuren.** Onze enige accentkleur is messing: **#C9A96A** — dezelfde als de
knop "Afspraak maken". Sommige versies van Easy!Appointments hebben daar een
instelling voor (een bedrijfskleur of een eigen stukje CSS). Vraag OO2 of dat
kan, en geef die code door.

**Een noodgreep die weer weg is.** Er heeft een kleurcorrectie over het
agendavlak gelegen die lichtgrijze tekst donkerder maakte. Op een telefoon bleef
het vak daarna leeg, terwijl het op een laptop gewoon werkte. Zo'n filter op een
ingesloten vlak is precies het soort ding waar Safari over struikelt, en een
agenda die het op een telefoon niet doet weegt zwaarder dan tekst die aan de
lichte kant is. Hij is er dus weer uit, en de leesbaarheid is daarmee volledig
een vraag voor OO2 geworden.

**Blijft het vak leeg, ook zonder dat filter?** Dan is de volgende verdachte dat
de telefoon derde-partijcookies blokkeert. Easy!Appointments heeft een
sessiecookie nodig, en Safari geeft die binnen een ingesloten vlak van een ander
adres niet altijd. Daar helpt geen enkele aanpassing van onze kant tegen; dan is
de oplossing om op een telefoon niet in te sluiten, maar een knop te tonen die
de agenda in een eigen tabblad opent. Dat is één aanpassing in
`src/components/boeking/OnlineAgenda.tsx`.
