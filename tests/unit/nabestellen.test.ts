/**
 * Controleert het nabestelformulier voor contactlenzen.
 *
 *   npm run test:unit
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  LEGE_BESTELLING,
  beginAantal,
  volgendAantal,
  nabestelFouten,
  nabestelBericht,
  type Bestelling,
} from '../../src/lib/nabestellen.ts'

const goed: Bestelling = {
  ...LEGE_BESTELLING,
  naam: 'Jan Jansen',
  soort: 'dag',
  aantal: 90,
  vloeistof: 'nee',
}

test('daglenzen beginnen bij 30 en gaan per 30', () => {
  assert.equal(beginAantal('dag'), 30)
  assert.equal(volgendAantal('dag', 30, 1), 60)
  assert.equal(volgendAantal('dag', 60, -1), 30)
  assert.equal(volgendAantal('dag', 30, -1), 30, 'nooit minder dan 30')
})

test('maandlenzen gaan per doosje van 6', () => {
  assert.equal(beginAantal('maand'), 1)
  assert.equal(volgendAantal('maand', 1, 1), 2)
  assert.equal(volgendAantal('maand', 1, -1), 1, 'nooit minder dan een doosje')
})

test('een lege bestelling noemt wat er mist', () => {
  const f = nabestelFouten(LEGE_BESTELLING)
  assert.ok(f.naam)
  assert.ok(f.soort)
  assert.ok(f.vloeistof)
  assert.equal(f.telefoon, undefined, 'telefoon is niet verplicht')
})

test('daglenzen onder de 30 of buiten een veelvoud van 30 mogen niet', () => {
  assert.ok(nabestelFouten({ ...goed, aantal: 20 }).aantal)
  assert.ok(nabestelFouten({ ...goed, aantal: 45 }).aantal)
  assert.deepEqual(nabestelFouten(goed), {})
})

test('het bericht bevat alles wat nodig is, zonder controleafspraak', () => {
  const tekst = nabestelBericht({ ...goed, telefoon: '06 12 34 56 78', opmerking: 'Ophalen zaterdag' })
  assert.match(tekst, /zonder controleafspraak/)
  assert.match(tekst, /Naam: Jan Jansen/)
  assert.match(tekst, /Telefoon: 06 12 34 56 78/)
  assert.match(tekst, /Soort: Daglenzen/)
  assert.match(tekst, /Aantal: 90 daglenzen per oog, voor beide ogen/)
  assert.match(tekst, /Lenzenvloeistof: nee/)
  assert.match(tekst, /Opmerking: Ophalen zaterdag/)
})

test('maandlenzen voor een oog en met vloeistof', () => {
  const tekst = nabestelBericht({ ...goed, soort: 'maand', aantal: 1, ogen: 'links', vloeistof: 'ja' })
  assert.match(tekst, /Aantal: 1 doosje van 6, alleen voor links/)
  assert.match(tekst, /Lenzenvloeistof: ja, graag/)
  assert.doesNotMatch(tekst, /Telefoon:/, 'geen lege regel voor een telefoon die niet is ingevuld')
})
