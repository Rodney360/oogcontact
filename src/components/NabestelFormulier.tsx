'use client'

/**
 * Contactlenzen nabestellen, voor wie al lenzen bij ons draagt.
 *
 * Dit formulier verstuurt zelf niets. Het maakt van de keuzes een kant-en-klaar
 * bericht en opent daarmee WhatsApp of het e-mailprogramma van de bezoeker; die
 * drukt daar zelf op verzenden. Er is dus geen mailsleutel voor nodig, en er
 * gaan geen gegevens via onze server.
 *
 * De regels (daglenzen per 30, maandlenzen per doosje van 6) en het bericht
 * staan in src/lib/nabestellen.ts, met tests.
 */

import { useState } from 'react'

import { Knop } from '@/components/Knop'
import { IcoonWhatsApp } from '@/components/IcoonWhatsApp'
import { Veld, Tekstvak, Keuze } from '@/components/boeking/Velden'
import { BEDRIJF, whatsappLink } from '@/content/bedrijf'
import {
  LEGE_BESTELLING,
  NABESTEL_ONDERWERP,
  OGEN_LABELS,
  REGELS,
  SOORT_LABELS,
  VLOEISTOF_LABELS,
  beginAantal,
  nabestelBericht,
  nabestelFouten,
  volgendAantal,
  type Bestelling,
  type Ogen,
  type Soort,
} from '@/lib/nabestellen'

const opties = (labels: Record<string, string>) =>
  Object.entries(labels).map(([waarde, label]) => ({ waarde, label }))

type Kanaal = 'whatsapp' | 'mail'

export function NabestelFormulier() {
  const [b, setB] = useState<Bestelling>(LEGE_BESTELLING)
  const [fouten, setFouten] = useState<Partial<Record<keyof Bestelling, string>>>({})
  const [geopend, setGeopend] = useState<Kanaal | null>(null)

  const zet = <K extends keyof Bestelling>(veld: K, waarde: Bestelling[K]) => {
    setB((oud) => ({ ...oud, [veld]: waarde }))
    if (fouten[veld]) setFouten((oud) => ({ ...oud, [veld]: undefined }))
  }

  const kiesSoort = (soort: Soort) => {
    // Een andere soort betekent een andere eenheid: begin dan bij de kleinste
    // hoeveelheid in plaats van een getal dat nergens meer op slaat.
    setB((oud) => ({ ...oud, soort, aantal: oud.soort === soort ? oud.aantal : beginAantal(soort) }))
    setFouten((oud) => ({ ...oud, soort: undefined, aantal: undefined }))
  }

  const verstuur = (kanaal: Kanaal) => {
    const gevonden = nabestelFouten(b)
    setFouten(gevonden)
    if (Object.keys(gevonden).length > 0) {
      // Naar het eerste veld dat nog niet klopt, zodat je niet hoeft te zoeken.
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.scrollIntoView({ block: 'center' })
      })
      return
    }
    const bericht = nabestelBericht(b)
    setGeopend(kanaal)
    if (kanaal === 'mail') {
      // Een mailto-link verlaat de pagina niet; het mailprogramma gaat ernaast open.
      window.location.href = `mailto:${BEDRIJF.email}?subject=${encodeURIComponent(NABESTEL_ONDERWERP)}&body=${encodeURIComponent(bericht)}`
      return
    }
    // WhatsApp in een nieuw tabblad. In hetzelfde tabblad zou op een laptop deze
    // pagina verdwijnen, en daarmee de melding dat je nog op verzenden moet
    // drukken. Op een telefoon gaat gewoon de app open. Houdt de browser het
    // nieuwe tabblad tegen, dan toch maar in dit tabblad.
    const venster = window.open(whatsappLink(bericht), '_blank')
    if (venster) venster.opener = null
    else window.location.href = whatsappLink(bericht)
  }

  const regel = b.soort ? REGELS[b.soort] : null

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); verstuur('whatsapp') }}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Veld
          label="Je naam"
          verplicht
          autoComplete="name"
          value={b.naam}
          onChange={(e) => zet('naam', e.target.value)}
          fout={fouten.naam}
        />
        <Veld
          label="Telefoonnummer"
          uitleg="Niet verplicht. Handig als we even willen overleggen."
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={b.telefoon}
          onChange={(e) => zet('telefoon', e.target.value)}
          fout={fouten.telefoon}
        />
        <Veld
          label="Geboortedatum"
          uitleg="Niet verplicht. Handig om je gegevens snel te vinden."
          type="date"
          autoComplete="bday"
          value={b.geboortedatum}
          onChange={(e) => zet('geboortedatum', e.target.value)}
          fout={fouten.geboortedatum}
        />
      </div>

      <div className="mt-8">
        <Keuze
          legenda="Welke lenzen draag je?"
          verplicht
          soort="een"
          naam="soort"
          naastElkaar
          opties={opties(SOORT_LABELS)}
          gekozen={b.soort ? [b.soort] : []}
          opWijziging={([w]) => w && kiesSoort(w as Soort)}
          fout={fouten.soort}
        />
      </div>

      {regel && b.soort && (
        <div className="mt-8 space-y-8">
          <Keuze
            legenda="Voor welke ogen?"
            soort="een"
            naam="ogen"
            naastElkaar
            opties={opties(OGEN_LABELS)}
            gekozen={[b.ogen]}
            opWijziging={([w]) => w && zet('ogen', w as Ogen)}
          />

          <fieldset aria-invalid={fouten.aantal ? true : undefined}>
            <legend className="text-bijschrift font-medium text-tekst-licht">
              {b.ogen === 'beide' ? 'Hoeveel per oog?' : 'Hoeveel?'}
            </legend>
            <p className="mt-1 text-bijschrift text-tekst-licht-zacht">{regel.uitleg}</p>
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                onClick={() => zet('aantal', volgendAantal(b.soort as Soort, b.aantal, -1))}
                disabled={b.aantal <= regel.stap}
                aria-label="Minder"
                className="flex size-12 items-center justify-center rounded-zacht border border-inkt-rand-sterk text-kop-4 text-tekst-licht transition-colors hover:border-messing disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <output aria-live="polite" className="min-w-40 text-center text-groot font-semibold text-tekst-licht">
                {regel.eenheid(b.aantal)}
              </output>
              <button
                type="button"
                onClick={() => zet('aantal', volgendAantal(b.soort as Soort, b.aantal, 1))}
                aria-label="Meer"
                className="flex size-12 items-center justify-center rounded-zacht border border-inkt-rand-sterk text-kop-4 text-tekst-licht transition-colors hover:border-messing"
              >
                +
              </button>
            </div>
            {fouten.aantal && <p className="mt-2 text-bijschrift text-fout">{fouten.aantal}</p>}
          </fieldset>
        </div>
      )}

      <div className="mt-8">
        <Keuze
          legenda="Wil je er lenzenvloeistof bij?"
          verplicht
          soort="een"
          naam="vloeistof"
          naastElkaar
          opties={opties(VLOEISTOF_LABELS)}
          gekozen={b.vloeistof ? [b.vloeistof] : []}
          opWijziging={([w]) => w && zet('vloeistof', w as 'ja' | 'nee')}
          fout={fouten.vloeistof}
        />
      </div>

      <div className="mt-8">
        <Tekstvak
          label="Nog iets dat we moeten weten?"
          uitleg="Niet verplicht."
          rows={3}
          value={b.opmerking}
          onChange={(e) => zet('opmerking', e.target.value)}
          fout={fouten.opmerking}
        />
      </div>

      {/*
        Hetzelfde punt als bij de agenda: het bericht staat klaar, maar het is
        pas verstuurd als de bezoeker in WhatsApp of in de mail op verzenden
        drukt. Dat zeggen we dus met zoveel woorden.
      */}
      {geopend && (
        <p role="status" className="mt-10 rounded-groot border-2 border-messing p-5 text-basis text-tekst-licht">
          <span className="font-semibold text-messing">Bijna klaar.</span>{' '}
          {geopend === 'whatsapp' ? 'WhatsApp' : 'Je e-mail'} gaat open met je bestelling erin. Druk daar nog
          op verzenden: pas dan hebben we hem. Zodra je lenzen bij ons binnen zijn, laten we het je weten
          via {geopend === 'whatsapp' ? 'WhatsApp' : 'e-mail'}.
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Knop type="submit" uiterlijk="messing" formaat="groot">
          <IcoonWhatsApp className="size-5" />
          Verstuur via WhatsApp
        </Knop>
        <Knop type="button" uiterlijk="omlijnd" formaat="groot" onClick={() => verstuur('mail')}>
          Liever per e-mail
        </Knop>
      </div>
      <p className="mt-4 text-bijschrift text-tekst-licht-zacht">
        Je bestelling gaat als bericht naar ons, vanuit je eigen WhatsApp of e-mail. Zodra je lenzen bij
        ons binnen zijn, laten we het je weten. Via deze website wordt niets opgeslagen. Velden met een <span aria-hidden="true">*</span>
        <span className="alleen-voor-schermlezers">sterretje</span> zijn verplicht.
      </p>
    </form>
  )
}
