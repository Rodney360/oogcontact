import { makeRouteHandler } from '@keystatic/next/route-handler'

import { beheerKanOpslaan } from '@/lib/beheer-koppeling'

import config from '../../../../../keystatic.config'

/**
 * De achterkant van het beheerscherm.
 *
 * Kan er niets opgeslagen worden, dan antwoorden we dat ook eerlijk in plaats
 * van te doen alsof het gelukt is. Zie src/lib/beheer.ts.
 */
const handlers = makeRouteHandler({ config })

function nietGekoppeld() {
  return Response.json(
    {
      fout: 'Het beheerscherm is nog niet aan GitHub gekoppeld, dus opslaan kan niet. Zie docs/live-gaan.md.',
    },
    { status: 503 },
  )
}

export const GET = beheerKanOpslaan() ? handlers.GET : nietGekoppeld
export const POST = beheerKanOpslaan() ? handlers.POST : nietGekoppeld
