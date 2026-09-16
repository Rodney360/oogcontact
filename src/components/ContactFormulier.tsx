'use client'

/**
 * Het aanvraagformulier: voor wie liever teruggebeld wordt of een vraag heeft.
 *
 * De velden voor voorkeursdag en dagdeel verschijnen alleen als iemand een
 * afspraak wil. Dat gaat met een vloeiende overgang die alleen `opacity` en
 * `transform` gebruikt, zodat de rest van de pagina niet verspringt.
 *
 * Alles wordt zowel hier als op de server gecontroleerd, met dezelfde regels
 * uit src/lib/validatie.ts.
 */

import { useId, useRef, useState } from 'react'

import { Knop } from '@/components/Knop'
import { Veld, Tekstvak, Keuze, Honeypot } from '@/components/boeking/Velden'
import { Turnstile } from '@/components/Turnstile'
import { BEDRIJF, whatsappLink } from '@/content/bedrijf'
import { LABELS } from '@/content/labels'
import { contactFouten } from '@/lib/veldregels'

type Waarden = {
  voornaam: string
  achternaam: string
  telefoon: string
  email: string
  keuze: 'afspraak' | 'informatie' | ''
  voorkeursdagen: string[]
  voorkeursdagdelen: string[]
  onderwerpen: string[]
  bericht: string
  privacy: boolean
  website: string
  turnstileToken: string
}

const LEEG: Waarden = {
  voornaam: '',
  achternaam: '',
  telefoon: '',
  email: '',
  keuze: '',
  voorkeursdagen: [],
  voorkeursdagdelen: [],
  onderwerpen: [],
  bericht: '',
  privacy: false,
  website: '',
  turnstileToken: '',
}

const opties = <T extends Record<string, string>>(labels: T) =>
  Object.entries(labels).map(([waarde, label]) => ({ waarde, label }))

export function ContactFormulier({ licht = false }: { licht?: boolean }) {
  const [waarden, setWaarden] = useState<Waarden>(LEEG)
  const [fouten, setFouten] = useState<Record<string, string>>({})
  const [bezig, setBezig] = useState(false)
  const [klaar, setKlaar] = useState<{ testmodus: boolean } | null>(null)
  const [storing, setStoring] = useState<string | null>(null)
  const meldingId = useId()
  const melding = useRef<HTMLDivElement>(null)

  const zet = <K extends keyof Waarden>(sleutel: K, waarde: Waarden[K]) => {
    setWaarden((w) => ({ ...w, [sleutel]: waarde }))
    // Zodra iemand een fout herstelt, verdwijnt de melding meteen.
    setFouten((f) => {
      if (!(sleutel in f)) return f
      const rest = { ...f }
      delete rest[sleutel as string]
      return rest
    })
  }

  const wilAfspraak = waarden.keuze === 'afspraak'

  async function verstuur(e: React.FormEvent) {
    e.preventDefault()
    setStoring(null)

    const gevonden = contactFouten(waarden)
    if (Object.keys(gevonden).length > 0) {
      setFouten(gevonden)
      // Naar het eerste veld dat nog niet klopt, zodat je weet waar je moet zijn.
      // Even wachten tot React de foutmeldingen getekend heeft, anders staat
      // aria-invalid er nog niet op.
      requestAnimationFrame(() => {
        const eerste = document.querySelector<HTMLElement>('[aria-invalid="true"]')
        eerste?.focus()
        eerste?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      })
      return
    }

    setBezig(true)
    try {
      const antwoord = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(waarden),
      })
      const gegevens = await antwoord.json().catch(() => ({}))

      if (!antwoord.ok) {
        setStoring(
          gegevens.melding ??
            `Het versturen lukte niet. Bel ons gerust op ${BEDRIJF.telefoon.weergave}.`,
        )
        if (gegevens.velden) {
          const nieuw: Record<string, string> = {}
          for (const [veld, meldingen] of Object.entries(gegevens.velden as Record<string, string[]>)) {
            if (meldingen?.[0]) nieuw[veld] = meldingen[0]
          }
          setFouten(nieuw)
        }
        return
      }

      setKlaar({ testmodus: Boolean(gegevens.testmodus) })
      setWaarden(LEEG)
      setFouten({})
      // De aandacht naar de bevestiging, ook voor wie met een schermlezer werkt.
      requestAnimationFrame(() => melding.current?.focus())
    } catch {
      setStoring(
        `We konden je bericht niet versturen. Bel ons gerust op ${BEDRIJF.telefoon.weergave}, ` +
          `of stuur een e-mail naar ${BEDRIJF.email}.`,
      )
    } finally {
      setBezig(false)
    }
  }

  if (klaar) {
    return (
      <div
        ref={melding}
        tabIndex={-1}
        role="status"
        className={[
          'rounded-groot border p-8 text-center outline-none sm:p-10',
          licht ? 'border-messing-diep/40 bg-messing-zacht/30' : 'border-messing/40 bg-messing/5',
        ].join(' ')}
      >
        <div
          aria-hidden="true"
          className={[
            'mx-auto grid size-14 place-items-center rounded-full border-2',
            licht ? 'border-messing-diep text-messing-diep' : 'border-messing text-messing',
          ].join(' ')}
        >
          <svg viewBox="0 0 24 24" className="w-7">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-6 text-kop-3">Dankjewel, we hebben je bericht</h3>
        <p className={`mx-auto mt-4 max-w-[34rem] text-basis ${licht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht'}`}>
          We nemen zo snel mogelijk contact met je op, meestal op de eerstvolgende dag dat we open
          zijn. Je krijgt ook een bevestiging per e-mail.
        </p>
        {klaar.testmodus && (
          <p className={`mx-auto mt-6 max-w-[34rem] text-bijschrift ${licht ? 'text-messing-diep' : 'text-messing'}`}>
            Testmodus: er is geen e-mail verstuurd, want de mailkoppeling staat nog niet aan.
          </p>
        )}
        <p className={`mt-6 text-bijschrift ${licht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht'}`}>
          Heb je haast? Bel{' '}
          <a
            href={`tel:${BEDRIJF.telefoon.link}`}
            className={licht ? 'text-messing-diep underline underline-offset-4' : 'text-messing underline underline-offset-4'}
          >
            {BEDRIJF.telefoon.weergave}
          </a>{' '}
          of stuur een{' '}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={licht ? 'text-messing-diep underline underline-offset-4' : 'text-messing underline underline-offset-4'}
          >
            appje
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={verstuur} className={licht ? 'op-ivoor' : ''}>
      <div className="grid gap-6 sm:grid-cols-2">
        <Veld
          label="Voornaam"
          verplicht
          licht={licht}
          autoComplete="given-name"
          value={waarden.voornaam}
          onChange={(e) => zet('voornaam', e.target.value)}
          fout={fouten.voornaam}
        />
        <Veld
          label="Achternaam"
          verplicht
          licht={licht}
          autoComplete="family-name"
          value={waarden.achternaam}
          onChange={(e) => zet('achternaam', e.target.value)}
          fout={fouten.achternaam}
        />
        <Veld
          label="Telefoonnummer"
          type="tel"
          inputMode="tel"
          verplicht
          licht={licht}
          autoComplete="tel"
          value={waarden.telefoon}
          onChange={(e) => zet('telefoon', e.target.value)}
          fout={fouten.telefoon}
        />
        <Veld
          label="E-mailadres"
          type="email"
          inputMode="email"
          verplicht
          licht={licht}
          autoComplete="email"
          value={waarden.email}
          onChange={(e) => zet('email', e.target.value)}
          fout={fouten.email}
        />
      </div>

      <div className="mt-8">
        <Keuze
          legenda="Waarvoor neem je contact op?"
          verplicht
          licht={licht}
          soort="een"
          naam="keuze"
          opties={opties(LABELS.keuze)}
          gekozen={waarden.keuze ? [waarden.keuze] : []}
          opWijziging={([w]) => zet('keuze', (w as Waarden['keuze']) ?? '')}
          fout={fouten.keuze}
        />
      </div>

      {/*
        De voorkeuren horen bij een afspraak. Ze staan altijd in de HTML, zodat
        er niets verspringt; alleen de hoogte en de doorzichtigheid veranderen.
      */}
      <div
        aria-hidden={!wilAfspraak}
        inert={!wilAfspraak || undefined}
        className="grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-rustig)]"
        style={{ gridTemplateRows: wilAfspraak ? '1fr' : '0fr', opacity: wilAfspraak ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <div className="mt-8 space-y-8">
            <Keuze
              legenda="Heb je een voorkeur voor een dag?"
              uitleg="Mag ook meer dan een. We zijn open van woensdag tot en met zaterdag."
              licht={licht}
              soort="meer"
              naam="voorkeursdagen"
              naastElkaar
              opties={opties(LABELS.dagen)}
              gekozen={waarden.voorkeursdagen}
              opWijziging={(w) => zet('voorkeursdagen', w)}
            />
            <Keuze
              legenda="En voor een dagdeel?"
              licht={licht}
              soort="meer"
              naam="voorkeursdagdelen"
              naastElkaar
              opties={opties(LABELS.dagdelen)}
              gekozen={waarden.voorkeursdagdelen}
              opWijziging={(w) => zet('voorkeursdagdelen', w)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Keuze
          legenda="Waar gaat het over?"
          uitleg="Mag ook meer dan een, dan kunnen we ons goed voorbereiden."
          verplicht
          licht={licht}
          soort="meer"
          naam="onderwerpen"
          opties={opties(LABELS.onderwerpen)}
          gekozen={waarden.onderwerpen}
          opWijziging={(w) => zet('onderwerpen', w)}
          fout={fouten.onderwerpen}
        />
      </div>

      <div className="mt-8">
        <Tekstvak
          label="Je vraag of opmerking"
          uitleg="Niet verplicht."
          licht={licht}
          value={waarden.bericht}
          onChange={(e) => zet('bericht', e.target.value)}
          fout={fouten.bericht}
        />
      </div>

      <div className="mt-8">
        <label className={`flex cursor-pointer items-start gap-3 text-basis ${licht ? 'text-tekst' : 'text-tekst-licht'}`}>
          <input
            type="checkbox"
            checked={waarden.privacy}
            onChange={(e) => zet('privacy', e.target.checked)}
            aria-invalid={fouten.privacy ? true : undefined}
            aria-describedby={fouten.privacy ? `${meldingId}-privacy` : undefined}
            className="mt-1 size-5 shrink-0 accent-[var(--color-messing)]"
          />
          <span>
            Ik ga akkoord met de{' '}
            <a
              href="/privacyverklaring/"
              className={licht ? 'text-messing-diep underline underline-offset-4' : 'text-messing underline underline-offset-4'}
            >
              privacyverklaring
            </a>
            .
            <span aria-hidden="true" className={licht ? 'text-messing-diep' : 'text-messing'}> *</span>
          </span>
        </label>
        {fouten.privacy && (
          <p id={`${meldingId}-privacy`} className={`mt-2 text-bijschrift ${licht ? 'text-fout-diep' : 'text-fout'}`}>
            {fouten.privacy}
          </p>
        )}
      </div>

      <Honeypot waarde={waarden.website} opWijziging={(w) => zet('website', w)} />
      <Turnstile opToken={(t) => zet('turnstileToken', t)} />

      {storing && (
        <p
          role="alert"
          className={[
            'mt-8 rounded-zacht border px-4 py-3 text-basis',
            licht ? 'border-fout-diep/40 bg-fout-diep/5 text-fout-diep' : 'border-fout/40 bg-fout/10 text-fout',
          ].join(' ')}
        >
          {storing}
        </p>
      )}

      <div className="mt-8">
        <Knop type="submit" formaat="groot" uiterlijk="messing" disabled={bezig}>
          {bezig ? 'Bezig met versturen…' : 'Versturen'}
        </Knop>
        <p className={`mt-4 text-bijschrift ${licht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht'}`}>
          Velden met een <span aria-hidden="true">*</span>
          <span className="alleen-voor-schermlezers">sterretje</span> zijn verplicht.
        </p>
      </div>
    </form>
  )
}
