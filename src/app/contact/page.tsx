import type { Metadata } from 'next'

import { Sectie, SectieKop, Oproep } from '@/components/Sectie'
import { Kruimelpad } from '@/components/InhoudsPagina'
import { Verschijnt } from '@/components/Beweging'
import { ContactFormulier } from '@/components/ContactFormulier'
import { TERUGBELFORMULIER_AAN } from '../../../config/schakelaars.mjs'
import { OpeningsStatus } from '@/components/OpeningsStatus'
import { Kaart } from '@/components/Kaart'
import { Beeld } from '@/components/Beeld'
import { tekst } from '@/content/teksten/index'
import { BEDRIJF, adresOpEenRegel, whatsappLink, routeLink } from '@/content/bedrijf'
import { WEEK, naarTijd } from '@/content/openingstijden'
import { uitzonderingen } from '@/lib/beheer'
import { paginaMeta, JsonLd, kruimelsJsonLd } from '@/lib/seo'

const T = tekst('contact')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/contact/',
})

const KRUIMELS = [
  { naam: 'Home', pad: '/' },
  { naam: 'Contact', pad: '/contact/' },
]

export default function Contact() {
  const afwijkendeDagen = uitzonderingen()

  return (
    <>
      <JsonLd data={kruimelsJsonLd(KRUIMELS)} />

      <Sectie className="pt-36 md:pt-44">
        <Kruimelpad kruimels={KRUIMELS} />
        <SectieKop niveau={1} bovenkop="Contact" kop={T.h1} inleiding={T.inleiding} className="mt-6" />
      </Sectie>

      {/* De vier manieren om ons te bereiken */}
      <Sectie compact>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Bellen',
              waarde: BEDRIJF.telefoon.weergave,
              href: `tel:${BEDRIJF.telefoon.link}`,
              uitleg: 'Tijdens openingstijden nemen we gewoon zelf op.',
            },
            {
              // Geen nummer: de tegel zelf is de knop naar WhatsApp.
              label: 'WhatsApp',
              waarde: 'App ons',
              href: whatsappLink(),
              uitleg: 'Handig voor een korte vraag of een foto van je bril.',
            },
            {
              label: 'E-mail',
              waarde: BEDRIJF.email,
              href: `mailto:${BEDRIJF.email}`,
              uitleg: 'We reageren zo snel mogelijk.',
            },
            {
              label: 'Langskomen',
              waarde: adresOpEenRegel(),
              href: routeLink(),
              uitleg: 'Ook zonder afspraak ben je welkom om rond te kijken.',
            },
          ].map((manier, i) => (
            <Verschijnt key={manier.label} als="li" vertraging={i * 0.07}>
              <a
                href={manier.href}
                {...(manier.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex h-full flex-col rounded-kaart border border-inkt-rand bg-inkt-zacht p-6 no-underline transition-colors hover:border-messing"
              >
                <span className="text-bijschrift uppercase tracking-[0.14em] text-messing">
                  {manier.label}
                </span>
                <span className="mt-3 break-words text-groot text-tekst-licht">{manier.waarde}</span>
                <span className="mt-3 text-bijschrift text-tekst-licht-zacht">{manier.uitleg}</span>
              </a>
            </Verschijnt>
          ))}
        </ul>
      </Sectie>

      {/* Openingstijden, route en de winkel */}
      <Sectie licht compact>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="space-y-10">
            <Verschijnt>
              <div className="rounded-groot border border-ivoor-rand bg-ivoor-zacht p-7">
                <h2 className="text-kop-3">Openingstijden</h2>
                <OpeningsStatus opLicht uitzonderingen={afwijkendeDagen} className="mt-4" />

                <table className="mt-6 w-full text-basis">
                  <caption className="alleen-voor-schermlezers">Onze openingstijden per dag</caption>
                  <tbody>
                    {WEEK.map((dag) => {
                      const deel = dag.dagdelen[0]
                      return (
                        <tr key={dag.dag} className="border-t border-ivoor-rand">
                          <th scope="row" className="py-2.5 pr-4 text-left font-normal text-tekst-zacht">
                            {dag.naam}
                          </th>
                          <td className="py-2.5 text-right tabular-nums text-tekst">
                            {deel ? `${naarTijd(deel.van)} - ${naarTijd(deel.tot)}` : 'gesloten'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Verschijnt>

            {/* Wat de tekst verder over de winkel zegt */}
            {T.secties.map((sectie, i) => (
              <Verschijnt key={sectie.kop} vertraging={0.05 + i * 0.05}>
                <section>
                  <h2 className="text-kop-4">{sectie.kop}</h2>
                  {sectie.alineas.map((a) => (
                    <p key={a.slice(0, 40)} className="mt-4 leesbreedte text-basis text-tekst-zacht">
                      {a}
                    </p>
                  ))}
                  {sectie.opsomming.length > 0 && (
                    <dl className="mt-6 space-y-5">
                      {sectie.opsomming.map((regel) => (
                        <div key={regel.titel}>
                          <dt className="text-basis font-medium text-tekst">{regel.titel}</dt>
                          <dd className="mt-1 text-basis text-tekst-zacht">{regel.tekst}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </section>
              </Verschijnt>
            ))}
          </div>

          <div className="space-y-10">
            <Verschijnt richting="rechts">
              <div className="overflow-hidden rounded-groot border border-ivoor-rand">
                <Beeld slot="winkel-gevel" sizes="(min-width: 1024px) 50vw, 100vw" vullend />
              </div>
            </Verschijnt>
            <Verschijnt richting="rechts" vertraging={0.1}>
              <Kaart licht />
            </Verschijnt>
          </div>
        </div>
      </Sectie>

      {/* Het formulier. Staat uit; zie config/schakelaars.mjs. */}
      {TERUGBELFORMULIER_AAN && (
      <Sectie id="formulier">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectieKop
            bovenkop="Laat iets weten"
            kop="Liever dat wij jou bellen?"
            inleiding={
              'Vul hieronder in waar het over gaat, dan nemen we contact met je op. ' +
              'Wil je liever meteen zelf een moment kiezen? Dat kan op de pagina ' +
              'Afspraak maken.'
            }
          />
          <Verschijnt vertraging={0.1}>
            <ContactFormulier />
          </Verschijnt>
        </div>
      </Sectie>
      )}

      <Oproep kop={T.oproep.kop} tekst={T.oproep.tekst} knop={T.oproep.knop} licht />
    </>
  )
}
