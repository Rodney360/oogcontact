import type { Metadata } from 'next'

import { InhoudsPagina } from '@/components/InhoudsPagina'
import { Video } from '@/components/Video'
import { Verschijnt } from '@/components/Beweging'
import { tekst } from '@/content/teksten/index'
import { BEDRIJF } from '@/content/bedrijf'
import { paginaMeta } from '@/lib/seo'
import { VIDEO_AAN } from '../../../config/schakelaars.mjs'

const T = tekst('ultiem-nauwkeurig-zicht')

export const metadata: Metadata = paginaMeta({
  titel: T.metaTitel,
  omschrijving: T.metaOmschrijving,
  pad: '/ultiem-nauwkeurig-zicht/',
})

export default function UltiemNauwkeurigZicht() {
  return (
    <InhoudsPagina
      tekst={T}
      beeldSlot="meting-apparaat"
      bovenkop="Nauwkeurig meten"
      beeldBijSectie={{ kop: 'Van meting naar glas: inmeten met Visioffice', slot: 'visioffice' }}
      kruimels={[
        { naam: 'Home', pad: '/' },
        { naam: 'Ultiem nauwkeurig zicht', pad: '/ultiem-nauwkeurig-zicht/' },
      ]}
    >
      {/* De video staat uit zolang er geen nieuwe link is; zie config/schakelaars.mjs. */}
      {VIDEO_AAN && (
        <Verschijnt className="mt-20">
          <h2 className="text-kop-3">Zien hoe het werkt</h2>
          <p className="mt-5 leesbreedte text-basis text-tekst-zacht">
            Essilor maakte een video over het meten in honderdsten. Hij laadt pas als je op
            afspelen klikt.
          </p>
          <div className="mt-8">
            <Video youtubeId={BEDRIJF.video.youtubeId} titel={BEDRIJF.video.titel} />
          </div>
        </Verschijnt>
      )}
    </InhoudsPagina>
  )
}
