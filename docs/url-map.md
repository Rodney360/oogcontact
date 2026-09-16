# Van oude naar nieuwe URL

Dit bestand wordt gemaakt door `node scripts/genereer-url-map.mjs` op basis van
`config/url-map.mjs`. Pas dus dat bestand aan, niet dit.

De site draait met `trailingSlash: true`. Alle oude pagina-URL's eindigden op
een slash en blijven daardoor **letterlijk hetzelfde werken**. Dat is het beste
wat je voor de vindbaarheid kunt doen: geen enkele bestaande link, bladwijzer of
zoekresultaat raakt kapot.

---

## Blijft precies zoals het was (13 pagina's)

Geen redirect nodig. Deze adressen werken na de overstap nog gewoon.

| URL | Pagina |
|---|---|
| `/` | Home |
| `/ultiem-nauwkeurig-zicht/` | Ultiem nauwkeurig zicht |
| `/aanbod/` | Aanbod |
| `/brillen/` | Brillen |
| `/contactlenzen/` | Contactlenzen |
| `/zonnebrillen/` | Zonnebrillen |
| `/kinderbrillen/` | Kinderbrillen |
| `/loepbrillen/` | Loepbrillen |
| `/nieuws/` | Nieuws |
| `/over-ons/` | Over ons |
| `/contact/` | Contact |
| `/afspraak-maken/` | Afspraak maken |
| `/algemene-voorwaarden/` | Algemene voorwaarden |

---

## Verhuist, met een permanente doorverwijzing (16 regels)

Deze adressen krijgen een 301: zoekmachines weten dan dat het adres definitief
veranderd is en nemen de opgebouwde waarde mee naar het nieuwe adres.

| Oud adres | Nieuw adres | Waarom |
|---|---|---|
| `/privacybeleid/` | `/privacyverklaring/` | Duidelijkere naam; inhoud is opnieuw geschreven op basis van wat de site echt doet. |
| `/home/ultiem-nauwkeurig-zicht/` | `/ultiem-nauwkeurig-zicht/` | Dubbele pagina in WordPress. Er is er nog maar een. |
| `/category/geen-categorie/` | `/nieuws/` | Categorie-archieven van WordPress vervallen; al het nieuws staat op een plek. |
| `/category/geen-categorie/actualiteiten/` | `/nieuws/` | Categorie-archieven van WordPress vervallen. |
| `/feed/` | `/nieuws/rss.xml` | De WordPress-feed wordt de nieuwe RSS-feed. |
| `/nieuws/feed/` | `/nieuws/rss.xml` | De WordPress-feed wordt de nieuwe RSS-feed. |
| `/comments/feed/` | `/nieuws/rss.xml` | Reacties bestonden niet echt; verwijst nu naar het nieuwsoverzicht. |
| `/12-tot-en-met-19-september-is-de-winkel-gesloten/` | `/nieuws/12-tot-en-met-19-september-is-de-winkel-gesloten/` | Nieuwsberichten staan nu overzichtelijk onder /nieuws/. |
| `/afwijkende-openingstijden/` | `/nieuws/afwijkende-openingstijden/` | Nieuwsberichten staan nu overzichtelijk onder /nieuws/. |
| `/kids-oogcheckweken-6-18-jaar/` | `/nieuws/kids-oogcheckweken-6-18-jaar/` | Nieuwsberichten staan nu overzichtelijk onder /nieuws/. |
| `/oogcontact-bij-gerard-is-op-inkoop/` | `/nieuws/oogcontact-bij-gerard-is-op-inkoop/` | Nieuwsberichten staan nu overzichtelijk onder /nieuws/. |
| `/extra-drukte-op-het-overwinningsplein/` | `/nieuws/extra-drukte-op-het-overwinningsplein/` | Nieuwsberichten staan nu overzichtelijk onder /nieuws/. |
| `/wp-login.php` | `/` | WordPress bestaat niet meer. |
| `/wp-admin/:pad*` | `/` | WordPress bestaat niet meer. |
| `/author/:pad*` | `/nieuws/` | Auteursarchieven van WordPress vervallen. |
| `/tag/:pad*` | `/nieuws/` | Tag-archieven van WordPress vervallen. |

---

## Nieuw op de site (3 pagina's)

Deze pagina's bestonden nog niet op de oude site.

| URL | Pagina |
|---|---|
| `/collectie/` | Collectie & merken |
| `/privacyverklaring/` | Privacyverklaring |
| `/cookieverklaring/` | Cookieverklaring |

---

## Afbeeldingen

De oude site serveerde afbeeldingen vanuit `/wp-content/uploads/...`. Die
adressen worden niet één voor één doorverwezen: het zijn er ruim 250, ze staan
niet in zoekresultaten en ze worden nergens meer gebruikt. De originelen zijn
wel allemaal bewaard in `assets-original/`, en de site gebruikt de verwerkte
versies uit `public/beeld/`.

Blijkt uit Search Console dat een bepaalde afbeelding tóch verkeer trekt, dan is
daar alsnog een regel voor toe te voegen in `config/url-map.mjs`.

---

## Controleren

`tests/e2e/redirects.spec.ts` loopt deze hele lijst na op de draaiende site.
Zo weet je zeker dat elke regel het ook echt doet, en niet alleen op papier.
