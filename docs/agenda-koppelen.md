# De online agenda koppelen

De boekingsmodule op de site is klaar. Hij draait alleen nog in **testmodus**:
bezoekers zien voorbeeldtijden en er wordt niets echt vastgelegd. Zodra de site
mag inloggen bij de agenda op `oogcontactbijgerard.oo2.online`, gaat hij vanzelf
over op de echte tijden. Er hoeft daarna niets aangezet te worden.

Achter OO2 draait **Easy!Appointments**. Dat is belangrijk om te weten, want de
site praat met de API van dat programma.

---

## Kijk eerst waar het staat

Open op de site: **`/agenda-controle/`** — dus
<https://oogcontactbijgerard.nl/agenda-controle/>.

Die pagina loopt de koppeling stap voor stap na en zegt in gewone taal wat er
goed gaat en wat niet: staat het adres goed, worden de inloggegevens
geaccepteerd, komen de diensten binnen, is er een medewerker, zijn er vrije
tijden. Er komen nooit sleutels of wachtwoorden op te staan.

De pagina staat niet in het menu en niet in de sitemap, en zoekmachines wordt
gevraagd hem te laten staan.

---

## Manier 1 — een sleutel (als OO2 die geeft)

1. Log in op <https://oogcontactbijgerard.oo2.online> als beheerder.
2. Zoek een instelling die over de **API** gaat, en kopieer de sleutel.
3. Zet in Vercel (Settings → Environment Variables) twee waarden klaar:
   - `EASYAPPOINTMENTS_URL` → `https://oogcontactbijgerard.oo2.online`
   - `EASYAPPOINTMENTS_API_KEY` → de sleutel
4. **Redeploy.** Een instelling telt pas mee bij een nieuwe bouw.

Vind je die API-instelling niet, dan ligt dat niet aan jou: bij
Easy!Appointments staat de sleutel in een bestand op de server (`config.php`),
en daar kun je als klant niet bij. Ga dan verder met manier 2.

## Manier 2 — een gebruikersnaam en wachtwoord

Easy!Appointments laat de site ook binnen met de inlog van een beheerder. Dat
kan de site al aan.

1. Maak in de agenda een **aparte beheerder** aan, bijvoorbeeld met de naam
   `website`, met een eigen wachtwoord. Doe dit liever niet met je eigen inlog:
   gaat er ooit iets mis, dan trek je dat ene account in en blijft de rest heel.
2. Zet in Vercel klaar:
   - `EASYAPPOINTMENTS_URL` → `https://oogcontactbijgerard.oo2.online`
   - `EASYAPPOINTMENTS_GEBRUIKER` → die gebruikersnaam
   - `EASYAPPOINTMENTS_WACHTWOORD` → dat wachtwoord
   - `EASYAPPOINTMENTS_API_KEY` → **leeg laten**
3. **Redeploy**, en kijk daarna op `/agenda-controle/`.

> Het wachtwoord hoort alleen in Vercel. Nooit in een bestand dat meegaat in een
> commit, en nooit in een chat of een mail.

## Manier 3 — vraag het aan OO2

Werken manier 1 en 2 allebei niet, dan staat de API waarschijnlijk uit. Alleen
OO2 kan dat aanzetten. Hieronder staat een mail die je kunt overnemen.

---

## Mail aan OO2

> **Onderwerp:** API van onze afsprakenagenda aanzetten
>
> Goedemiddag,
>
> Wij zijn Oogcontact bij Gerard in Groningen en hebben bij jullie een
> afsprakenagenda draaien op oogcontactbijgerard.oo2.online.
>
> We hebben een nieuwe website laten bouwen waarop bezoekers direct een afspraak
> kunnen maken. Die website moet daarvoor de vrije tijden uit de agenda kunnen
> ophalen en er een afspraak in kunnen zetten. Daar is toegang tot de API van
> Easy!Appointments voor nodig.
>
> Zouden jullie kunnen laten weten:
>
> 1. Staat de REST API (versie 1, `/index.php/api/v1/...`) aan voor onze
>    omgeving? Zo niet, kunnen jullie die aanzetten?
> 2. Hoe logt de website in: met een API-sleutel (`Authorization: Bearer ...`)
>    of met de gebruikersnaam en het wachtwoord van een beheerder
>    (Basic authentication)?
> 3. Als het met een sleutel gaat: kunnen jullie er een voor ons aanmaken? In
>    het beheerscherm kunnen wij die instelling niet vinden.
> 4. Moeten wij nog ergens een IP-adres of een domein laten toelaten?
>
> Alvast bedankt.
>
> Met vriendelijke groet,
> Gerard en Gerda Bugel
> Oogcontact bij Gerard, Overwinningsplein 100, Groningen

---

## Wat er daarna gebeurt

Zodra de site binnenkomt:

- De melding "dit is een test" bij de kalender verdwijnt vanzelf.
- Bezoekers zien de echte vrije tijden uit de agenda.
- Een afspraak komt in de agenda te staan, met naam, telefoon en e-mailadres.
- Vlak voor het vastleggen kijkt de site nog één keer of het moment echt vrij
  is, zodat twee mensen nooit hetzelfde tijdstip krijgen.

Gaat er iets mis, dan blijft de site gewoon werken: de bezoeker krijgt dan de
vraag om te bellen of te appen.
