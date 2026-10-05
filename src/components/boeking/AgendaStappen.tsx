/**
 * De stappen van de online agenda, op onze eigen pagina uitgelegd.
 *
 * De agenda is van OO2. Wat daarin staat - ook de knop aan het eind - kunnen wij
 * niet aanpassen. Juist die laatste knop wordt over het hoofd gezien: wie hem
 * niet aanklikt, denkt een afspraak te hebben terwijl er niets in de agenda
 * staat. Daarom zeggen wij het hier, boven de agenda, en nog een keer eronder.
 *
 * Alles staat op de gewone donkere achtergrond, zodat alleen kleurparen
 * gebruikt worden die `npm run check:contrast` al controleert.
 */

const STAPPEN = ['Kies waarvoor je komt', 'Kies een dag en een tijd', 'Vul je gegevens in']

function Nummer({ n, nadruk = false }: { n: number; nadruk?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={
        'flex size-9 shrink-0 items-center justify-center rounded-full text-basis font-semibold ' +
        (nadruk ? 'bg-messing text-inkt' : 'border border-inkt-rand-sterk text-tekst-licht')
      }
    >
      {n}
    </span>
  )
}

/** Boven de agenda: de vier stappen, met de laatste in messing. */
export function AgendaStappen() {
  return (
    <ol className="leesbreedte space-y-4" aria-label="Zo maak je een afspraak">
      {STAPPEN.map((stap, i) => (
        <li key={stap} className="flex items-center gap-4 text-basis text-tekst-licht">
          <Nummer n={i + 1} />
          {stap}
        </li>
      ))}
      <li className="rounded-groot border-2 border-messing p-5">
        <div className="flex items-center gap-4">
          <Nummer n={4} nadruk />
          <span className="text-groot font-semibold text-messing">Bevestig je afspraak</span>
        </div>
        <p className="mt-3 text-basis text-tekst-licht">
          Dit is de belangrijkste stap. Klik helemaal aan het eind op de knop om je afspraak te
          bevestigen. <strong className="font-semibold">Pas dan staat hij echt in onze agenda.</strong>
        </p>
      </li>
    </ol>
  )
}

/** Direct onder de agenda: nog één keer, op de plek waar je bent als je klaar bent. */
export function AgendaHerinnering() {
  return (
    <p className="rounded-groot border-2 border-messing p-5 text-basis text-tekst-licht">
      <span className="font-semibold text-messing">Alles ingevuld?</span> Vergeet dan de knop aan
      het eind niet: pas na het bevestigen staat je afspraak vast. Zie je de knop niet, scroll dan
      in het agendavak zelf nog wat naar beneden.
    </p>
  )
}
