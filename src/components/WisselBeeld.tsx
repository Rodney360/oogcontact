/**
 * Twee beelden op dezelfde plek: de bovenste maakt plaats voor de onderste.
 *
 * Bovenaan Over ons staat een tekening van Gerard en Gerda; ga je er met de
 * muis overheen, dan verschijnt de foto eronder. Op een telefoon werkt een tik
 * hetzelfde (het vlak kan focus krijgen), en met de tabtoets ook.
 *
 * Alleen `opacity` beweegt, dus er verspringt niets. Bij "minder beweging"
 * blijft het een zachte overgang, zoals de huisstijl voorschrijft.
 */

import { Beeld } from '@/components/Beeld'
import type { BeeldSlot } from '@/content/beeld'

type Props = {
  /** Wat je eerst ziet. */
  boven: BeeldSlot
  /** Wat verschijnt als je erover beweegt of erop tikt. */
  onder: BeeldSlot
  sizes: string
  prioriteit?: boolean
}

export function WisselBeeld({ boven, onder, sizes, prioriteit = false }: Props) {
  return (
    <figure>
      <div
        tabIndex={0}
        className="group relative cursor-pointer overflow-hidden rounded-groot border border-inkt-rand outline-none focus-visible:ring-2 focus-visible:ring-messing focus-visible:ring-offset-4 focus-visible:ring-offset-inkt"
      >
        <Beeld slot={onder} sizes={sizes} vullend />
        <div className="absolute inset-0 transition-opacity duration-500 ease-[var(--ease-rustig)] group-hover:opacity-0 group-focus:opacity-0">
          <Beeld slot={boven} sizes={sizes} prioriteit={prioriteit} vullend />
        </div>
      </div>
      <figcaption className="mt-3 text-bijschrift text-tekst-licht-zacht">
        <span className="[@media(hover:none)]:hidden">Ga er met je muis overheen voor de foto.</span>
        <span className="[@media(hover:hover)]:hidden">Tik op de tekening voor de foto.</span>
      </figcaption>
    </figure>
  )
}
