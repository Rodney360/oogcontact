import type { NextConfig } from 'next'
// config/url-map.mjs is bewust gewoon JavaScript, zodat zowel next.config als
// de losse scripts en de tests hem kunnen gebruiken.
import { alsNextRedirects } from './config/url-map.mjs'

/**
 * Beveiligingsheaders.
 *
 * De CSP staat inline scripts toe omdat Next.js zijn eigen opstartscript inline
 * plaatst. Alle andere bronnen zijn strak dichtgezet: geen plugins, geen
 * onbekende frames en de site mag nergens anders in een iframe gezet worden.
 */
const csp = [
  "default-src 'self'",
  // 'unsafe-inline' is nodig voor het opstartscript van Next.js.
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com",
  "font-src 'self'",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com https://oogcontactbijgerard.oo2.online",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  // Alleen live: deze regel maakt van elk http-verzoek een https-verzoek. Dat
  // hoort zo op het echte domein, maar sloopt het werken op http://localhost.
  ...(process.env.NODE_ENV === 'production' ? ['upgrade-insecure-requests'] : []),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
]

const nextConfig: NextConfig = {
  // Alle oude WordPress-URL's eindigden op een slash. Door dat zo te houden
  // blijft elke bestaande link en zoekresultaat gewoon werken.
  //
  // Let op: dit geldt ook voor de API-routes. Roep die daarom altijd mét slash
  // aan (/api/contact/), anders kost elk verzoek een omleiding.
  trailingSlash: true,

  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 390, 640, 768, 1024, 1280, 1440, 1920, 2560],
    imageSizes: [96, 160, 240, 320, 480],
  },

  async redirects() {
    return alsNextRedirects()
  },

  async headers() {
    return [
      { source: '/:pad*', headers: securityHeaders },
      {
        // Verwerkte afbeeldingen krijgen een hash in de naam en veranderen nooit.
        source: '/beeld/:pad*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default nextConfig
