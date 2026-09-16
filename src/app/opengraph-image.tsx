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

export default function Afbeelding() {
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
        {/* De brilvorm uit het logo */}
        <svg width="230" height="70" viewBox="0 0 120 36">
          <g fill="none" stroke={IVOOR} strokeWidth="3.4" strokeLinecap="round">
            <circle cx="30" cy="19" r="14.5" />
            <circle cx="76" cy="19" r="14.5" />
            <path d="M44.5 17.5c3.5-2.6 13.5-2.6 17 0" />
            <path d="M15.5 17.5C12 14.9 6 14.9 2.5 17.5" />
            <path d="M90.5 17.5c3.5-2.6 9.5-2.6 13 0" />
          </g>
        </svg>

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
