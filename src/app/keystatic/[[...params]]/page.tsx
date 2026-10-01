import Link from 'next/link'

import { beheerKanOpslaan } from '@/lib/beheer-koppeling'

import Beheerscherm from './beheerscherm'

/**
 * Het beheerscherm, maar alleen als opslaan ook echt lukt.
 *
 * Is de koppeling met GitHub er niet, dan zou Keystatic hier gewoon
 * verschijnen en bij Save niets doen, zonder melding. Dan liever dit scherm.
 */
export default function Beheer() {
  if (beheerKanOpslaan()) return <Beheerscherm />

  return (
    <main className="mx-auto flex min-h-[100svh] max-w-[42rem] flex-col justify-center px-6 py-16">
      <p className="text-bijschrift uppercase tracking-[0.18em] text-messing">Beheerscherm</p>
      <h1 className="mt-4 font-kop text-kop-2 text-inkt">Nog niet gekoppeld</h1>
      <p className="mt-6 text-groot text-tekst">
        Het beheerscherm kan op dit moment niets opslaan. Zou je hier iets invullen, dan zou je op
        Save klikken, geen foutmelding krijgen, en zou het tóch niet op de site komen.
      </p>
      <p className="mt-4 text-basis text-tekst">
        Daarom laten we het scherm liever niet zien. Er is niets stuk, en er is niets kwijt: alles
        wat er nu op de site staat, blijft staan.
      </p>
      <div className="mt-8 rounded-kaart border border-ivoor-rand bg-ivoor-zacht p-6">
        <p className="text-basis text-tekst">
          <strong className="font-medium">Wat er moet gebeuren:</strong> de site moet eenmalig aan
          GitHub gekoppeld worden, zodat opslaan daar terechtkomt. Dat is werk van een kwartier en
          het hoeft maar één keer. De stappen staan in <code>docs/live-gaan.md</code>.
        </p>
        <p className="mt-4 text-basis text-tekst">Vraag Dennis ernaar.</p>
      </div>
      <p className="mt-8 text-bijschrift text-tekst-zacht">
        Nieuws, een mededeling of afwijkende openingstijden die niet kunnen wachten? Die kunnen
        ondertussen ook zonder dit scherm op de site gezet worden — vraag Gerard of Dennis.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-11 w-fit items-center rounded-full border border-inkt-rand px-5 py-3 text-bijschrift text-inkt no-underline transition-colors hover:border-messing hover:text-messing"
      >
        Terug naar de site
      </Link>
    </main>
  )
}
