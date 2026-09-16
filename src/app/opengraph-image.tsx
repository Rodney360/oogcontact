import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'

import { BEDRIJF, adresOpEenRegel } from '@/content/bedrijf'

/**
 * De afbeelding die verschijnt als iemand een link naar de site deelt, in
 * WhatsApp, op Facebook of in een appje.
 *
 * Wordt bij het bouwen gemaakt, in de huisstijl: inktdonker met het ivoren
 * merkteken en een messing accentlijn.
 */

export const alt = `${BEDRIJF.naam} · opticien in Groningen`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INKT = '#11151C'
const IVOOR = '#FBF2E6'
const MESSING = '#C9A96A'

export default async function Afbeelding() {
  // Het logo staat als SVG in public/; next/og kan daar geen bestandspad naar
  // volgen, dus we lezen hem in en geven hem als data-URI mee.
  const bestand = await readFile(
    path.join(process.cwd(), 'public', 'logo', 'oogcontact-bij-gerard-licht.svg'),
    'utf8',
  )
  const logo = `data:image/svg+xml;base64,${Buffer.from(bestand).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: INKT,
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Het echte logo, als data-URI ingelezen bij het bouwen. */}
        <img src={logo} alt="" width={320} height={68} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 74, color: IVOOR, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            {BEDRIJF.naam}
          </div>
          <div style={{ fontSize: 38, color: MESSING, marginTop: 20, fontStyle: 'italic' }}>
            {BEDRIJF.slogan}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ width: 64, height: 3, background: MESSING }} />
          <div style={{ fontSize: 26, color: '#B9AF9F' }}>{adresOpEenRegel()}</div>
        </div>
      </div>
    ),
    size,
  )
}
