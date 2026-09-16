import type { MetadataRoute } from 'next'

import { ONGEWIJZIGD, NIEUW } from '../../config/url-map.mjs'
import { berichten } from '@/lib/beheer'
import { SITE_URL } from '@/lib/seo'

/**
 * De sitemap: welke pagina's er zijn en hoe belangrijk ze zijn.
 *
 * De lijst komt uit config/url-map.mjs, zodat hij niet uit de pas kan lopen
 * met de redirects. Nieuwsberichten komen uit het beheerscherm.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const nu = new Date()

  const belang: Record<string, number> = {
    '/': 1,
    '/afspraak-maken/': 0.9,
    '/contact/': 0.8,
    '/aanbod/': 0.8,
    '/brillen/': 0.8,
    '/contactlenzen/': 0.8,
    '/zonnebrillen/': 0.8,
    '/kinderbrillen/': 0.8,
    '/loepbrillen/': 0.8,
    '/over-ons/': 0.7,
    '/collectie/': 0.7,
    '/ultiem-nauwkeurig-zicht/': 0.7,
    '/nieuws/': 0.6,
  }

  const paginas = [...ONGEWIJZIGD, ...NIEUW].map((p) => ({
    url: new URL(p.url, SITE_URL).toString(),
    lastModified: nu,
    changeFrequency: (p.url === '/' || p.url === '/nieuws/' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: belang[p.url] ?? 0.4,
  }))

  const nieuws = (await berichten()).map((b) => ({
    url: new URL(`/nieuws/${b.slug}/`, SITE_URL).toString(),
    lastModified: b.datum ? new Date(b.datum) : nu,
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }))

  return [...paginas, ...nieuws]
}
