import type { MetadataRoute } from 'next'

import { BEDRIJF } from '@/content/bedrijf'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BEDRIJF.naam} · opticien in Groningen`,
    short_name: 'Oogcontact',
    description:
      'Zelfstandige opticien aan het Overwinningsplein in Groningen. Wij nemen de tijd voor je.',
    start_url: '/',
    display: 'standalone',
    background_color: '#11151C',
    theme_color: '#11151C',
    lang: 'nl',
    icons: [
      { src: '/logo/icoon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/logo/icoon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/logo/icoon-maskeerbaar-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
