/**
 * Controleert de live status "Nu geopend / Gesloten".
 *
 *   npm run test:unit
 *
 * De momenten hieronder staan vast, zodat de uitkomst altijd hetzelfde is.
 * Let op: de winkel is ma en di gesloten, wo t/m vr 9.30-17.30 en za 10.00-16.00.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  huidigeStatus,
  inNederland,
  alsSchemaOrg,
  bijzondereDagenSchemaOrg,
} from '../../src/lib/openingstijden.ts'
import type { Uitzondering } from '../../src/content/openingstijden.ts'

/**
 * Maakt van een Nederlandse klokstand het bijbehorende moment in UTC.
 * Zomertijd in Nederland is UTC+2, wintertijd UTC+1.
 */
function nl(datumTijd: string, offsetUren: number): Date {
  return new Date(new Date(`${datumTijd}:00.000Z`).getTime() - offsetUren * 3600_000)
}

const zomer = (datumTijd: string) => nl(datumTijd, 2)
const winter = (datumTijd: string) => nl(datumTijd, 1)

test('rekent om naar Nederlandse tijd, ook in de zomer', () => {
  const t = inNederland(zomer('2026-09-16T14:30'))
  assert.equal(t.datum, '2026-09-16')
  assert.equal(t.weekdag, 3, 'woensdag')
  assert.equal(t.minuten, 14 * 60 + 30)
})

test('rekent om naar Nederlandse tijd in de winter', () => {
  const t = inNederland(winter('2026-12-02T10:15'))
  assert.equal(t.datum, '2026-12-02')
  assert.equal(t.weekdag, 3)
  assert.equal(t.minuten, 10 * 60 + 15)
})

test('woensdagmiddag: open, met sluitingstijd', () => {
  const s = huidigeStatus(zomer('2026-09-16T14:30'))
  assert.equal(s.open, true)
  assert.match(s.tekst, /Nu geopend/)
  assert.match(s.tekst, /17\.30/)
})

test('precies op openingstijd is open', () => {
  const s = huidigeStatus(zomer('2026-09-16T09:30'))
  assert.equal(s.open, true)
})

test('precies op sluitingstijd is gesloten', () => {
  const s = huidigeStatus(zomer('2026-09-16T17:30'))
  assert.equal(s.open, false)
})

test('woensdagochtend vroeg: vandaag nog open', () => {
  const s = huidigeStatus(zomer('2026-09-16T08:00'))
  assert.equal(s.open, false)
  assert.match(s.tekst, /vandaag open vanaf 9\.30/)
})

test('woensdagavond: morgen weer open', () => {
  const s = huidigeStatus(zomer('2026-09-16T20:00'))
  assert.equal(s.open, false)
  assert.match(s.tekst, /weer open morgen vanaf 9\.30/)
})

test('zaterdag heeft eigen tijden', () => {
  const open = huidigeStatus(zomer('2026-09-19T11:00'))
  assert.equal(open.open, true)
  assert.match(open.tekst, /16\.00/)

  const teVroeg = huidigeStatus(zomer('2026-09-19T09:45'))
  assert.equal(teVroeg.open, false)
  assert.match(teVroeg.tekst, /vandaag open vanaf 10\.00/)
})

test('zondag en maandag gesloten: verwijst door naar woensdag', () => {
  const zondag = huidigeStatus(zomer('2026-09-20T12:00'))
  assert.equal(zondag.open, false)
  assert.match(zondag.tekst, /weer open op woensdag vanaf 9\.30/)

  const maandag = huidigeStatus(zomer('2026-09-21T12:00'))
  assert.equal(maandag.open, false)
  assert.match(maandag.tekst, /weer open op woensdag/)

  const dinsdag = huidigeStatus(zomer('2026-09-22T12:00'))
  assert.equal(dinsdag.open, false)
  assert.match(dinsdag.tekst, /weer open morgen/)
})

test('een uitzondering sluit de winkel op een normale werkdag', () => {
  const uitzonderingen: Uitzondering[] = [
    { datum: '2026-09-16', dagdelen: [], reden: 'Vakantie' },
  ]
  const s = huidigeStatus(zomer('2026-09-16T14:30'), uitzonderingen)
  assert.equal(s.open, false)
  assert.match(s.tekst, /weer open morgen vanaf 9\.30/)
})

test('een uitzondering kan ook afwijkende tijden geven', () => {
  const uitzonderingen: Uitzondering[] = [
    { datum: '2026-12-24', dagdelen: [{ van: 9 * 60 + 30, tot: 13 * 60 }], reden: 'Kerstavond' },
  ]
  const open = huidigeStatus(winter('2026-12-24T12:00'), uitzonderingen)
  assert.equal(open.open, true)
  assert.match(open.tekst, /tot 13\.00/)

  const dicht = huidigeStatus(winter('2026-12-24T14:00'), uitzonderingen)
  assert.equal(dicht.open, false)
})

test('een langere vakantie wijst naar de eerste dag erna', () => {
  const uitzonderingen: Uitzondering[] = Array.from({ length: 10 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 6, 6 + i)).toISOString().slice(0, 10)
    return { datum: d, dagdelen: [], reden: 'Zomervakantie' }
  })
  const s = huidigeStatus(zomer('2026-07-08T12:00'), uitzonderingen)
  assert.equal(s.open, false)
  assert.match(s.tekst, /weer open op/)
})

test('levert openingstijden in het formaat dat Google verwacht', () => {
  const spec = alsSchemaOrg()
  assert.equal(spec.length, 4, 'wo, do, vr, za')
  assert.deepEqual(spec[0], {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: 'https://schema.org/Wednesday',
    opens: '09:30',
    closes: '17:30',
  })
  assert.equal(spec[3]?.opens, '10:00')
  assert.equal(spec[3]?.closes, '16:00')
})

test('een gesloten dag gaat als "dicht" naar Google, zonder de reden', () => {
  const spec = bijzondereDagenSchemaOrg([
    { datum: '2026-10-03', dagdelen: [], reden: 'Lang weekend' },
  ])

  assert.deepEqual(spec, [
    {
      '@type': 'OpeningHoursSpecification',
      validFrom: '2026-10-03',
      validThrough: '2026-10-03',
      opens: '00:00',
      closes: '00:00',
    },
  ])
  // De reden is van Gerard en Gerda, niet van Google.
  assert.doesNotMatch(JSON.stringify(spec), /weekend|vakantie/i)
})

test('een dag met afwijkende tijden gaat mee met die tijden', () => {
  const spec = bijzondereDagenSchemaOrg([
    { datum: '2026-12-24', dagdelen: [{ van: 570, tot: 780 }], reden: 'Kerstavond' },
  ])

  assert.equal(spec.length, 1)
  assert.equal(spec[0]?.opens, '09:30')
  assert.equal(spec[0]?.closes, '13:00')
  assert.equal(spec[0]?.validFrom, '2026-12-24')
})

test('zonder afwijkende dagen valt er niets door te geven', () => {
  assert.deepEqual(bijzondereDagenSchemaOrg([]), [])
  assert.deepEqual(bijzondereDagenSchemaOrg(), [])
})
