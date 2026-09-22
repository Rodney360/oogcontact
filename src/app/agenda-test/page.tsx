import type { Metadata } from 'next'

import { BEDRIJF } from '@/content/bedrijf'

/**
 * Een testpagina om uit te zoeken waarom de agenda op een iPhone leeg blijft.
 *
 * Op de oude WordPress-site doet diezelfde agenda het wél op dezelfde telefoon.
 * Het ligt dus niet aan OO2 en niet aan de telefoon, maar aan iets op onze
 * pagina. Hieronder staan vier varianten onder elkaar. Welke wel en niet
 * werken, wijst precies aan waar het aan ligt:
 *
 *   A werkt, C niet  -> het ligt aan onze opmaak (afronding, rand, hoogte)
 *   A werkt, B niet  -> het ligt aan ?language=dutch
 *   niets werkt      -> het ligt aan de headers van de site (CSP, Permissions)
 *   D werkt wel      -> insluiten kan niet op deze telefoon, los openen wel
 *
 * Bewust geen onderdeel van de site: niet in het menu, niet in de sitemap, en
 * zoekmachines wordt gevraagd hem te laten staan. Hij mag weg zodra het
 * opgelost is.
 */
export const metadata: Metadata = {
  title: 'Test van de agenda',
  description: 'Uitzoeken waarom de agenda op een telefoon leeg blijft.',
  robots: { index: false, follow: false },
}

const STUK: React.CSSProperties = {
  margin: '0 0 32px',
  padding: '12px',
  border: '2px solid #C9A96A',
  borderRadius: '4px',
}

export default function AgendaTest() {
  return (
    <main style={{ background: '#fff', color: '#111', padding: '96px 12px 48px', font: '16px/1.5 system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '22px', margin: '0 0 8px' }}>Test van de agenda</h1>
      <p style={{ margin: '0 0 24px' }}>
        Vier varianten. Zeg per stuk of je de agenda ziet of een leeg wit vlak.
        Het gouden randje is van ons — dat hoort er altijd te staan.
      </p>

      <section style={STUK}>
        <h2 style={{ fontSize: '18px', margin: '0 0 8px' }}>A — precies zoals de oude site</h2>
        <iframe
          src={BEDRIJF.onlineAgenda}
          title="Agenda variant A"
          width="100%"
          height={750}
          style={{ maxWidth: '100%', maxHeight: '4827px' }}
        />
      </section>

      <section style={STUK}>
        <h2 style={{ fontSize: '18px', margin: '0 0 8px' }}>B — hetzelfde, maar met de taalinstelling</h2>
        <iframe
          src={`${BEDRIJF.onlineAgenda}?language=dutch`}
          title="Agenda variant B"
          width="100%"
          height={750}
          style={{ maxWidth: '100%', maxHeight: '4827px' }}
        />
      </section>

      <section style={STUK}>
        <h2 style={{ fontSize: '18px', margin: '0 0 8px' }}>C — zoals hij nu op de site staat</h2>
        <iframe
          src={`${BEDRIJF.onlineAgenda}?language=dutch`}
          title="Agenda variant C"
          className="block h-[44rem] w-full rounded-groot border border-inkt-rand bg-white md:h-[48rem]"
        />
      </section>

      <section style={STUK}>
        <h2 style={{ fontSize: '18px', margin: '0 0 8px' }}>D — helemaal niet ingesloten</h2>
        <p style={{ margin: '0 0 12px' }}>
          Deze opent de agenda in een eigen tabblad. Doet die het wel, dan is dat
          de uitweg voor telefoons.
        </p>
        <a
          href={BEDRIJF.onlineAgenda}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', padding: '14px 20px', background: '#C9A96A', color: '#111', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 }}
        >
          Agenda openen in een nieuw tabblad
        </a>
      </section>
    </main>
  )
}
