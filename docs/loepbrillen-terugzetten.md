# De loepbrillen weer aanzetten

Oogcontact bij Gerard is op 25 september 2026 tijdelijk gestopt met de
loepbrillen van Admetec. Alles staat er nog; het is alleen niet meer te zien.

Dit papiertje beschrijft hoe je het terugzet.

---

## Stap 1 — de schakelaar om

In `config/schakelaars.mjs`:

```js
export const LOEPBRILLEN_AAN = true
```

Dat is genoeg voor alles wat structureel is:

- Loepbrillen staan weer in het uitklapmenu, in de voettekst en tussen de
  beeldtegels op de homepage
- `/loepbrillen/` is weer een echte pagina in plaats van een doorverwijzing
  naar `/aanbod/`
- De twee loepbrilafspraken staan weer bij de diensten, en `?voor=loepbrillen`
  werkt weer
- Admetec staat weer bij de merken, en de kop op de collectiepagina heet weer
  "Glazen en loepbrillen"
- De browsertests lopen de pagina weer na

De pagina zelf en al zijn teksten
(`src/content/teksten/loepbrillen.json`, 24 vermeldingen) zijn nooit aangeraakt.
Ook de foto's (`aanbod-loepbrillen` in `config/beeld.mjs`) staan er gewoon nog.

---

## Stap 2 — de teksten op de andere pagina's

Dit doet de schakelaar **niet**. Op tien andere pagina's stonden zinnen waarin
de loepbrillen in een rijtje werden meegenoemd. Die zijn met de hand aangepast.

### Zinnen waar "loepbril" uit een opsomming is gehaald

| Bestand | Was |
|---|---|
| `aanbod.json` | "Brillen, contactlenzen, zonnebrillen, kinderbrillen **en loepbrillen**." (twee keer) |
| `home.json` | "Brillen, zonnebrillen, contactlenzen, een kinderbril **of een loepbril**" |
| `contact.json` | "advies over **een loepbril of** kinderbril" |
| `contact.json` | "montuuradvies, lenscontrole **of een loepbril**" |
| `over-ons.json` | "contactlenzen, een kinderbril **of een loepbril**" |
| `over-ons.json` | "lenzen aanmeten, **een loepbril** of even je montuur laten bijstellen" |
| `over-ons.json` | "voor een kinderbril als voor **een loepbril of** een set contactlenzen" |
| `contactlenzen.json` | "een kinderbril **en een loepbril**" |
| `zonnebrillen.json` | "een kinderbril **of een loepbril**" |
| `nieuws.json` | "montuuradvies, contactlenzen **of een loepbril**" |
| `src/lib/seo.tsx` | "zonnebrillen, kinderbrillen **en loepbrillen**" |
| `src/app/layout.tsx` | "brillen, contactlenzen **en loepbrillen**" |

### Hele blokken die eruit gehaald zijn

Hieronder staan ze woordelijk, zodat je ze kunt terugplakken.

#### `src/content/teksten/aanbod.json` — bij "Waar kunnen we je mee helpen?"

```json
[
  {
    "titel": "Loepbrillen",
    "tekst": "Handgemaakte loepbrillen van Admetec met bijbehorende verlichting, voor iedereen die in het werk heel nauwkeurig van dichtbij moet kijken. We plannen ruim de tijd in, zowel voor informatie vooraf als voor de aanmeting."
  }
]
```

#### `src/content/teksten/brillen.json` — bij "Ook voor een kinderbril of een loepbril"

```json
[
  "Werk je veel met kleine details op korte afstand? Dan kan een loepbril je werk een stuk comfortabeler maken. We meten loepbrillen van Admetec aan en plannen daar alle tijd voor in. Wil je eerst weten wat de mogelijkheden zijn, dan maken we een afspraak voor een informatiegesprek."
]
```

#### `src/content/teksten/collectie.json` — bij "Niet iedereen zoekt hetzelfde"

```json
[
  {
    "titel": "Loepbrillen",
    "tekst": "Handgemaakte vergrootloepen met bijpassende verlichting, voor wie precisiewerk doet. Voor een loepbril plannen we een apart gesprek in."
  }
]
```

#### `src/content/teksten/ultiem-nauwkeurig-zicht.json` — bij "Voor iedereen die scherper wil zien"

```json
[
  "Werk je met een loepbril? Voor het aanmeten van een Admetec loepbril plannen we een ruimere afspraak van zestig minuten, inclusief oogmeting. Wil je eerst alleen informatie, dan reserveren we dertig minuten."
]
```

#### `src/content/teksten/afspraak-maken.json` — bij "Kies zelf een moment dat jou uitkomt"

```json
[
  {
    "titel": "Loepbril Admetec",
    "tekst": "Eerst informatie over het werken met een loepbril (30 minuten), of meteen aanmeten met oogmeting (60 minuten)."
  }
]
```

#### `src/content/teksten/home.json` — bij "veelgestelde vragen"

```json
[
  {
    "vraag": "Hoe werkt het aanmeten van een loepbril?",
    "antwoord": "Wil je eerst weten wat een Admetec loepbril voor je werk kan betekenen, kies dan een informatieafspraak van 30 minuten. Ben je eruit, dan plan je een oogmeting en aanmeting van 60 minuten."
  }
]
```

---

## Stap 3 — nalopen

- [ ] `npm run check` en `npm run test:e2e` groen
- [ ] `/loepbrillen/` geeft 200 en staat weer in het menu
- [ ] De sitemap noemt `/loepbrillen/`
- [ ] In **OO2** staan de twee loepbrilafspraken weer aan, met de juiste duur:
      informatie 30 minuten, aanmeten met oogmeting 60 minuten. De agenda op de
      site komt van OO2, dus wat daar niet staat, kan niemand boeken.
