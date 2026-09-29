/**
 * Of het beheerscherm op `/keystatic` echt kan opslaan.
 *
 * Keystatic kent twee manieren van bewaren, en dat staat in
 * `keystatic.config.ts`:
 *
 *   - **github** — als `KEYSTATIC_GITHUB_REPO` is ingevuld. Opslaan wordt dan
 *     een commit in de repo, en een paar minuten later staat het live. Dit is
 *     wat Gerard en Gerda nodig hebben.
 *   - **local** — als die niet is ingevuld. Opslaan schrijft dan in de
 *     bestanden op de computer waar de site draait.
 *
 * Dat tweede werkt alleen tijdens `npm run dev`. Op Vercel bestaat die
 * computer maar heel even en is hij alleen-lezen: je klikt op Save, je ziet
 * geen foutmelding, en er gebeurt niets. Precies het soort mislukking dat je
 * pas merkt als een klant voor een gesloten deur staat.
 *
 * Daarom vraagt de site het hier één keer, en laat het beheerscherm zichzelf
 * niet zien als het toch niets kan bewaren.
 *
 * Staat los van `beheer.ts`: dat bestand leest wat er ingevuld is, dit bestand
 * gaat over of er überhaupt ingevuld kan worden.
 */
export function beheerKanOpslaan(): boolean {
  if (process.env.KEYSTATIC_GITHUB_REPO) return true
  return process.env.NODE_ENV === 'development'
}
