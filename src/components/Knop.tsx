/**
 * De knoppen van de site.
 *
 * Altijd minstens 44x44 pixels, zodat ze ook met een duim goed te raken zijn,
 * en altijd met een duidelijke focusring voor wie met het toetsenbord werkt.
 */

import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Uiterlijk = 'messing' | 'ivoor' | 'omlijnd' | 'omlijnd-donker' | 'stil'
type Formaat = 'normaal' | 'groot'

const UITERLIJK: Record<Uiterlijk, string> = {
  // De belangrijkste knop: afspraak maken.
  messing:
    'bg-messing text-inkt hover:bg-messing-zacht active:bg-messing-zacht ' +
    'shadow-[0_1px_0_rgba(255,255,255,0.25)_inset]',
  ivoor: 'bg-ivoor text-inkt hover:bg-white active:bg-white',
  omlijnd:
    'border border-inkt-rand-sterk text-tekst-licht hover:border-messing hover:text-messing ' +
    'bg-transparent',
  'omlijnd-donker':
    'border border-ivoor-rand-sterk text-tekst hover:border-messing-diep hover:text-messing-diep ' +
    'bg-transparent',
  stil: 'text-tekst-licht hover:text-messing bg-transparent underline underline-offset-4 decoration-1',
}

const FORMAAT: Record<Formaat, string> = {
  normaal: 'min-h-11 px-6 py-3 text-basis',
  groot: 'min-h-14 px-8 py-4 text-groot',
}

function klassen(uiterlijk: Uiterlijk, formaat: Formaat, extra?: string) {
  return [
    'inline-flex items-center justify-center gap-2.5 rounded-zacht',
    'font-medium tracking-wide no-underline',
    'transition-[background-color,border-color,color,transform] duration-200',
    'motion-safe:hover:-translate-y-0.5 active:translate-y-0',
    FORMAAT[formaat],
    UITERLIJK[uiterlijk],
    extra ?? '',
  ].join(' ')
}

type KnopLinkProps = {
  href: string
  uiterlijk?: Uiterlijk
  formaat?: Formaat
  children: ReactNode
  className?: string
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>

/** Een knop die naar een andere pagina gaat. */
export function KnopLink({
  href,
  uiterlijk = 'messing',
  formaat = 'normaal',
  children,
  className,
  ...rest
}: KnopLinkProps) {
  const extern = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')

  if (extern) {
    return (
      <a
        href={href}
        className={klassen(uiterlijk, formaat, className)}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={klassen(uiterlijk, formaat, className)} {...rest}>
      {children}
    </Link>
  )
}

type KnopProps = {
  uiterlijk?: Uiterlijk
  formaat?: Formaat
  children: ReactNode
} & ComponentProps<'button'>

/** Een knop die iets doet op de pagina zelf. */
export function Knop({
  uiterlijk = 'messing',
  formaat = 'normaal',
  children,
  className,
  ...rest
}: KnopProps) {
  return (
    <button
      type="button"
      className={`${klassen(uiterlijk, formaat, className)} disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
      {...rest}
    >
      {children}
    </button>
  )
}
