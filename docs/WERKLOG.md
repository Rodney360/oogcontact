# Werklog

Na elke sessie twee tot vier regels: de datum, wie er gewerkt heeft, wat er
veranderd is en wat er nog openstaat. Zo weten Dennis en Gerard van elkaar wat
er gebeurd is, ook als er een tijd tussen zit.

Nieuwste bovenaan.

---

## 2026-09-16 — Dennis (Claude Code, cloud)

De hele site opnieuw opgebouwd, vanaf niets, als vervanging van WordPress.

- **Archief:** de complete oude site opgehaald en vastgelegd — 15 pagina's,
  5 nieuwsberichten en alle 256 originele foto's staan in de repo, zodat er
  niets verdwijnt als WordPress wordt opgezegd.
- **Basis:** Next.js 16 met TypeScript en Tailwind 4, een huisstijl waarvan het
  contrast automatisch op WCAG AA gecontroleerd wordt, het logo als SVG, en een
  beeldpipeline die van de originelen AVIF en WebP maakt.
- **Werking:** boekingsmodule op de pagina zelf, aanvraagformulier, e-mail via
  Resend en een beheerscherm (Keystatic) voor nieuws, vakantiemeldingen,
  afwijkende openingstijden en merken. Zonder API-sleutels draait alles in
  testmodus.
- **Teksten:** opnieuw geschreven op basis van het archief en daarna nagekeken
  op verzonnen feiten en op de aanspreekvorm. Dat leverde 37 correcties op,
  waaronder medische claims zonder grond, een verzonnen taakverdeling tussen
  Gerard en Gerda, en getallen uit 2021 die nu niet meer kloppen. Alles staat
  op een rij in `docs/teksten-review.md`.
- **Gemeten:** 107 browsertests op desktop en mobiel groen, 27 snelle tests
  groen, alle kleurcombinaties voldoen aan WCAG AA. Na compressie 158 tot
  197 kB JavaScript, LCP tussen 0,4 en 1,0 seconde, CLS 0,000.
- **Openstaand:** zie `docs/open-punten.md`. Het belangrijkste: de koppeling met
  Vercel, de API-sleutel van de online agenda, het KvK-nummer en de nieuwe
  winkelfoto's.
