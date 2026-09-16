/** Controleert het agendabestand dat na een boeking te downloaden is. */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { maakIcs } from '../../src/lib/ics.ts'

const AFSPRAAK = {
  dienstNaam: 'Oogmeting en montuuradvies',
  datum: '2026-09-16',
  tijd: '09:30',
  duurMinuten: 45,
  referentie: 'TEST-123',
}

test('bevat een geldig raamwerk', () => {
  const ics = maakIcs(AFSPRAAK)
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/)
  assert.match(ics, /END:VCALENDAR\r\n$/)
  assert.match(ics, /BEGIN:VEVENT/)
  assert.match(ics, /END:VEVENT/)
})

test('zet begin en eind in de Nederlandse tijdzone', () => {
  const ics = maakIcs(AFSPRAAK)
  assert.match(ics, /DTSTART;TZID=Europe\/Amsterdam:20260916T093000/)
  assert.match(ics, /DTEND;TZID=Europe\/Amsterdam:20260916T101500/)
  assert.match(ics, /TZID:Europe\/Amsterdam/)
})

test('rekent een afspraak over het hele uur heen goed', () => {
  const ics = maakIcs({ ...AFSPRAAK, tijd: '15:45', duurMinuten: 60 })
  assert.match(ics, /DTSTART;TZID=Europe\/Amsterdam:20260916T154500/)
  assert.match(ics, /DTEND;TZID=Europe\/Amsterdam:20260916T164500/)
})

test('gebruikt overal regeleinden met CR en LF', () => {
  const ics = maakIcs(AFSPRAAK)
  const losseLf = ics.split('\n').filter((r, i, alle) => i < alle.length - 1 && !r.endsWith('\r'))
  assert.equal(losseLf.length, 0, 'elke regel hoort op \\r\\n te eindigen')
})

test('breekt te lange regels netjes af', () => {
  const ics = maakIcs({ ...AFSPRAAK, dienstNaam: 'Een hele lange naam '.repeat(8) })
  for (const regel of ics.split('\r\n')) {
    assert.ok(regel.length <= 75, `regel te lang (${regel.length}): ${regel.slice(0, 40)}...`)
  }
})

test('ontsnapt tekens met een bijzondere betekenis', () => {
  const ics = maakIcs({ ...AFSPRAAK, dienstNaam: 'Oogmeting, montuur; advies' })
  assert.match(ics, /SUMMARY:Oogmeting\\, montuur\; advies/)
})

test('zet er een herinnering van twee uur van tevoren in', () => {
  const ics = maakIcs(AFSPRAAK)
  assert.match(ics, /BEGIN:VALARM/)
  assert.match(ics, /TRIGGER:-PT2H/)
})
