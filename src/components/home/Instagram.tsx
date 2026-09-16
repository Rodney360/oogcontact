/**
 * De Instagram-grid.
 *
 * Geen widget van Instagram zelf: die is zwaar en zet van alles op de computer
 * van de bezoeker. In plaats daarvan een rustige grid van foto's die in het
 * beheerscherm gezet worden, met een knop ernaast.
 *
 * Staan er nog geen foto's in, dan blijft het bij de uitnodiging — nooit een
 * leeg raster met gaten erin.
 */

import { Verschijnt } from '@/components/Beweging'
import { KnopLink } from '@/components/Knop'
import { Sectie } from '@/components/Sectie'
import { BEDRIJF } from '@/content/bedrijf'
import type { InstagramBericht } from '@/lib/beheer'

export function Instagram({ berichten }: { berichten: InstagramBericht[] }) {
  return (
    <Sectie compact>
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-bijschrift font-semibold uppercase tracking-[0.16em] text-messing">
            Instagram
          </p>
          <h2 className="mt-4 text-kop-2">Kijk mee in de winkel</h2>
          <p className="mt-5 max-w-[34rem] text-lead text-tekst-licht-zacht">
            Nieuwe monturen, een mooie etalage of gewoon een goede dag. We laten het zien op
            Instagram.
          </p>
        </div>

        <KnopLink href={BEDRIJF.socials.instagram} uiterlijk="omlijnd">
          Volg ons op Instagram
        </KnopLink>
      </div>

      {berichten.length > 0 && (
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {berichten.map((bericht, i) => (
            <Verschijnt key={bericht.slug} als="li" vertraging={i * 0.05}>
              <Omhulsel link={bericht.link}>
                <div className="group aspect-square overflow-hidden rounded-kaart border border-inkt-rand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bericht.afbeelding}
                    alt={bericht.omschrijving}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-700 ease-[var(--ease-rustig)] motion-safe:group-hover:scale-105"
                  />
                </div>
              </Omhulsel>
            </Verschijnt>
          ))}
        </ul>
      )}
    </Sectie>
  )
}

function Omhulsel({ link, children }: { link: string | null; children: React.ReactNode }) {
  if (!link) return children
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block no-underline">
      {children}
      <span className="alleen-voor-schermlezers">Bekijk dit bericht op Instagram</span>
    </a>
  )
}
