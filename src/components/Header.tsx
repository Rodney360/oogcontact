'use client'

/**
 * De koptekst van de site.
 *
 * Boven aan de pagina staat hij doorzichtig over de hero. Zodra je gaat
 * scrollen wordt het een compacte, licht doorschijnende balk. "Afspraak maken"
 * is altijd zichtbaar.
 *
 * Op mobiel opent het menu als een volledig scherm, waarin de onderdelen na
 * elkaar binnenkomen. Zolang dat menu open staat, is de rest van de pagina
 * afgeschermd voor schermlezers en kan er niet achterlangs gescrold worden.
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'

import { HOOFDMENU } from '@/content/navigatie'
import { KnopLink } from '@/components/Knop'
import { scrollNaarBoven, zetSoepelScrollenStil } from '@/components/Beweging'
import type { Mededeling } from '@/lib/beheer'

/**
 * Of de pagina al een stukje naar beneden gescrold is.
 *
 * De scrollpositie komt van buiten React, dus useSyncExternalStore. Zo staat
 * de balk meteen goed als iemand een pagina halverwege opent of herlaadt.
 */
/** De mededelingenbalk, bijvoorbeeld voor een vakantiemelding. */
function Mededelingbalk({ mededeling }: { mededeling: Mededeling }) {
  const inhoud = (
    <>
      <svg viewBox="0 0 20 20" className="size-4 shrink-0" aria-hidden="true">
        <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 5.5v5M10 13.4v.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span>{mededeling.tekst}</span>
    </>
  )

  return (
    <div className="relative z-50 bg-messing text-inkt">
      <div className="mx-auto max-w-[86rem] px-6">
        {mededeling.link ? (
          <Link
            href={mededeling.link}
            className="flex min-h-11 items-center justify-center gap-2.5 py-2 text-center text-bijschrift font-medium text-inkt underline underline-offset-4"
          >
            {inhoud}
          </Link>
        ) : (
          <p className="flex min-h-11 items-center justify-center gap-2.5 py-2 text-center text-bijschrift font-medium">
            {inhoud}
          </p>
        )}
      </div>
    </div>
  )
}

function useGescrold(): boolean {
  const abonneer = useCallback((opWijziging: () => void) => {
    window.addEventListener('scroll', opWijziging, { passive: true })
    return () => window.removeEventListener('scroll', opWijziging)
  }, [])

  return useSyncExternalStore(
    abonneer,
    () => window.scrollY > 24,
    () => false,
  )
}


export function Header({ mededeling }: { mededeling: Mededeling | null }) {
  const pad = usePathname()
  const gescrold = useGescrold()
  /**
   * Bij elke paginawissel gaat het menu dicht.
   *
   * Dat gebeurt hier, tijdens het opbouwen van de balk, en niet achteraf: zo
   * is het menu al dicht op het moment dat de nieuwe pagina in beeld komt en
   * zie je het niet nog even staan.
   *
   * Eerder werd de pagina bij de stand van het menu bewaard en werd "dicht"
   * daaruit afgeleid. Dat ging mis bij de terugknop van de browser: kwam je
   * terug op de pagina waar je het menu geopend had, dan klopte die pagina
   * weer en stond het menu opeens weer open - met een scherm dat niet meer
   * wilde scrollen tot gevolg.
   */
  const [vorigPad, setVorigPad] = useState(pad)
  const [menu, setMenu] = useState<{ open: boolean; submenu: string | null }>({
    open: false,
    submenu: null,
  })
  if (vorigPad !== pad) {
    setVorigPad(pad)
    setMenu({ open: false, submenu: null })
  }
  const menuOpen = menu.open
  const openSubmenu = menu.submenu

  const setMenuOpen = useCallback(
    (open: boolean | ((o: boolean) => boolean)) =>
      setMenu((m) => ({
        submenu: null,
        open: typeof open === 'function' ? open(m.open) : open,
      })),
    [],
  )

  const setOpenSubmenu = useCallback(
    (submenu: string | null) => setMenu((m) => ({ open: m.open, submenu })),
    [],
  )
  const menuKnop = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  /**
   * Even een vlaggetje omhoog op het moment vlak na Escape. De aandacht gaat
   * dan terug naar de knop waar je vandaan kwam, en zonder dit vlaggetje zou
   * dat het uitklapmenu meteen weer openzetten.
   */
  const negeerFocus = useRef(false)

  // De hero staat alleen op de homepage; daar mag de balk doorzichtig beginnen.
  // Met een mededeling erboven is doorzichtig niet meer mooi: die balk heeft
  // zijn eigen kleur en dan hoort de rest daar strak op aan te sluiten.
  const overHero = pad === '/' && !gescrold && !mededeling

  /**
   * Zolang het menu open is: niet achterlangs scrollen.
   *
   * Twee dingen zijn daarvoor nodig. `overflow: hidden` houdt het gewone
   * scrollen tegen, en het soepele scrollen moet apart stilgezet worden:
   * dat verzet de pagina zelf en trekt zich van `overflow` niets aan.
   */
  useEffect(() => {
    if (!menuOpen) return
    const vorige = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    zetSoepelScrollenStil(true)
    return () => {
      document.body.style.overflow = vorige
      zetSoepelScrollenStil(false)
    }
  }, [menuOpen])

  /**
   * Escape sluit wat er open staat: eerst een uitgeklapt onderdeel op desktop,
   * anders het hele menu op mobiel. De aandacht gaat daarna terug naar de knop
   * waar je vandaan kwam, zodat je met het toetsenbord niet verdwaalt.
   */
  useEffect(() => {
    if (!menuOpen && !openSubmenu) return
    const opToets = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (openSubmenu) {
        const knop = document.querySelector<HTMLAnchorElement>(
          `header nav a[href="${openSubmenu}"]`,
        )
        negeerFocus.current = true
        knop?.focus()
        negeerFocus.current = false
        setOpenSubmenu(null)
      } else {
        setMenuOpen(false)
        menuKnop.current?.focus()
      }
    }
    document.addEventListener('keydown', opToets)
    return () => document.removeEventListener('keydown', opToets)
  }, [menuOpen, openSubmenu, setMenuOpen, setOpenSubmenu])

  const actief = (itemPad: string) =>
    itemPad === '/' ? pad === '/' : pad.startsWith(itemPad.replace(/\/$/, ''))

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        // bg-inkt/95: op 85% schemerde elke lichte foto die eronderdoor
        // schoof door de balk heen, en dat flikkerde achter het logo langs.
        overHero ? 'bg-transparent' : 'bg-inkt/95 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl',
      ].join(' ')}
    >
      {mededeling && <Mededelingbalk mededeling={mededeling} />}

      {/*
        relative z-50: de balk zelf moet boven het opengeklapte menu liggen.
        Het menupaneel hieronder is fixed en bedekt het hele scherm; zonder dit
        lag het over de sluitknop en het logo heen. De knop was dan wel te zien,
        maar niet aan te tikken - op een telefoon kwam je het menu daardoor
        alleen nog uit door ergens naartoe te gaan.
      */}
      <div
        className={[
          'relative z-50 mx-auto flex max-w-[86rem] items-center gap-4 px-6 transition-all duration-500',
          overHero ? 'py-4' : 'py-2',
        ].join(' ')}
      >
        {/*
          min-h-11: het logo is maar 36 pixels hoog, maar als link naar de
          homepage moet het aantikgebied minstens 44 bij 44 zijn.
        */}
        {/*
          Sta je al op de homepage, dan valt er niets te navigeren en gebeurde
          er bij een klik op het logo dus niets. Dat is precies het moment
          waarop je het gebruikt: ergens halverwege een lange pagina. Nu brengt
          het logo je daar rustig terug naar boven.
        */}
        <Link
          href="/"
          onClick={(e) => {
            setMenuOpen(false)
            if (pad !== '/') return
            e.preventDefault()
            scrollNaarBoven()
          }}
          className="flex min-h-11 shrink-0 items-center no-underline transition-opacity hover:opacity-80"
          aria-label={
            pad === '/'
              ? 'Oogcontact bij Gerard, terug naar boven'
              : 'Oogcontact bij Gerard, naar de homepage'
          }
        >
          {/*
            Het echte logo van de winkel, overgetrokken uit het origineel
            (zie scripts/maak-logo.mjs). Bewust een <img> en geen inline SVG:
            het overgetrokken pad is 38 kB en dat wil je niet op elke pagina
            in de HTML hebben staan. Een SVG valt bovendien niets te
            optimaliseren, dus next/image voegt hier niets toe.
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/oogcontact-bij-gerard-licht.svg"
            alt="Oogcontact bij Gerard"
            width={946}
            height={200}
            className={`w-[168px] transition-all duration-500 sm:w-[200px] ${overHero ? 'sm:w-[228px]' : ''}`}
          />
        </Link>

        {/* Menu op desktop */}
        <nav aria-label="Hoofdmenu" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {HOOFDMENU.map((item) => (
              <li
                key={item.pad}
                className="relative"
                onMouseEnter={() => item.kinderen && setOpenSubmenu(item.pad)}
                onMouseLeave={() => setOpenSubmenu(null)}
              >
                <Link
                  href={item.pad}
                  aria-current={actief(item.pad) ? 'page' : undefined}
                  aria-expanded={item.kinderen ? openSubmenu === item.pad : undefined}
                  className={[
                    'inline-flex min-h-11 items-center rounded-zacht px-3.5 text-bijschrift no-underline',
                    'transition-colors duration-200',
                    actief(item.pad) ? 'text-messing' : 'text-tekst-licht hover:text-messing',
                  ].join(' ')}
                  onFocus={() => {
                    if (negeerFocus.current) return
                    setOpenSubmenu(item.kinderen ? item.pad : null)
                  }}
                >
                  {item.naam}
                  {item.kinderen && (
                    <svg viewBox="0 0 10 6" className="ml-1.5 w-2.5" aria-hidden="true">
                      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </Link>

                {item.kinderen && openSubmenu === item.pad && (
                  <div className="absolute left-0 top-full w-80 pt-2">
                    <ul className="rounded-kaart border border-inkt-rand bg-inkt-zacht/95 p-2 shadow-2xl backdrop-blur-xl">
                      {item.kinderen.map((kind) => (
                        <li key={kind.pad}>
                          <Link
                            href={kind.pad}
                            className="block rounded-zacht px-4 py-3 no-underline transition-colors hover:bg-inkt"
                          >
                            <span className="block text-bijschrift font-medium text-tekst-licht">{kind.naam}</span>
                            {kind.uitleg && (
                              <span className="mt-0.5 block text-bijschrift leading-snug text-tekst-licht-zacht">
                                {kind.uitleg}
                              </span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {/*
            Op een telefoon staat "Afspraak" al in de vaste balk onderin; een
            tweede knop hier kost alleen de ruimte die de naam van de winkel
            nodig heeft. Het verbergen gebeurt op dit omhulsel en niet op de
            knop zelf, omdat de knop van zichzelf al een display-klasse heeft.
          */}
          <span className="hidden md:block">
            <KnopLink href="/afspraak-maken/" uiterlijk="messing" className="text-bijschrift">
              Afspraak maken
            </KnopLink>
          </span>

          <button
            ref={menuKnop}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            className="inline-flex size-11 items-center justify-center rounded-zacht text-ivoor lg:hidden"
          >
            <span className="alleen-voor-schermlezers">{menuOpen ? 'Menu sluiten' : 'Menu openen'}</span>
            <svg viewBox="0 0 24 24" className="w-6" aria-hidden="true">
              {menuOpen ? (
                <path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 7h18M3 12h18M3 17h18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/*
        Menu op mobiel: het hele scherm.

        Tik je naast de onderdelen - op de lege ruimte eronder of ernaast - dan
        gaat het menu ook dicht. Dat is wat de meeste mensen als eerste
        proberen. De knop rechtsboven blijft gewoon werken; die ligt nu boven
        dit paneel.
      */}
      <div
        id={menuId}
        hidden={!menuOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) setMenuOpen(false)
        }}
        className="fixed inset-0 top-0 z-40 overflow-y-auto bg-inkt/98 pb-28 pt-24 backdrop-blur-2xl lg:hidden"
      >
        <nav
          aria-label="Menu"
          className="px-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMenuOpen(false)
          }}
        >
          <ul className="space-y-1">
            {HOOFDMENU.map((item, i) => (
              <li
                key={item.pad}
                style={{
                  animation: menuOpen ? `menu-in 420ms var(--ease-rustig) ${i * 55}ms both` : undefined,
                }}
              >
                <Link
                  href={item.pad}
                  aria-current={actief(item.pad) ? 'page' : undefined}
                  className={[
                    'flex min-h-14 items-center border-b border-inkt-rand font-kop text-kop-3 no-underline',
                    actief(item.pad) ? 'text-messing' : 'text-tekst-licht',
                  ].join(' ')}
                >
                  {item.naam}
                </Link>
                {item.kinderen && (
                  <ul className="py-2">
                    {item.kinderen.map((kind) => (
                      <li key={kind.pad}>
                        <Link
                          href={kind.pad}
                          className="flex min-h-11 items-center text-basis text-tekst-licht-zacht no-underline"
                        >
                          {kind.naam}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <style>{`
        @keyframes menu-in {
          from { opacity: 0; transform: translate3d(0, 14px, 0); }
          to   { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes menu-in { from { opacity: 1; } to { opacity: 1; } }
        }
      `}</style>
    </header>
  )
}
