import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

/**
 * Wat zoekmachines wel en niet mogen bekijken.
 *
 * Alles mag, behalve het beheerscherm en de API-routes: die hebben voor een
 * zoekmachine geen betekenis.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/keystatic/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
