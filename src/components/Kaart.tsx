/**
 * De kaart bij de winkel.
 *
 * Bewust géén ingesloten Google Maps: dat zet cookies en laadt zwaar. In plaats
 * daarvan een rustige, zelfgetekende plattegrond in de huisstijl, met een knop
 * die de echte kaart opent in de app van de bezoeker zelf.
 */

import { BEDRIJF, adresOpEenRegel, routeLink } from '@/content/bedrijf'
import { KnopLink } from '@/components/Knop'

export function Kaart({ licht = false }: { licht?: boolean }) {
  const rand = licht ? 'var(--color-ivoor-rand)' : 'var(--color-inkt-rand)'
  const vlak = licht ? 'var(--color-ivoor-zacht)' : 'var(--color-inkt-zacht)'

  return (
    <figure className="m-0">
      <div
        className="relative overflow-hidden rounded-groot border"
        style={{ borderColor: rand, backgroundColor: vlak }}
      >
        <svg viewBox="0 0 800 500" className="h-auto w-full" role="img" aria-labelledby="kaart-titel">
          <title id="kaart-titel">
            Plattegrond van de omgeving van {BEDRIJF.naam} aan het {BEDRIJF.adres.straat} in{' '}
            {BEDRIJF.adres.plaats}.
          </title>

          {/* De ondergrond */}
          <rect width="800" height="500" fill={vlak} />

          {/* Het plein en de straten, als rustige vlakken en lijnen */}
          <g stroke={rand} strokeWidth="1.5" fill="none">
            <path d="M0 150h800M0 340h800M210 0v500M560 0v500" />
          </g>
          <g stroke={licht ? 'var(--color-ivoor-rand)' : 'var(--color-inkt-rand)'} strokeWidth="26" strokeLinecap="round" fill="none" opacity="0.55">
            <path d="M-20 245h840" />
            <path d="M385 -20v540" />
          </g>

          {/* Het plein */}
          <rect x="250" y="185" width="270" height="120" rx="10" fill={rand} opacity="0.5" />
          <text
            x="385" y="252"
            textAnchor="middle"
            fontSize="17"
            fontFamily="var(--font-tekst)"
            fill={licht ? 'var(--color-tekst-zacht)' : 'var(--color-tekst-licht-zacht)'}
          >
            Overwinningsplein
          </text>

          {/* De winkel, als brilvorm op de plek zelf */}
          <g transform="translate(560 200)">
            <circle r="34" fill="var(--color-messing)" />
            <g fill="none" stroke="var(--color-inkt)" strokeWidth="2.6" strokeLinecap="round" transform="translate(-19 -6)">
              <circle cx="10" cy="6" r="8.5" />
              <circle cx="28" cy="6" r="8.5" />
              <path d="M18.5 4.6c1.4-1 3.6-1 5 0" />
              <path d="M1.5 4.6C.1 3.6-1.5 3.6-2.9 4.6" />
              <path d="M36.5 4.6c1.4-1 3-1 4.4 0" />
            </g>
          </g>
          <text
            x="560" y="262"
            textAnchor="middle"
            fontSize="18"
            fontWeight="600"
            fontFamily="var(--font-tekst)"
            fill={licht ? 'var(--color-tekst)' : 'var(--color-tekst-licht)'}
          >
            {BEDRIJF.naam}
          </text>
          <text
            x="560" y="286"
            textAnchor="middle"
            fontSize="15"
            fontFamily="var(--font-tekst)"
            fill={licht ? 'var(--color-tekst-zacht)' : 'var(--color-tekst-licht-zacht)'}
          >
            {BEDRIJF.adres.straat}
          </text>

          {/* De bushalte, pal voor de deur */}
          <g transform="translate(470 200)">
            <circle r="13" fill="none" stroke={licht ? 'var(--color-tekst-zacht)' : 'var(--color-tekst-licht-zacht)'} strokeWidth="1.6" />
            <rect x="-5" y="-6" width="10" height="9" rx="1.6" fill="none" stroke={licht ? 'var(--color-tekst-zacht)' : 'var(--color-tekst-licht-zacht)'} strokeWidth="1.6" />
            <path d="M-5 5.5h10" stroke={licht ? 'var(--color-tekst-zacht)' : 'var(--color-tekst-licht-zacht)'} strokeWidth="1.6" strokeLinecap="round" />
          </g>
          <text
            x="470" y="234"
            textAnchor="middle"
            fontSize="13"
            fontFamily="var(--font-tekst)"
            fill={licht ? 'var(--color-tekst-zacht)' : 'var(--color-tekst-licht-zacht)'}
          >
            bushalte
          </text>
        </svg>
      </div>

      <figcaption className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
        <p className={`text-basis ${licht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht'}`}>
          {adresOpEenRegel()}
        </p>
        <KnopLink href={routeLink()} uiterlijk={licht ? 'omlijnd-donker' : 'omlijnd'}>
          Route plannen
        </KnopLink>
      </figcaption>
    </figure>
  )
}
