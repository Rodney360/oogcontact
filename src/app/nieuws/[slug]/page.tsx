import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Markdoc from '@markdoc/markdoc'
import React from 'react'

import { Sectie, Leeskolom, Oproep } from '@/components/Sectie'
import { Kruimelpad } from '@/components/InhoudsPagina'
import { bericht, berichten } from '@/lib/beheer'
import { paginaMeta, JsonLd, kruimelsJsonLd, berichtJsonLd } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

/** Alle berichten worden bij het bouwen alvast klaargezet. */
export async function generateStaticParams() {
  const alles = await berichten()
  return alles.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await bericht(slug)
  if (!item) return { title: 'Bericht niet gevonden' }

  return paginaMeta({
    titel: item.titel,
    omschrijving: item.samenvatting,
    pad: `/nieuws/${slug}/`,
  })
}

function nederlandseDatum(iso: string): string {
  if (!iso) return ''
  const [jaar, maand, dag] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Amsterdam',
  }).format(new Date(Date.UTC(jaar ?? 1970, (maand ?? 1) - 1, dag ?? 1, 12)))
}

export default async function Nieuwsbericht({ params }: Props) {
  const { slug } = await params
  const item = await bericht(slug)
  if (!item) notFound()

  // De tekst is met Markdoc geschreven in het beheerscherm. Met
  // resolveLinkedFiles krijgen we de al ontlede boom terug, klaar om te tonen.
  const boom = Markdoc.transform(item.inhoud.node)
  const inhoud = Markdoc.renderers.react(boom, React)

  const kruimels = [
    { naam: 'Home', pad: '/' },
    { naam: 'Nieuws', pad: '/nieuws/' },
    { naam: item.titel, pad: `/nieuws/${slug}/` },
  ]

  return (
    <>
      <JsonLd data={kruimelsJsonLd(kruimels)} />
      <JsonLd
        data={berichtJsonLd({
          titel: item.titel,
          samenvatting: item.samenvatting,
          datum: item.datum,
          pad: `/nieuws/${slug}/`,
        })}
      />

      <Sectie className="pt-36 md:pt-44">
        <Kruimelpad kruimels={kruimels} />
        <article className="mt-8">
          <p className="text-bijschrift uppercase tracking-[0.14em] text-messing">
            <time dateTime={item.datum}>{nederlandseDatum(item.datum)}</time>
          </p>
          <h1 className="mt-4 max-w-[38rem] text-kop-1">{item.titel}</h1>
          <p className="mt-8 leesbreedte text-lead text-tekst-licht-zacht">{item.samenvatting}</p>
        </article>
      </Sectie>

      <Sectie licht compact>
        <Leeskolom
          className={[
            '[&_a]:text-messing-diep [&_a]:underline [&_a]:underline-offset-4',
            '[&_h2]:mt-12 [&_h2]:text-kop-3 [&_h3]:mt-8 [&_h3]:text-kop-4',
            '[&_img]:mt-8 [&_img]:rounded-kaart',
            '[&_li]:text-tekst-zacht',
            '[&_p]:mt-5 [&_p]:text-basis [&_p]:text-tekst-zacht',
            '[&_ul]:mt-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6',
            '[&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6',
          ].join(' ')}
        >
          {inhoud}
        </Leeskolom>

        <p className="mt-16 border-t border-ivoor-rand pt-8">
          <Link href="/nieuws/" className="text-basis text-messing-diep no-underline">
            &larr; Terug naar het nieuws
          </Link>
        </p>
      </Sectie>

      <Oproep
        kop="Kom gerust langs"
        tekst="Maak je een afspraak, dan hebben we echt de tijd voor je. De koffie staat klaar."
        knop="Afspraak maken"
      />
    </>
  )
}
