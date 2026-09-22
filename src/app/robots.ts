import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'

/**
 * Wat zoekmachines wel en niet mogen bekijken.
 *
 * Alles mag, behalve het beheerscherm, de API-routes en de controlepagina van
 * de agenda: die hebben voor een zoekmachine geen betekenis.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/keystatic/', '/agenda-controle/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
