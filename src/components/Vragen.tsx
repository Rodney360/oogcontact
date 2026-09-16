'use client'

/**
 * De veelgestelde vragen.
 *
 * Gebouwd op <details> en <summary>: dat werkt van zichzelf al met het
 * toetsenbord en met schermlezers, ook als er iets misgaat met JavaScript.
 * Het opent en sluit met een animatie die alleen de hoogte van een binnenlaag
 * schaalt, zodat de rest van de pagina niet verspringt.
 */

import { useRef, useState } from 'react'

type Vraag = { vraag: string; antwoord: string }

export function Vragen({ vragen, licht = false }: { vragen: Vraag[]; licht?: boolean }) {
  if (vragen.length === 0) return null

  return (
    <ul className="mt-12 space-y-3">
      {vragen.map((v) => (
        <VraagRegel key={v.vraag} vraag={v} licht={licht} />
      ))}
    </ul>
  )
}

function VraagRegel({ vraag, licht }: { vraag: Vraag; licht: boolean }) {
  const [open, setOpen] = useState(false)
  const inhoud = useRef<HTMLDivElement>(null)

  return (
    <li
      className={[
        'overflow-hidden rounded-kaart border transition-colors',
        licht ? 'border-ivoor-rand bg-ivoor-zacht' : 'border-inkt-rand bg-inkt-zacht',
      ].join(' ')}
    >
      <details open={open} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
        <summary
          className={[
            'flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 px-6 py-5',
            'text-groot font-medium [&::-webkit-details-marker]:hidden',
            licht ? 'text-tekst' : 'text-tekst-licht',
          ].join(' ')}
        >
          <span>{vraag.vraag}</span>
          <span
            aria-hidden="true"
            className={[
              'grid size-8 shrink-0 place-items-center rounded-full border transition-transform duration-300',
              licht ? 'border-ivoor-rand-sterk' : 'border-inkt-rand-sterk',
              open ? 'rotate-45' : '',
            ].join(' ')}
          >
            <svg viewBox="0 0 16 16" className="w-3.5">
              <path d="M8 1v14M1 8h14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        </summary>
        <div
          ref={inhoud}
          className={[
            'px-6 pb-6 text-basis leesbreedte',
            licht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht',
          ].join(' ')}
        >
          {vraag.antwoord}
        </div>
      </details>
    </li>
  )
}
