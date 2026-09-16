import type { Metadata } from 'next'

import { Hero } from '@/components/home/Hero'
import { Verhaal } from '@/components/home/Verhaal'
import { Pijlers } from '@/components/home/Pijlers'
import { Meting } from '@/components/home/Meting'
import { Collectie } from '@/components/home/Collectie'
import { AanbodTegels } from '@/components/home/AanbodTegels'
import { Vertrouwen } from '@/components/home/Vertrouwen'
import { BezoekDeWinkel } from '@/components/home/BezoekDeWinkel'
import { Instagram } from '@/components/home/Instagram'
import { Boeking } from '@/components/boeking/Boeking'
import { Sectie, SectieKop } from '@/components/Sectie'
import { Vragen } from '@/components/Vragen'
import { tekst, sectie } from '@/content/teksten/index'
import { herkomsten } from '@/content/merken'
import { uitzonderingen, instagram } from '@/lib/beheer'
import { paginaMeta, JsonLd, vragenJsonLd } from '@/lib/seo'

const T = tekst('home')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/',
})

/**
 * De homepage, opgebouwd uit scènes die je van boven naar beneden doorscrolt.
 *
 * De teksten komen uit src/content/teksten/home.json; de scènes zelf staan in
 * src/components/home/. Een tekst aanpassen kan dus zonder aan deze pagina te
 * komen.
 */
export default async function Home() {
  const afwijkendeDagen = uitzonderingen()
  const instagramBerichten = await instagram()

  return (
    <>
      <JsonLd data={vragenJsonLd(T.vragen)} />

      {/* 1. Hero: van onscherp naar scherp */}
      <Hero
        kop={T.h1}
        inleiding={T.inleiding}
        uitzonderingen={afwijkendeDagen}
      />

      {/* 2. Het verhaal van Gerard en Gerda */}
      <Verhaal sectie={sectie(T, 'Het verhaal van Gerard en Gerda')} />

      {/* 3. Waarom Oogcontact: de vier pijlers */}
      <Pijlers sectie={sectie(T, 'Waarom Oogcontact')} />

      {/* 4. De oogmeting, stap voor stap */}
      <Meting sectie={sectie(T, 'Ultiem nauwkeurig zicht')} />

      {/* 5. De collectie */}
      <Collectie sectie={sectie(T, 'De collectie')} herkomsten={herkomsten()} />

      {/* 6. Het aanbod als beeldtegels */}
      <AanbodTegels sectie={sectie(T, 'Aanbod')} />

      {/* 7. Waar je op kunt rekenen */}
      <Vertrouwen sectie={sectie(T, 'Vertrouwen')} />

      {/* 8. De boekingsmodule, gewoon op de pagina zelf */}
      <Sectie id="afspraak">
        <SectieKop
          bovenkop="Afspraak maken"
          kop={T.oproep.kop}
          inleiding={T.oproep.tekst}
        />
        <div className="mt-12">
          <Boeking />
        </div>
      </Sectie>

      {/* 9. Bezoek de winkel */}
      <BezoekDeWinkel sectie={sectie(T, 'Bezoek de winkel')} uitzonderingen={afwijkendeDagen} />

      {/* 10. Instagram */}
      <Instagram berichten={instagramBerichten} />

      {/* Veelgestelde vragen */}
      <Sectie compact>
        <SectieKop kop="Veelgestelde vragen" />
        <Vragen vragen={T.vragen} />
      </Sectie>
    </>
  )
}
