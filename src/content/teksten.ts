/**
 * De vorm van de paginateksten.
 *
 * De teksten zelf staan in src/content/teksten/*.json. Ze zijn apart geschreven
 * op basis van het bronarchief van de oude site (content-archive/) en staan ter
 * goedkeuring in docs/teksten-review.md.
 *
 * Losse bestanden, zodat je een tekst kunt aanpassen zonder aan code te komen,
 * en zodat in de geschiedenis van de repo precies te zien is wat er wanneer
 * aan een tekst veranderd is.
 */

export type Opsommingsregel = {
  titel: string
  tekst: string
}

export type TekstSectie = {
  kop: string
  alineas: string[]
  opsomming: Opsommingsregel[]
}

export type Vraag = {
  vraag: string
  antwoord: string
}

export type PaginaTekst = {
  slug: string
  metaTitel: string
  metaOmschrijving: string
  h1: string
  inleiding: string
  secties: TekstSectie[]
  vragen: Vraag[]
  oproep: {
    kop: string
    tekst: string
    knop: string
  }
}
