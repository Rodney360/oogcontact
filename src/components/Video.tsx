'use client'

/**
 * Een YouTube-video die pas laadt als je erop klikt.
 *
 * Tot dat moment staat er alleen een afbeelding met een afspeelknop. Zo laadt
 * de pagina snel en zet YouTube niets op de computer van de bezoeker zolang
 * die de video niet wil zien. Wordt er wel gekeken, dan gebeurt dat via
 * youtube-nocookie.com.
 */

import { useState } from 'react'

type Props = {
  youtubeId: string
  titel: string
  className?: string
}

export function Video({ youtubeId, titel, className = '' }: Props) {
  const [speelt, setSpeelt] = useState(false)

  return (
    <div
      className={`relative aspect-video overflow-hidden rounded-groot border border-inkt-rand bg-inkt-zacht ${className}`}
    >
      {speelt ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&hl=nl`}
          title={titel}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setSpeelt(true)}
          className="group absolute inset-0 size-full cursor-pointer"
        >
          {/*
            Bewust een gewone <img> en geen next/image: de voorvertoning komt
            van YouTube en hoeft niet door onze eigen server geoptimaliseerd te
            worden. Het is één afbeelding, hij laadt pas als hij in beeld komt,
            en hij zet niets op de computer van de bezoeker.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 ease-[var(--ease-rustig)] motion-safe:group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-inkt/45 transition-colors duration-500 group-hover:bg-inkt/30" />
          <span className="absolute inset-0 grid place-items-center">
            <span
              className={[
                'grid size-20 place-items-center rounded-full border-2 border-ivoor/80 bg-inkt/60',
                'text-ivoor backdrop-blur-sm transition-all duration-300',
                'group-hover:border-messing group-hover:text-messing motion-safe:group-hover:scale-110',
              ].join(' ')}
            >
              <svg viewBox="0 0 24 24" className="ml-1 w-8" aria-hidden="true">
                <path d="M7 4.5l13 7.5-13 7.5z" fill="currentColor" />
              </svg>
            </span>
          </span>
          <span className="absolute inset-x-0 bottom-0 p-6 text-left">
            <span className="block text-groot font-medium text-ivoor">{titel}</span>
            <span className="mt-1 block text-bijschrift text-ivoor/70">
              Klik om af te spelen. De video wordt pas dan geladen, via youtube-nocookie.com.
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
