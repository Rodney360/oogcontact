/**
 * Van oude WordPress-URL naar nieuwe URL.
 *
 * Deze lijst is de enige bron van waarheid: next.config.ts maakt er de
 * 301-redirects mee, scripts/genereer-url-map.mjs maakt er docs/url-map.md mee
 * en tests/redirects.spec.ts controleert of ze allemaal werken.
 *
 * De site draait met trailingSlash: true. Alle oude pagina-URL's eindigden op
 * een slash en blijven daardoor letterlijk hetzelfde werken - dat is het beste
 * wat je voor de vindbaarheid kunt doen. Alleen wat echt verhuist of verdwijnt
 * staat hieronder.
 */

/** @typedef {{ van: string, naar: string, reden: string }} Redirect */

/** Pagina's die op precies dezelfde URL blijven staan. Geen redirect nodig. */
export const ONGEWIJZIGD = [
  { url: '/', titel: 'Home' },
  { url: '/ultiem-nauwkeurig-zicht/', titel: 'Ultiem nauwkeurig zicht' },
  { url: '/aanbod/', titel: 'Aanbod' },
  { url: '/brillen/', titel: 'Brillen' },
  { url: '/contactlenzen/', titel: 'Contactlenzen' },
  { url: '/zonnebrillen/', titel: 'Zonnebrillen' },
  { url: '/kinderbrillen/', titel: 'Kinderbrillen' },
  { url: '/loepbrillen/', titel: 'Loepbrillen' },
  { url: '/nieuws/', titel: 'Nieuws' },
  { url: '/over-ons/', titel: 'Over ons' },
  { url: '/contact/', titel: 'Contact' },
  { url: '/afspraak-maken/', titel: 'Afspraak maken' },
  { url: '/algemene-voorwaarden/', titel: 'Algemene voorwaarden' },
]

/** Nieuwe pagina's die nog niet op de oude site stonden. */
export const NIEUW = [
  { url: '/collectie/', titel: 'Collectie & merken' },
  { url: '/privacyverklaring/', titel: 'Privacyverklaring' },
  { url: '/cookieverklaring/', titel: 'Cookieverklaring' },
]

/**
 * De slugs van de vijf nieuwsberichten van de oude WordPress-site.
 *
 * De berichten zelf staan niet meer op de site - ze gingen over 2022 - maar de
 * adressen kunnen nog in Google of in iemands geschiedenis staan. Ze worden
 * daarom doorgestuurd naar het nieuwsoverzicht. De originelen staan in
 * content-archive/.
 */
export const BERICHTEN = [
  '12-tot-en-met-19-september-is-de-winkel-gesloten',
  'afwijkende-openingstijden',
  'kids-oogcheckweken-6-18-jaar',
  'oogcontact-bij-gerard-is-op-inkoop',
  'extra-drukte-op-het-overwinningsplein',
]

/** @type {Redirect[]} */
export const REDIRECTS = [
  {
    van: '/privacybeleid/',
    naar: '/privacyverklaring/',
    reden: 'Duidelijkere naam; inhoud is opnieuw geschreven op basis van wat de site echt doet.',
  },
  {
    van: '/home/ultiem-nauwkeurig-zicht/',
    naar: '/ultiem-nauwkeurig-zicht/',
    reden: 'Dubbele pagina in WordPress. Er is er nog maar een.',
  },
  {
    van: '/category/geen-categorie/',
    naar: '/nieuws/',
    reden: 'Categorie-archieven van WordPress vervallen; al het nieuws staat op een plek.',
  },
  {
    van: '/category/geen-categorie/actualiteiten/',
    naar: '/nieuws/',
    reden: 'Categorie-archieven van WordPress vervallen.',
  },
  {
    van: '/feed/',
    naar: '/nieuws/rss.xml',
    reden: 'De WordPress-feed wordt de nieuwe RSS-feed.',
  },
  {
    van: '/nieuws/feed/',
    naar: '/nieuws/rss.xml',
    reden: 'De WordPress-feed wordt de nieuwe RSS-feed.',
  },
  {
    van: '/comments/feed/',
    naar: '/nieuws/rss.xml',
    reden: 'Reacties bestonden niet echt; verwijst nu naar het nieuwsoverzicht.',
  },
  // De oude nieuwsberichten stonden los in de root. Ze zijn van de site
  // gehaald - ze gingen over 2022 - maar de adressen blijven werken: wie er
  // nog eentje in zijn geschiedenis of in Google vindt, komt op het
  // nieuwsoverzicht uit in plaats van op een 404.
  ...BERICHTEN.map((slug) => ({
    van: `/${slug}/`,
    naar: '/nieuws/',
    reden: 'Het bericht zelf is verwijderd; het overzicht vangt het adres op.',
  })),
  // WordPress-restanten die zoekmachines nog kennen.
  {
    van: '/wp-login.php',
    naar: '/',
    reden: 'WordPress bestaat niet meer.',
  },
  {
    van: '/wp-admin/:pad*',
    naar: '/',
    reden: 'WordPress bestaat niet meer.',
  },
  {
    van: '/author/:pad*',
    naar: '/nieuws/',
    reden: 'Auteursarchieven van WordPress vervallen.',
  },
  {
    van: '/tag/:pad*',
    naar: '/nieuws/',
    reden: 'Tag-archieven van WordPress vervallen.',
  },
]

/** In het formaat dat Next.js verwacht. */
export function alsNextRedirects() {
  return REDIRECTS.map(({ van, naar }) => ({
    source: van,
    destination: naar,
    permanent: true,
  }))
}
