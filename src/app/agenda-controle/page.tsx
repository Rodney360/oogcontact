import type { Metadata } from 'next'

import { Sectie, SectieKop, Leeskolom } from '@/components/Sectie'
import { controleerAgenda } from '@/lib/agenda/client'

/**
 * Een hulppagina voor Gerard en Gerda: werkt de koppeling met de online
 * agenda, en zo niet, waar hangt het dan?
 *
 * Bewust geen onderdeel van de site: hij staat niet in het menu, niet in de
 * sitemap, en zoekmachines wordt gevraagd hem te laten staan. Er komen ook
 * nooit sleutels of wachtwoorden op te staan - alleen of ze werken.
 *
 * De pagina wordt bij elk bezoek opnieuw opgehaald; een opgeslagen versie zou
 * een verouderd antwoord laten zien.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Controle van de agenda',
  description: 'Werkt de koppeling met de online agenda?',
  robots: { index: false, follow: false },
}

export default async function AgendaControle() {
  const diagnose = await controleerAgenda()

  return (
    <Sectie className="pt-36 md:pt-44">
      <SectieKop
        niveau={1}
        bovenkop="Controle"
        kop="Werkt de agenda?"
        inleiding={diagnose.kortom}
      />

      <Leeskolom className="mt-12">
        <ol className="flex flex-col gap-8">
          {diagnose.bevindingen.map((b) => (
            <li key={b.naam}>
              <p className={`text-groot font-semibold ${b.goed ? 'text-open' : 'text-fout'}`}>
                {b.goed ? 'Goed' : 'Let op'} — {b.naam}
              </p>
              <p className="mt-2 text-basis text-tekst-licht">{b.uitleg}</p>
              {b.watNu && (
                <p className="mt-2 text-basis text-tekst-licht-zacht">{b.watNu}</p>
              )}
            </li>
          ))}
        </ol>

        <p className="mt-12 text-bijschrift text-tekst-licht-zacht">
          Ververs deze pagina nadat je iets in Vercel of in de agenda hebt aangepast. Let op: een
          wijziging in Vercel telt pas mee na een nieuwe bouw (Redeploy). De stap-voor-stap uitleg
          staat in docs/agenda-koppelen.md.
        </p>
      </Leeskolom>
    </Sectie>
  )
}
