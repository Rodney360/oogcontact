'use client'

/**
 * Het beheerscherm zelf. Keystatic tekent dit helemaal in de browser.
 *
 * Staat apart van page.tsx omdat die eerst moet kijken of er wel iets te
 * bewaren valt; zie src/lib/beheer.ts.
 */

import { makePage } from '@keystatic/next/ui/app'

import config from '../../../../keystatic.config'

export default makePage(config)
