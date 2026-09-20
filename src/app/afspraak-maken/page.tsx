import type { Metadata } from 'next'

import { Boeking } from '@/components/boeking/Boeking'
import { ContactFormulier } from '@/components/ContactFormulier'
import { Sectie, SectieKop, Leeskolom } from '@/components/Sectie'
import { Kruimelpad } from '@/components/InhoudsPagina'
import { Verschijnt } from '@/components/Beweging'
import { KnopLink } from '@/components/Knop'
import { OpeningsStatus } from '@/components/OpeningsStatus'
import { tekst } from '@/content/teksten/index'
import { BEDRIJF, whatsappLink } from '@/content/bedrijf'
import { uitzonderingen } from '@/lib/beheer'
import { paginaMeta, JsonLd, kruimelsJsonLd } from '@/lib/seo'

const T = tekst('afspraak-maken')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/afspraak-maken/',
})

const KRUIMELS = [
  { naam: 'Home', pad: '/' },
  { naam: 'Afspraak maken', pad: '/afspraak-maken/' },
]

export default function AfspraakMaken() {
  const afwijkendeDagen = uitzonderingen()

  return (
    <>
      <JsonLd data={kruimelsJsonLd(KRUIMELS)} />

      <Sectie className="pt-36 md:pt-44">
        <Kruimelpad kruimels={KRUIMELS} />
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <SectieKop niveau={1} bovenkop="Afspraak maken" kop={T.h1} inleiding={T.inleiding} />

          <Verschijnt vertraging={0.1}>
            <div className="rounded-groot border border-inkt-rand bg-inkt-zacht/60 p-6">
              <p className="text-bijschrift uppercase tracking-[0.14em] text-messing">
                Liever even bellen?
              </p>
              <OpeningsStatus uitzonderingen={afwijkendeDagen} className="mt-3" />
              <div className="mt-5 flex flex-wrap gap-3">
                <KnopLink href={`tel:${BEDRIJF.telefoon.link}`} uiterlijk="ivoor">
                  {BEDRIJF.telefoon.weergave}
                </KnopLink>
                <KnopLink href={whatsappLink()} uiterlijk="omlijnd">
                  WhatsApp
                </KnopLink>
              </div>
            </div>
          </Verschijnt>
        </div>
      </Sectie>

      {/* De boekingsmodule */}
      <Sectie compact id="online">
        <h2 className="text-kop-2">Plan je afspraak online</h2>
        <p className="mt-5 leesbreedte text-lead text-tekst-licht-zacht">
          In een paar stappen: kies waarvoor je komt, wanneer het schikt, en laat je gegevens
          achter. Je krijgt meteen een bevestiging per e-mail.
        </p>
        <div className="mt-12">
          <Boeking />
        </div>
      </Sectie>

      {/* Wat de tekst verder vertelt */}
      {T.secties.length > 0 && (
        <Sectie licht compact>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {T.secties.map((sectie, i) => (
              <Verschijnt key={sectie.kop} als="section" vertraging={i * 0.07}>
                <h2 className="text-kop-4">{sectie.kop}</h2>
                {sectie.alineas.map((a) => (
                  <p key={a.slice(0, 40)} className="mt-4 text-basis text-tekst-zacht">
                    {a}
                  </p>
                ))}
                {sectie.opsomming.length > 0 && (
                  <dl className="mt-6 space-y-4">
                    {sectie.opsomming.map((regel) => (
                      <div key={regel.titel} className="border-t border-ivoor-rand pt-4">
                        <dt className="text-basis font-medium text-tekst">{regel.titel}</dt>
                        <dd className="mt-1 text-basis text-tekst-zacht">{regel.tekst}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </Verschijnt>
            ))}
          </div>
        </Sectie>
      )}

      {/* Het terugbelformulier */}
      <Sectie id="terugbellen">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <SectieKop
              bovenkop="Liever teruggebeld"
              kop="Laat je gegevens achter"
              inleiding={
                'Kom je er online niet uit, of heb je eerst een vraag? Vul dit in, dan bellen ' +
                'of mailen wij jou.'
              }
            />
            <Leeskolom className="mt-8">
              <p className="text-basis text-tekst-licht-zacht">
                Je krijgt altijd een bevestiging per e-mail, zodat je weet dat het aangekomen is.
              </p>
            </Leeskolom>
          </div>
          <Verschijnt vertraging={0.1}>
            <ContactFormulier />
          </Verschijnt>
        </div>
      </Sectie>
    </>
  )
}
