/**
 * Een foto van de site.
 *
 *   <Beeld slot="winkel-tafel" sizes="100vw" prioriteit />
 *
 * Levert AVIF met WebP als terugval, in de breedtes die `npm run images` heeft
 * gemaakt, met het wazige laadplaatje eronder. De alt-tekst komt uit
 * config/beeld.mjs, zodat hij overal hetzelfde is; alleen als dezelfde foto
 * ergens een andere betekenis heeft, geef je een eigen `alt` mee.
 */

import { beeld, type BeeldSlot } from '@/content/beeld'

type Props = {
  slot: BeeldSlot
  /** Hoe breed de foto op het scherm wordt. Bepaalt welk bestand geladen wordt. */
  sizes: string
  /** Alleen voor beeld dat meteen in beeld staat (de hero). Laadt met voorrang. */
  prioriteit?: boolean
  /** Overschrijft de standaard alt-tekst, als de foto hier iets anders betekent. */
  alt?: string
  /** Puur decoratief: schermlezers slaan hem dan over. */
  decoratief?: boolean
  className?: string
  /** Hoe de foto zijn kader vult. */
  vullend?: boolean
}

export function Beeld({
  slot,
  sizes,
  prioriteit = false,
  alt,
  decoratief = false,
  className = '',
  vullend = false,
}: Props) {
  const g = beeld(slot)
  const srcSet = (ext: string) => g.breedtes.map((b) => `/beeld/${slot}-${b}.${ext} ${b}w`).join(', ')
  const grootste = g.breedtes[g.breedtes.length - 1] ?? g.breedte

  return (
    <picture className={vullend ? 'block h-full w-full' : undefined}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={`/beeld/${slot}-${grootste}.webp`}
        srcSet={srcSet('webp')}
        sizes={sizes}
        width={g.breedte}
        height={g.hoogte}
        alt={decoratief ? '' : (alt ?? g.alt)}
        aria-hidden={decoratief || undefined}
        loading={prioriteit ? 'eager' : 'lazy'}
        fetchPriority={prioriteit ? 'high' : undefined}
        decoding={prioriteit ? 'sync' : 'async'}
        className={`${vullend ? 'h-full w-full object-cover' : ''} ${className}`}
        style={{
          // Het wazige plaatje staat eronder tot de echte foto geladen is.
          backgroundImage: `url(${g.blur})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </picture>
  )
}
