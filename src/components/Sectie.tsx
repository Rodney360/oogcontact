/**
 * De bouwstenen waarmee de pagina's zijn opgebouwd: secties, koppen en de
 * afsluitende uitnodiging om een afspraak te maken.
 */

import type { ReactNode } from 'react'

import { KnopLink } from '@/components/Knop'
import { Verschijnt } from '@/components/Beweging'

type SectieProps = {
  children: ReactNode
  /** Een licht vlak in plaats van donker. */
  licht?: boolean
  /** Voor een anker vanuit het menu of een link. */
  id?: string
  /** Minder ruimte boven en onder. */
  compact?: boolean
  className?: string
  als?: 'section' | 'div'
}

export function Sectie({
  children,
  licht = false,
  id,
  compact = false,
  className = '',
  als: Element = 'section',
}: SectieProps) {
  return (
    <Element
      id={id}
      // scroll-mt zorgt dat een anker niet onder de vaste koptekst verdwijnt.
      className={[
        'scroll-mt-24',
        compact ? 'py-16 md:py-20' : 'py-[var(--spacing-sectie)]',
        licht ? 'op-ivoor' : '',
        className,
      ].join(' ')}
    >
      <div className="mx-auto max-w-[86rem] px-6">{children}</div>
    </Element>
  )
}

/** De smallere kolom voor lopende tekst. */
export function Leeskolom({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`leesbreedte ${className}`}>{children}</div>
}

type KopProps = {
  /** Het kleine woordje boven de kop. */
  bovenkop?: string
  kop: string
  inleiding?: string
  /** h2 is de standaard; gebruik h1 alleen boven aan een pagina. */
  niveau?: 1 | 2
  licht?: boolean
  gecentreerd?: boolean
  className?: string
}

export function SectieKop({
  bovenkop,
  kop,
  inleiding,
  niveau = 2,
  licht = false,
  gecentreerd = false,
  className = '',
}: KopProps) {
  const Kop = niveau === 1 ? 'h1' : 'h2'
  return (
    <Verschijnt className={`${gecentreerd ? 'mx-auto text-center' : ''} max-w-[46rem] ${className}`}>
      {bovenkop && (
        <p
          className={`mb-4 text-bijschrift font-semibold uppercase tracking-[0.16em] ${
            licht ? 'text-messing-diep' : 'text-messing'
          }`}
        >
          {bovenkop}
        </p>
      )}
      <Kop className={niveau === 1 ? 'text-kop-1' : 'text-kop-2'}>{kop}</Kop>
      {inleiding && (
        <p
          className={`mt-6 text-lead ${licht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht'}`}
        >
          {inleiding}
        </p>
      )}
    </Verschijnt>
  )
}

type OproepProps = {
  kop: string
  tekst: string
  knop?: string
  /** Waar de knop heen gaat. */
  pad?: string
  licht?: boolean
}

/** De afsluiting van een pagina: kom langs, of maak een afspraak. */
export function Oproep({ kop, tekst, knop = 'Afspraak maken', pad = '/afspraak-maken/', licht = false }: OproepProps) {
  return (
    <Sectie licht={licht}>
      <Verschijnt className="mx-auto max-w-[46rem] text-center">
        <h2 className="text-kop-2">{kop}</h2>
        <p className={`mt-6 text-lead ${licht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht'}`}>{tekst}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <KnopLink href={pad} uiterlijk="messing" formaat="groot">
            {knop}
          </KnopLink>
          <KnopLink href="/contact/" uiterlijk={licht ? 'omlijnd-donker' : 'omlijnd'} formaat="groot">
            Bellen of appen
          </KnopLink>
        </div>
      </Verschijnt>
    </Sectie>
  )
}
