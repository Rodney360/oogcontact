---
description: Loop de preview van deze branch na voordat je hem laat zien
---

Controleer of deze branch klaar is om te bekijken.

1. Draai `npm run check` (lint, typecheck, contrast en de snelle tests).
   Los alles op wat er misgaat. Verzwijg niets: gaat er iets niet goed, zeg dat
   dan gewoon.
2. Draai `npm run build` en controleer dat die slaagt.
3. Draai `npm run test:e2e` als de testbrowser beschikbaar is.
4. Kijk je eigen wijzigingen na met `git diff`, alsof je ze voor het eerst ziet.
   Let vooral op:
   - staat er ergens "u" in plaats van "je"?
   - staan er verzonnen feiten in (prijzen, datums, merknamen)?
   - hebben alle afbeeldingen een goede Nederlandse alt-tekst?
   - zijn alle knoppen minstens 44 bij 44 pixels?
   - werkt alles ook zonder API-sleutels (testmodus)?
5. Vat samen wat er veranderd is, in gewone taal, en wat er op de preview te
   zien is. Noem erbij wat er nog openstaat.
