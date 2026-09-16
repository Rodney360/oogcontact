'use client'

/**
 * De losse velden waar de formulieren uit zijn opgebouwd.
 *
 * Elk veld heeft een echt label (geen zwevende tekst in het veld), een
 * duidelijke rand, een foutmelding die aan het veld gekoppeld is via
 * aria-describedby, en het juiste toetsenbord op mobiel.
 */

import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'

type Basis = {
  label: string
  fout?: string
  /** Extra uitleg onder het label. */
  uitleg?: string
  verplicht?: boolean
  licht?: boolean
}

function Omhulsel({
  label,
  fout,
  uitleg,
  verplicht,
  licht,
  veldId,
  foutId,
  uitlegId,
  children,
}: Basis & { veldId: string; foutId: string; uitlegId: string; children: ReactNode }) {
  return (
    <div>
      <label
        htmlFor={veldId}
        className={`block text-bijschrift font-medium ${licht ? 'text-tekst' : 'text-tekst-licht'}`}
      >
        {label}
        {verplicht && (
          <>
            <span aria-hidden="true" className={licht ? 'text-messing-diep' : 'text-messing'}>
              {' '}
              *
            </span>
            <span className="alleen-voor-schermlezers"> (verplicht)</span>
          </>
        )}
      </label>
      {uitleg && (
        <p id={uitlegId} className={`mt-1 text-bijschrift ${licht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht'}`}>
          {uitleg}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {fout && (
        <p
          id={foutId}
          className={`mt-2 flex items-start gap-2 text-bijschrift ${licht ? 'text-fout-diep' : 'text-fout'}`}
        >
          <svg viewBox="0 0 16 16" className="mt-0.5 size-4 shrink-0" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.5v4.5M8 11.2v.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {fout}
        </p>
      )}
    </div>
  )
}

function invoerKlassen(fout: boolean, licht: boolean) {
  return [
    'w-full min-h-12 rounded-zacht border px-4 py-3 text-basis',
    'transition-colors duration-200',
    licht
      ? 'bg-ivoor text-tekst placeholder:text-tekst-zacht'
      : 'bg-inkt text-tekst-licht placeholder:text-tekst-licht-zacht',
    fout
      ? licht ? 'border-fout-diep' : 'border-fout'
      : licht ? 'border-ivoor-rand-sterk' : 'border-inkt-rand-sterk',
    licht ? 'focus:border-messing-diep' : 'focus:border-messing',
  ].join(' ')
}

type VeldProps = Basis & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>

export function Veld({ label, fout, uitleg, verplicht, licht = false, ...rest }: VeldProps) {
  const id = useId()
  const foutId = `${id}-fout`
  const uitlegId = `${id}-uitleg`

  return (
    <Omhulsel {...{ label, fout, uitleg, verplicht, licht, veldId: id, foutId, uitlegId }}>
      <input
        id={id}
        aria-invalid={fout ? true : undefined}
        aria-describedby={[fout ? foutId : null, uitleg ? uitlegId : null].filter(Boolean).join(' ') || undefined}
        aria-required={verplicht || undefined}
        className={invoerKlassen(Boolean(fout), licht)}
        {...rest}
      />
    </Omhulsel>
  )
}

type TekstvakProps = Basis & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'>

export function Tekstvak({ label, fout, uitleg, verplicht, licht = false, ...rest }: TekstvakProps) {
  const id = useId()
  const foutId = `${id}-fout`
  const uitlegId = `${id}-uitleg`

  return (
    <Omhulsel {...{ label, fout, uitleg, verplicht, licht, veldId: id, foutId, uitlegId }}>
      <textarea
        id={id}
        rows={5}
        aria-invalid={fout ? true : undefined}
        aria-describedby={[fout ? foutId : null, uitleg ? uitlegId : null].filter(Boolean).join(' ') || undefined}
        className={`${invoerKlassen(Boolean(fout), licht)} resize-y`}
        {...rest}
      />
    </Omhulsel>
  )
}

type KeuzeProps = {
  /** De vraag boven de keuzes. */
  legenda: string
  uitleg?: string
  fout?: string
  verplicht?: boolean
  licht?: boolean
  /** 'een' voor radioknoppen, 'meer' voor aankruisvakjes. */
  soort: 'een' | 'meer'
  naam: string
  opties: { waarde: string; label: string }[]
  gekozen: string[]
  opWijziging: (waarden: string[]) => void
  /** Naast elkaar in plaats van onder elkaar. */
  naastElkaar?: boolean
}

/** Een groepje radioknoppen of aankruisvakjes, met een echte fieldset erom. */
export function Keuze({
  legenda,
  uitleg,
  fout,
  verplicht,
  licht = false,
  soort,
  naam,
  opties,
  gekozen,
  opWijziging,
  naastElkaar = false,
}: KeuzeProps) {
  const id = useId()
  const foutId = `${id}-fout`

  const wissel = (waarde: string) => {
    if (soort === 'een') return opWijziging([waarde])
    return opWijziging(gekozen.includes(waarde) ? gekozen.filter((w) => w !== waarde) : [...gekozen, waarde])
  }

  return (
    <fieldset aria-describedby={fout ? foutId : undefined} aria-invalid={fout ? true : undefined}>
      <legend className={`text-bijschrift font-medium ${licht ? 'text-tekst' : 'text-tekst-licht'}`}>
        {legenda}
        {verplicht && (
          <>
            <span aria-hidden="true" className={licht ? 'text-messing-diep' : 'text-messing'}>
              {' '}
              *
            </span>
            <span className="alleen-voor-schermlezers"> (verplicht)</span>
          </>
        )}
      </legend>
      {uitleg && (
        <p className={`mt-1 text-bijschrift ${licht ? 'text-tekst-zacht' : 'text-tekst-licht-zacht'}`}>{uitleg}</p>
      )}

      <div className={`mt-3 ${naastElkaar ? 'flex flex-wrap gap-2.5' : 'grid gap-2.5 sm:grid-cols-2'}`}>
        {opties.map((optie) => {
          const aan = gekozen.includes(optie.waarde)
          return (
            <label
              key={optie.waarde}
              className={[
                'flex min-h-12 cursor-pointer select-none items-center gap-3 rounded-zacht border px-4 py-3',
                'text-basis transition-colors duration-200',
                aan
                  ? licht
                    ? 'border-messing-diep bg-messing-zacht/50 text-tekst'
                    : 'border-messing bg-messing/10 text-tekst-licht'
                  : licht
                    ? 'border-ivoor-rand-sterk text-tekst hover:border-messing-diep'
                    : 'border-inkt-rand-sterk text-tekst-licht hover:border-messing',
              ].join(' ')}
            >
              <input
                type={soort === 'een' ? 'radio' : 'checkbox'}
                name={naam}
                value={optie.waarde}
                checked={aan}
                onChange={() => wissel(optie.waarde)}
                className="size-5 shrink-0 accent-[var(--color-messing)]"
              />
              <span>{optie.label}</span>
            </label>
          )
        })}
      </div>

      {fout && (
        <p id={foutId} className={`mt-2 text-bijschrift ${licht ? 'text-fout-diep' : 'text-fout'}`}>
          {fout}
        </p>
      )}
    </fieldset>
  )
}

/**
 * Het veld dat alleen bots invullen. Het staat niet op het scherm en wordt
 * overgeslagen door schermlezers en door de tabtoets.
 */
export function Honeypot({
  waarde,
  opWijziging,
}: {
  waarde: string
  opWijziging: (waarde: string) => void
}) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="website-veld">Laat dit veld leeg</label>
      <input
        id="website-veld"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={waarde}
        onChange={(e) => opWijziging(e.target.value)}
      />
    </div>
  )
}
