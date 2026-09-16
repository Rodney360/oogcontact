'use client'

/**
 * De boekingsmodule: in vier stappen een afspraak in de agenda.
 *
 *   1. Waarvoor kom je?   2. Wanneer schikt het?   3. Je gegevens   4. Klaar
 *
 * Alles gebeurt op deze pagina zelf. De tijden komen van de online agenda via
 * onze eigen server, zodat de sleutel van die agenda nooit in de browser komt.
 * De tijdzone is altijd Europe/Amsterdam; dat hoeft de bezoeker niet te weten
 * en wordt dus ook niet getoond.
 */

import { useEffect, useMemo, useRef, useState } from 'react'

import Link from 'next/link'

import { Knop } from '@/components/Knop'
import { Veld, Tekstvak, Honeypot } from '@/components/boeking/Velden'
import { Turnstile } from '@/components/Turnstile'
import { GROEPEN } from '@/content/diensten'
import { BEDRIJF, whatsappLink } from '@/content/bedrijf'
import type { AgendaDienst, VrijeDag } from '@/lib/agenda/soorten'

type Stap = 1 | 2 | 3 | 4

const STAPNAMEN: Record<Stap, string> = {
  1: 'Waarvoor kom je?',
  2: 'Wanneer schikt het?',
  3: 'Je gegevens',
  4: 'Klaar',
}

/** "2026-09-16" wordt "woensdag 16 september". */
function langeDatum(iso: string, metJaar = false): string {
  const [jaar, maand, dag] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(metJaar ? { year: 'numeric' } : {}),
    timeZone: 'Europe/Amsterdam',
  }).format(new Date(Date.UTC(jaar ?? 1970, (maand ?? 1) - 1, dag ?? 1, 12)))
}

/** "09:30" wordt "9.30" - zo schrijven we tijden in het Nederlands. */
function nlTijd(tijd: string): string {
  const [uur, minuut] = tijd.split(':')
  return `${Number(uur)}.${minuut}`
}

function vandaagInNederland(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date())
}

export function Boeking() {
  const [stap, setStap] = useState<Stap>(1)
  const [diensten, setDiensten] = useState<AgendaDienst[] | null>(null)
  const [dienst, setDienst] = useState<AgendaDienst | null>(null)
  // De vrije tijden worden bewaard mét de dienst waar ze bij horen. Zo is een
  // antwoord dat te laat binnenkomt vanzelf herkenbaar als verouderd, en hoeft
  // er bij het wisselen van dienst niets "leeggemaakt" te worden.
  const [beschikbaar, setBeschikbaar] = useState<{ dienstId: string; dagen: VrijeDag[] } | null>(null)
  const [gekozenDatum, setGekozenDatum] = useState<string | null>(null)
  const [gekozenTijd, setGekozenTijd] = useState<string | null>(null)
  const [testmodus, setTestmodus] = useState(false)
  // Gaat omhoog als de tijden opnieuw opgehaald moeten worden, bijvoorbeeld
  // omdat iemand anders net hetzelfde moment pakte.
  const [herlaadSleutel, setHerlaadSleutel] = useState(0)
  const [storing, setStoring] = useState<string | null>(null)
  const [bezig, setBezig] = useState(false)
  const [bevestiging, setBevestiging] = useState<{ referentie: string; dienstNaam: string } | null>(null)

  const kop = useRef<HTMLDivElement>(null)

  // Bij het wisselen van stap de aandacht naar de nieuwe stap brengen, zodat
  // wie met een schermlezer of toetsenbord werkt niet kwijtraakt waar hij is.
  const eersteKeer = useRef(true)
  useEffect(() => {
    if (eersteKeer.current) {
      eersteKeer.current = false
      return
    }
    kop.current?.focus()
  }, [stap])

  // De diensten ophalen zodra de module in beeld komt.
  useEffect(() => {
    let gestopt = false
    fetch('/api/agenda/diensten')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { diensten: AgendaDienst[]; testmodus: boolean }) => {
        if (gestopt) return
        setDiensten(d.diensten)
        setTestmodus(d.testmodus)
      })
      .catch(() => {
        if (!gestopt) setStoring('onbereikbaar')
      })
    return () => {
      gestopt = true
    }
  }, [])

  // De vrije tijden ophalen zodra er een dienst gekozen is.
  const dienstId = dienst?.id ?? null
  useEffect(() => {
    if (!dienstId) return
    let gestopt = false

    fetch(`/api/agenda/beschikbaarheid?dienst=${encodeURIComponent(dienstId)}&vanaf=${vandaagInNederland()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { dagen: VrijeDag[] }) => {
        if (!gestopt) setBeschikbaar({ dienstId, dagen: d.dagen })
      })
      .catch(() => {
        if (!gestopt) setStoring('onbereikbaar')
      })
    return () => {
      gestopt = true
    }
  }, [dienstId, herlaadSleutel])

  // Hoort wat we hebben nog bij de gekozen dienst? Zo niet, dan zijn we aan het
  // laden en tonen we geen verouderde tijden.
  const dagen = beschikbaar && beschikbaar.dienstId === dienstId ? beschikbaar.dagen : null

  // De gekozen dag en tijd worden afgeleid, niet opgeruimd: staat de keuze niet
  // (meer) in de opgehaalde tijden, dan valt hij vanzelf terug op iets geldigs.
  const datum = useMemo(
    () => (dagen?.some((d) => d.datum === gekozenDatum) ? gekozenDatum : (dagen?.[0]?.datum ?? null)),
    [dagen, gekozenDatum],
  )
  const tijd = useMemo(() => {
    const dag = dagen?.find((d) => d.datum === datum)
    return dag && gekozenTijd && dag.tijden.includes(gekozenTijd) ? gekozenTijd : null
  }, [dagen, datum, gekozenTijd])

  if (storing === 'onbereikbaar' && !diensten) {
    return <AgendaOnbereikbaar />
  }

  if (stap === 4 && bevestiging && dienst && datum && tijd) {
    return (
      <Gelukt
        dienst={dienst}
        datum={datum}
        tijd={tijd}
        referentie={bevestiging.referentie}
        testmodus={testmodus}
      />
    )
  }

  return (
    <div className="rounded-groot border border-inkt-rand bg-inkt-zacht/60 p-6 sm:p-8 lg:p-10">
      <Stappenbalk stap={stap} />

      <div ref={kop} tabIndex={-1} className="mt-8 outline-none">
        <h3 className="text-kop-3">{STAPNAMEN[stap]}</h3>

        {testmodus && (
          <p className="mt-4 rounded-zacht border border-messing/40 bg-messing/10 px-4 py-3 text-bijschrift text-messing">
            Testmodus: de agenda is nog niet gekoppeld. Je ziet voorbeeldtijden en er wordt niets
            echt vastgelegd.
          </p>
        )}

        {stap === 1 && (
          <KiesDienst
            diensten={diensten}
            gekozen={dienst}
            opKeuze={(d) => {
              setDienst(d)
              setStap(2)
            }}
          />
        )}

        {stap === 2 && dienst && (
          <KiesMoment
            dagen={dagen}
            datum={datum}
            tijd={tijd}
            opDatum={(d) => {
              setGekozenDatum(d)
              setGekozenTijd(null)
            }}
            opTijd={setGekozenTijd}
            opVerder={() => setStap(3)}
          />
        )}

        {stap === 3 && dienst && datum && tijd && (
          <Gegevens
            dienst={dienst}
            datum={datum}
            tijd={tijd}
            bezig={bezig}
            opVerstuur={async (gegevens) => {
              setBezig(true)
              try {
                const antwoord = await fetch('/api/agenda/boeken', {
                  method: 'POST',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ ...gegevens, dienstId: dienst.id, datum, tijd }),
                })
                const uitslag = await antwoord.json()

                if (antwoord.status === 409) {
                  // Iemand anders was net sneller. Terug naar de kalender met
                  // verse tijden, zodat de bezoeker meteen verder kan.
                  setStoring(uitslag.melding)
                  setGekozenTijd(null)
                  setHerlaadSleutel((n) => n + 1)
                  setStap(2)
                  return
                }
                if (!antwoord.ok) {
                  setStoring(uitslag.melding ?? 'Er ging iets mis. Probeer het nog eens.')
                  return
                }

                setBevestiging({ referentie: uitslag.referentie, dienstNaam: uitslag.dienstNaam })
                setStoring(null)
                setStap(4)
              } catch {
                setStoring('We konden de agenda niet bereiken. Bel ons gerust, dan regelen we het samen.')
              } finally {
                setBezig(false)
              }
            }}
          />
        )}

        {storing && storing !== 'onbereikbaar' && (
          <p
            role="alert"
            className="mt-6 rounded-zacht border border-fout/40 bg-fout/10 px-4 py-3 text-basis text-fout"
          >
            {storing}
          </p>
        )}
      </div>

      {stap > 1 && (
        <div className="mt-8 border-t border-inkt-rand pt-6">
          <Knop
            uiterlijk="stil"
            onClick={() => {
              setStoring(null)
              setStap((s) => (s - 1) as Stap)
            }}
          >
            &larr; Terug naar {STAPNAMEN[(stap - 1) as Stap].toLowerCase()}
          </Knop>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------- stappen */

function Stappenbalk({ stap }: { stap: Stap }) {
  const stappen: Stap[] = [1, 2, 3]
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2" aria-label="Stappen">
      {stappen.map((s, i) => {
        const gedaan = stap > s
        const nu = stap === s
        return (
          <li key={s} className="flex items-center gap-3">
            <span
              aria-current={nu ? 'step' : undefined}
              className={[
                'flex items-center gap-2.5 text-bijschrift',
                nu ? 'text-messing' : gedaan ? 'text-tekst-licht' : 'text-tekst-licht-zacht',
              ].join(' ')}
            >
              <span
                className={[
                  'grid size-7 shrink-0 place-items-center rounded-full border text-[0.8rem] font-semibold',
                  nu
                    ? 'border-messing bg-messing text-inkt'
                    : gedaan
                      ? 'border-messing text-messing'
                      : 'border-inkt-rand-sterk',
                ].join(' ')}
              >
                {gedaan ? (
                  <svg viewBox="0 0 16 16" className="w-3.5" aria-hidden="true">
                    <path d="M3 8.5l3.5 3.5L13 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  s
                )}
                <span className="alleen-voor-schermlezers">
                  Stap {s}{gedaan ? ', afgerond' : nu ? ', nu bezig' : ''}:
                </span>
              </span>
              <span className="hidden sm:inline">{STAPNAMEN[s]}</span>
            </span>
            {i < stappen.length - 1 && (
              <span aria-hidden="true" className="h-px w-6 bg-inkt-rand sm:w-10" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

/* ------------------------------------------------------------ stap 1: dienst */

function KiesDienst({
  diensten,
  gekozen,
  opKeuze,
}: {
  diensten: AgendaDienst[] | null
  gekozen: AgendaDienst | null
  opKeuze: (d: AgendaDienst) => void
}) {
  if (!diensten) return <Laden tekst="De mogelijkheden worden opgehaald" />

  const perGroep = GROEPEN.map((groep) => ({
    groep,
    items: diensten.filter((d) => d.groep === groep),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="mt-6 space-y-8">
      {perGroep.map(({ groep, items }) => (
        <div key={groep}>
          <h4 className="mb-3 text-bijschrift font-semibold uppercase tracking-[0.14em] text-messing">
            {groep}
          </h4>
          <ul className="grid gap-3 md:grid-cols-2">
            {items.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => opKeuze(d)}
                  aria-pressed={gekozen?.id === d.id}
                  className={[
                    'flex h-full w-full flex-col items-start gap-1.5 rounded-kaart border p-5 text-left',
                    'transition-colors duration-200',
                    gekozen?.id === d.id
                      ? 'border-messing bg-messing/10'
                      : 'border-inkt-rand-sterk hover:border-messing',
                  ].join(' ')}
                >
                  <span className="text-groot font-medium text-tekst-licht">{d.naam}</span>
                  {d.uitleg && (
                    <span className="text-bijschrift leading-relaxed text-tekst-licht-zacht">{d.uitleg}</span>
                  )}
                  {d.duurMinuten > 0 && (
                    <span className="mt-1 text-bijschrift text-messing">
                      ongeveer {d.duurMinuten} minuten
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------ stap 2: moment */

function KiesMoment({
  dagen,
  datum,
  tijd,
  opDatum,
  opTijd,
  opVerder,
}: {
  dagen: VrijeDag[] | null
  datum: string | null
  tijd: string | null
  opDatum: (d: string) => void
  opTijd: (t: string) => void
  opVerder: () => void
}) {
  if (!dagen) return <Laden tekst="De vrije momenten worden opgehaald" />

  if (dagen.length === 0) {
    return (
      <div className="mt-6 rounded-kaart border border-inkt-rand bg-inkt p-6">
        <p className="text-basis text-tekst-licht">
          Voor de komende weken staat er niets vrij in de agenda. Bel ons gerust op{' '}
          <a href={`tel:${BEDRIJF.telefoon.link}`} className="text-messing underline underline-offset-4">
            {BEDRIJF.telefoon.weergave}
          </a>{' '}
          of stuur een{' '}
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-messing underline underline-offset-4"
          >
            appje
          </a>
          , dan zoeken we samen een moment. Ook buiten onze openingstijden is er vaak wat mogelijk.
        </p>
      </div>
    )
  }

  const gekozenDag = dagen.find((d) => d.datum === datum)

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,20rem)_1fr]">
      <div>
        <h4 className="mb-3 text-bijschrift font-semibold uppercase tracking-[0.14em] text-messing">
          Kies een dag
        </h4>
        <ul className="max-h-[22rem] space-y-2 overflow-y-auto pr-1">
          {dagen.map((d) => (
            <li key={d.datum}>
              <button
                type="button"
                onClick={() => opDatum(d.datum)}
                aria-pressed={datum === d.datum}
                className={[
                  'flex min-h-12 w-full items-center justify-between gap-3 rounded-zacht border px-4 py-3',
                  'text-left text-basis transition-colors duration-200',
                  datum === d.datum
                    ? 'border-messing bg-messing/10 text-tekst-licht'
                    : 'border-inkt-rand-sterk text-tekst-licht hover:border-messing',
                ].join(' ')}
              >
                <span className="first-letter:uppercase">{langeDatum(d.datum)}</span>
                <span className="shrink-0 text-bijschrift text-tekst-licht-zacht">
                  {d.tijden.length} {d.tijden.length === 1 ? 'tijd' : 'tijden'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-3 text-bijschrift font-semibold uppercase tracking-[0.14em] text-messing">
          Kies een tijd
        </h4>
        {gekozenDag ? (
          <>
            <p className="mb-4 text-basis text-tekst-licht-zacht first-letter:uppercase">
              {langeDatum(gekozenDag.datum)}
            </p>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2.5">
              {gekozenDag.tijden.map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => opTijd(t)}
                    aria-pressed={tijd === t}
                    className={[
                      'min-h-12 w-full rounded-zacht border text-basis tabular-nums transition-colors duration-200',
                      tijd === t
                        ? 'border-messing bg-messing text-inkt'
                        : 'border-inkt-rand-sterk text-tekst-licht hover:border-messing',
                    ].join(' ')}
                  >
                    {nlTijd(t)}
                    <span className="alleen-voor-schermlezers"> uur</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-basis text-tekst-licht-zacht">Kies eerst een dag.</p>
        )}

        {tijd && (
          <div className="mt-8">
            <Knop formaat="groot" onClick={opVerder}>
              Verder met {nlTijd(tijd)} uur
            </Knop>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------- stap 3: gegevens */

type GegevensWaarden = {
  voornaam: string
  achternaam: string
  email: string
  telefoon: string
  opmerking: string
  privacy: boolean
  website: string
  turnstileToken: string
}

function Gegevens({
  dienst,
  datum,
  tijd,
  bezig,
  opVerstuur,
}: {
  dienst: AgendaDienst
  datum: string
  tijd: string
  bezig: boolean
  opVerstuur: (waarden: GegevensWaarden) => void
}) {
  const [waarden, setWaarden] = useState<GegevensWaarden>({
    voornaam: '',
    achternaam: '',
    email: '',
    telefoon: '',
    opmerking: '',
    privacy: false,
    website: '',
    turnstileToken: '',
  })
  const [fouten, setFouten] = useState<Record<string, string>>({})

  const zet = <K extends keyof GegevensWaarden>(sleutel: K, waarde: GegevensWaarden[K]) =>
    setWaarden((w) => ({ ...w, [sleutel]: waarde }))

  const controleer = (): boolean => {
    const nieuw: Record<string, string> = {}
    if (waarden.voornaam.trim().length < 2) nieuw.voornaam = 'Vul je voornaam in.'
    if (waarden.achternaam.trim().length < 2) nieuw.achternaam = 'Vul je achternaam in.'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(waarden.email.trim()))
      nieuw.email = 'Dit lijkt geen geldig e-mailadres. Staat de @ erin?'
    if (!/^[+0][\d\s\-()]{8,19}$/.test(waarden.telefoon.trim()))
      nieuw.telefoon = 'Dit lijkt geen geldig telefoonnummer. Bijvoorbeeld: 06 12 34 56 78.'
    if (!waarden.privacy)
      nieuw.privacy = 'Je moet akkoord gaan met de privacyverklaring voordat we je afspraak kunnen vastleggen.'
    setFouten(nieuw)
    return Object.keys(nieuw).length === 0
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        if (controleer()) opVerstuur(waarden)
      }}
      className="mt-6"
    >
      <div className="mb-8 rounded-kaart border border-messing/30 bg-messing/5 p-5">
        <p className="text-bijschrift uppercase tracking-[0.14em] text-messing">Je afspraak</p>
        <p className="mt-2 text-groot text-tekst-licht">
          {dienst.naam}
          <span className="block first-letter:uppercase">
            {langeDatum(datum, true)} om {nlTijd(tijd)} uur
          </span>
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Veld
          label="Voornaam"
          verplicht
          autoComplete="given-name"
          value={waarden.voornaam}
          onChange={(e) => zet('voornaam', e.target.value)}
          fout={fouten.voornaam}
        />
        <Veld
          label="Achternaam"
          verplicht
          autoComplete="family-name"
          value={waarden.achternaam}
          onChange={(e) => zet('achternaam', e.target.value)}
          fout={fouten.achternaam}
        />
        <Veld
          label="E-mailadres"
          type="email"
          inputMode="email"
          verplicht
          autoComplete="email"
          uitleg="Hier sturen we de bevestiging naartoe."
          value={waarden.email}
          onChange={(e) => zet('email', e.target.value)}
          fout={fouten.email}
        />
        <Veld
          label="Telefoonnummer"
          type="tel"
          inputMode="tel"
          verplicht
          autoComplete="tel"
          uitleg="Voor als er iets verandert aan de afspraak."
          value={waarden.telefoon}
          onChange={(e) => zet('telefoon', e.target.value)}
          fout={fouten.telefoon}
        />
      </div>

      <div className="mt-6">
        <Tekstvak
          label="Wil je ons nog iets laten weten?"
          uitleg="Niet verplicht. Bijvoorbeeld waar je last van hebt, of dat je slecht ter been bent."
          rows={4}
          value={waarden.opmerking}
          onChange={(e) => zet('opmerking', e.target.value)}
        />
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-basis text-tekst-licht">
          <input
            type="checkbox"
            checked={waarden.privacy}
            onChange={(e) => zet('privacy', e.target.checked)}
            aria-invalid={fouten.privacy ? true : undefined}
            aria-describedby={fouten.privacy ? 'privacy-fout' : undefined}
            className="mt-1 size-5 shrink-0 accent-[var(--color-messing)]"
          />
          <span>
            Ik ga akkoord met de{' '}
            <Link href="/privacyverklaring/" className="text-messing underline underline-offset-4">
              privacyverklaring
            </Link>
            .
            <span aria-hidden="true" className="text-messing"> *</span>
          </span>
        </label>
        {fouten.privacy && (
          <p id="privacy-fout" className="mt-2 text-bijschrift text-fout">
            {fouten.privacy}
          </p>
        )}
      </div>

      <Honeypot waarde={waarden.website} opWijziging={(w) => zet('website', w)} />
      <Turnstile opToken={(t) => zet('turnstileToken', t)} />

      <div className="mt-8">
        <Knop type="submit" formaat="groot" disabled={bezig}>
          {bezig ? 'Bezig met vastleggen…' : 'Afspraak vastleggen'}
        </Knop>
      </div>
    </form>
  )
}

/* ------------------------------------------------------------- stap 4: klaar */

function Gelukt({
  dienst,
  datum,
  tijd,
  referentie,
  testmodus,
}: {
  dienst: AgendaDienst
  datum: string
  tijd: string
  referentie: string
  testmodus: boolean
}) {
  const [icsUrl, setIcsUrl] = useState<string | null>(null)

  useEffect(() => {
    let url: string | null = null
    import('@/lib/ics').then(({ maakIcs }) => {
      const blob = new Blob([maakIcs({ dienstNaam: dienst.naam, datum, tijd, duurMinuten: dienst.duurMinuten, referentie })], {
        type: 'text/calendar;charset=utf-8',
      })
      url = URL.createObjectURL(blob)
      setIcsUrl(url)
    })
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [dienst, datum, tijd, referentie])

  return (
    <div
      className="rounded-groot border border-messing/40 bg-messing/5 p-8 text-center sm:p-12"
      style={{ animation: 'gelukt-in 700ms var(--ease-rustig) both' }}
    >
      <div
        aria-hidden="true"
        className="mx-auto grid size-16 place-items-center rounded-full border-2 border-messing text-messing"
        style={{ animation: 'gelukt-ring 900ms var(--ease-rustig) 150ms both' }}
      >
        <svg viewBox="0 0 24 24" className="w-8">
          <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h3 className="mt-8 text-kop-2">Tot ziens</h3>
      <p className="mx-auto mt-5 max-w-[34rem] text-lead text-tekst-licht-zacht">
        Je afspraak staat genoteerd. We hebben er zin in, en de koffie staat klaar.
      </p>

      <dl className="mx-auto mt-10 grid max-w-[32rem] gap-4 text-left">
        {[
          ['Wanneer', `${langeDatum(datum, true)} om ${nlTijd(tijd)} uur`],
          ['Waarvoor', dienst.naam],
          ['Waar', `${BEDRIJF.adres.straat}, ${BEDRIJF.adres.plaats}`],
        ].map(([label, waarde]) => (
          <div key={label} className="flex flex-col gap-1 border-b border-inkt-rand pb-4 sm:flex-row sm:gap-6">
            <dt className="shrink-0 text-bijschrift uppercase tracking-[0.14em] text-messing sm:w-28">{label}</dt>
            <dd className="text-basis text-tekst-licht first-letter:uppercase">{waarde}</dd>
          </div>
        ))}
      </dl>

      {testmodus && (
        <p className="mx-auto mt-8 max-w-[34rem] rounded-zacht border border-messing/40 bg-messing/10 px-4 py-3 text-bijschrift text-messing">
          Dit was een testafspraak. De agenda is nog niet gekoppeld, dus er staat niets echt in.
        </p>
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {icsUrl && (
          <a
            href={icsUrl}
            download={`afspraak-oogcontact-${datum}.ics`}
            className="inline-flex min-h-12 items-center justify-center rounded-zacht bg-messing px-6 py-3 text-basis font-medium text-inkt no-underline"
          >
            Zet in mijn agenda
          </a>
        )}
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center rounded-zacht border border-inkt-rand-sterk px-6 py-3 text-basis text-tekst-licht no-underline"
        >
          Terug naar de site
        </Link>
      </div>

      <p className="mt-8 text-bijschrift text-tekst-licht-zacht">
        Komt het toch niet uit? Bel{' '}
        <a href={`tel:${BEDRIJF.telefoon.link}`} className="text-messing underline underline-offset-4">
          {BEDRIJF.telefoon.weergave}
        </a>{' '}
        of stuur een appje.
      </p>

      <style>{`
        @keyframes gelukt-in { from { opacity: 0; transform: translate3d(0, 16px, 0); } to { opacity: 1; transform: none; } }
        @keyframes gelukt-ring { from { opacity: 0; transform: scale(.7); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes gelukt-in { from { opacity: 1; } to { opacity: 1; } }
          @keyframes gelukt-ring { from { opacity: 1; } to { opacity: 1; } }
        }
      `}</style>
    </div>
  )
}

/* ------------------------------------------------------------------- hulpjes */

function Laden({ tekst }: { tekst: string }) {
  return (
    <p className="mt-8 flex items-center gap-3 text-basis text-tekst-licht-zacht" role="status">
      <span
        aria-hidden="true"
        className="size-4 shrink-0 rounded-full border-2 border-inkt-rand-sterk border-t-messing motion-safe:animate-spin"
      />
      {tekst}&hellip;
    </p>
  )
}

function AgendaOnbereikbaar() {
  return (
    <div className="rounded-groot border border-inkt-rand bg-inkt-zacht/60 p-8 sm:p-10">
      <h3 className="text-kop-3">Online inplannen lukt nu even niet</h3>
      <p className="mt-5 max-w-[42rem] text-basis text-tekst-licht-zacht">
        De agenda is op dit moment niet bereikbaar. Vervelend, maar een afspraak maken kan gewoon:
        bel ons of stuur een appje, dan zoeken we samen een moment dat schikt. Ook buiten onze
        openingstijden is er vaak wat mogelijk.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href={`tel:${BEDRIJF.telefoon.link}`}
          className="inline-flex min-h-12 items-center rounded-zacht bg-messing px-6 py-3 text-basis font-medium text-inkt no-underline"
        >
          Bel {BEDRIJF.telefoon.weergave}
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center rounded-zacht border border-inkt-rand-sterk px-6 py-3 text-basis text-tekst-licht no-underline"
        >
          Stuur een appje
        </a>
      </div>
    </div>
  )
}
