# Nieuwe foto's

Hier kunnen de nieuwe winkelfoto's in.

## Hoe je een nieuwe foto op de site krijgt

**1. Zet de foto in deze map.**

Gebruik het originele bestand, zo groot mogelijk, rechtstreeks uit de camera of
van de fotograaf. Niet eerst verkleinen — dat doet de site zelf, en beter.

Maak gerust submappen als dat overzichtelijker is, bijvoorbeeld:

```
assets-new/
  winkel-2026/
    interieur-01.jpg
    etalage-avond.jpg
  gerard-en-gerda/
    portret-samen.jpg
```

**2. Zeg waar hij moet komen.**

Open `config/beeld.mjs`. Daar staat per plek op de site welke foto er hangt.
Zoek de plek op en verander de regel `bron`:

```js
'winkel-tafel': {
  bron: 'winkel-2026/interieur-01.jpg',   // <- deze regel
  verhouding: BREED,
  alt: 'De winkel van binnen: visgraatvloer, een lange eiken tafel met leren stoelen.',
  breedtes: GROOT,
  stijl: 'warm',
},
```

Pas ook de `alt` aan als er iets anders op de nieuwe foto staat. Die tekst is
voor mensen die de foto niet kunnen zien — beschrijf dus wat er echt op staat.

**3. Draai de verwerking.**

```
npm run images
```

De site snijdt de foto bij op de juiste verhouding, corrigeert de kleur licht
zodat alle foto's als één set voelen, verscherpt hem en maakt er AVIF- en
WebP-bestanden van in verschillende breedtes.

Is de foto te klein voor waar hij komt te hangen, dan zegt het script dat
gewoon. Hij wordt niet stiekem opgeblazen.

**4. Kijken.**

```
npm run dev
```

En dan naar <http://localhost:3000>.

---

## Waar je op moet letten

- **Groot aanleveren.** Voor een foto over de volle breedte is minstens 2000
  pixels breed fijn. Voor een kleinere tegel is 900 pixels genoeg.
- **Liggend of staand?** In `config/beeld.mjs` staat per plek welke verhouding
  daar hoort. Een staande foto in een liggend vak wordt bijgesneden.
- **Rustig beeld werkt het beste.** Veel witruimte, één duidelijk onderwerp.
- **Staan er mensen op?** Vraag hun toestemming voordat de foto op de site komt.

## De oude foto's

Alle foto's van de oude WordPress-site staan in `assets-original/`. Die blijven
gewoon staan, ook als ze nergens meer gebruikt worden. Wil je er een terug,
dan wijs je hem aan in `config/beeld.mjs`, net als hierboven.

## Wat níét mag

Verander nooit wat er op een foto staat. Geen monturen erbij bedenken, geen
mensen wegpoetsen, geen ander interieur. Bijsnijden, iets lichter of warmer
maken: prima. De inhoud veranderen: niet doen.
