/**
 * Controleert de uitleg bij de agendacontrole (/agenda-controle/).
 *
 * Die pagina is bedoeld voor Gerard en Gerda, niet voor een programmeur. Dus
 * hoort er bij elke fout te staan wat je eraan kunt doen, in gewone taal en
 * zonder "u".
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { statusVan, verklaarStatus } from '../../src/lib/agenda/controle.ts'

test('een geweigerde inlog wijst naar de inloggegevens', () => {
  for (const status of [401, 403]) {
    const { uitleg, watNu } = verklaarStatus(status)
    assert.match(uitleg, /niet binnen|niet geaccepteerd/)
    assert.match(watNu, /EASYAPPOINTMENTS_/)
  }
})

test('een onbekend adres wijst naar de API van de agenda', () => {
  const { watNu } = verklaarStatus(404)
  assert.match(watNu, /REST API/)
})

test('geen antwoord is iets anders dan een fout van de agenda', () => {
  assert.match(verklaarStatus(0).uitleg, /geen antwoord/)
  assert.match(verklaarStatus(500).uitleg, /storing/)
})

test('elke uitleg is begrijpelijk en spreekt met "je"', () => {
  for (const status of [0, 401, 403, 404, 405, 429, 500, 503, 418]) {
    const { uitleg, watNu } = verklaarStatus(status)
    for (const tekst of [uitleg, watNu]) {
      assert.ok(tekst.length > 20, `te kort bij ${status}: "${tekst}"`)
      assert.doesNotMatch(tekst, /\b(u|uw|uzelf)\b/, `spreekt met "u" bij ${status}: "${tekst}"`)
    }
  }
})

test('de foutcode wordt uit een fout van de agenda gehaald', () => {
  const fout = Object.assign(new Error('agenda gaf 401'), { status: 401 })
  assert.equal(statusVan(fout), 401)
})

test('een fout zonder code telt als "geen antwoord"', () => {
  assert.equal(statusVan(new Error('verbinding viel weg')), 0)
  assert.equal(statusVan('iets anders'), 0)
  assert.equal(statusVan(undefined), 0)
})
