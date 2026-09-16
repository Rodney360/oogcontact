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

/**
 * Of de pagina al een stukje naar beneden gescrold is.
 *
 * De scrollpositie komt van buiten React, dus useSyncExternalStore. Zo staat
 * de balk meteen goed als iemand een pagina halverwege opent of herlaadt.
 */
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

function Brilvorm({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 36" className={className} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round">
        <circle cx="30" cy="19" r="14.5" />
        <circle cx="76" cy="19" r="14.5" />
        <path d="M44.5 17.5c3.5-2.6 13.5-2.6 17 0" />
        <path d="M15.5 17.5C12 14.9 6 14.9 2.5 17.5" />
        <path d="M90.5 17.5c3.5-2.6 9.5-2.6 13 0" />
      </g>
    </svg>
  )
}

export function Header() {
  const pad = usePathname()
  const gescrold = useGescrold()
  /**
   * De stand van het menu wordt onthouden samen met de pagina waarop het
   * geopend werd. Ga je naar een andere pagina, dan klopt die pagina niet meer
   * en is het menu vanzelf dicht - daar is geen apart opruimmoment voor nodig.
   */
  const [menu, setMenu] = useState<{ open: boolean; submenu: string | null; pad: string }>({
    open: false,
    submenu: null,
    pad,
  })
  const opDezePagina = menu.pad === pad
  const menuOpen = opDezePagina && menu.open
  const openSubmenu = opDezePagina ? menu.submenu : null

  const setMenuOpen = useCallback(
    (open: boolean | ((o: boolean) => boolean)) =>
      setMenu((m) => ({
        pad,
        submenu: null,
        open: typeof open === 'function' ? open(m.pad === pad && m.open) : open,
      })),
    [pad],
  )

  const setOpenSubmenu = useCallback(
    (submenu: string | null) => setMenu((m) => ({ pad, open: m.pad === pad && m.open, submenu })),
    [pad],
  )
  const menuKnop = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  // De hero staat alleen op de homepage; daar mag de balk doorzichtig beginnen.
  const overHero = pad === '/' && !gescrold

  // Zolang het menu open is: niet achterlangs scrollen, en Escape sluit.
  useEffect(() => {
    if (!menuOpen) return
    const vorige = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const opToets = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuKnop.current?.focus()
      }
    }
    document.addEventListener('keydown', opToets)
    return () => {
      document.body.style.overflow = vorige
      document.removeEventListener('keydown', opToets)
    }
  }, [menuOpen, setMenuOpen])

  const actief = (itemPad: string) =>
    itemPad === '/' ? pad === '/' : pad.startsWith(itemPad.replace(/\/$/, ''))

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        overHero
          ? 'bg-transparent py-4'
          : 'bg-inkt/85 py-2 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-[86rem] items-center gap-4 px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 text-ivoor no-underline transition-opacity hover:opacity-80"
          aria-label="Oogcontact bij Gerard, naar de homepage"
        >
          <Brilvorm className={`w-16 transition-all duration-500 ${overHero ? 'sm:w-20' : ''}`} />
          <span className="hidden font-kop text-[1.05rem] leading-tight tracking-tight sm:block">
            Oogcontact
            <span className="block text-bijschrift text-tekst-licht-zacht">bij Gerard</span>
          </span>
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
                  onFocus={() => setOpenSubmenu(item.kinderen ? item.pad : null)}
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
          <KnopLink href="/afspraak-maken/" uiterlijk="messing" className="text-bijschrift max-[420px]:px-4">
            Afspraak maken
          </KnopLink>

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

      {/* Menu op mobiel: het hele scherm */}
      <div
        id={menuId}
        hidden={!menuOpen}
        className="fixed inset-0 top-0 z-40 overflow-y-auto bg-inkt/98 pb-28 pt-24 backdrop-blur-2xl lg:hidden"
      >
        <nav aria-label="Menu" className="px-6">
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
