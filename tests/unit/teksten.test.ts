/**
 * Controleert de teksten van de site.
 *
 * Dit vangt drie dingen af die er anders zomaar in sluipen:
 *   1. De aanspreekvorm. Overal "je", nergens "u".
 *   2. Restjes van de redactie: aanwijzingen als "(schrappen)" of
 *      "graag bevestigen" horen in docs/open-punten.md, niet op de site.
 *   3. Gaten: een lege kop, een sectie zonder tekst, een ontbrekende meta.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'

import type { PaginaTekst } from '../../src/content/teksten.ts'

const MAP = path.join(process.cwd(), 'src', 'content', 'teksten')

const PAGINAS: PaginaTekst[] = readdirSync(MAP)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(readFileSync(path.join(MAP, f), 'utf8')) as PaginaTekst)

/** Alle losse zinnen van een pagina, met de plek waar ze staan. */
function alleTeksten(pagina: PaginaTekst): { waar: string; tekst: string }[] {
  const uit: { waar: string; tekst: string }[] = [
    { waar: 'meta_titel', tekst: pagina.metaTitel },
    { waar: 'meta_omschrijving', tekst: pagina.metaOmschrijving },
    { waar: 'h1', tekst: pagina.h1 },
    { waar: 'inleiding', tekst: pagina.inleiding },
    { waar: 'oproep.kop', tekst: pagina.oproep.kop },
    { waar: 'oproep.tekst', tekst: pagina.oproep.tekst },
    { waar: 'oproep.knop', tekst: pagina.oproep.knop },
  ]
  pagina.secties.forEach((s, i) => {
    uit.push({ waar: `sectie ${i} kop`, tekst: s.kop })
    s.alineas.forEach((a, j) => uit.push({ waar: `sectie ${i} alinea ${j}`, tekst: a }))
    s.opsomming.forEach((o, j) => {
      uit.push({ waar: `sectie ${i} punt ${j} titel`, tekst: o.titel })
      uit.push({ waar: `sectie ${i} punt ${j} tekst`, tekst: o.tekst })
    })
  })
  pagina.vragen.forEach((v, i) => {
    uit.push({ waar: `vraag ${i}`, tekst: v.vraag })
    uit.push({ waar: `antwoord ${i}`, tekst: v.antwoord })
  })
  return uit
}

test('er zijn teksten gevonden', () => {
  assert.ok(PAGINAS.length >= 13, `verwacht minstens 13 paginateksten, gevonden: ${PAGINAS.length}`)
})

test('overal "je", nergens "u"', () => {
  // Let op de woordgrenzen: "uur", "juist" en "nu" zijn natuurlijk geen u-vorm.
  const uVorm = /\b(u|uw|uzelf|jullie's)\b/
  const fouten: string[] = []

  for (const pagina of PAGINAS) {
    for (const { waar, tekst } of alleTeksten(pagina)) {
      const treffer = uVorm.exec(tekst)
      if (treffer) {
        fouten.push(`${pagina.slug} > ${waar}: "...${tekst.slice(Math.max(0, treffer.index - 40), treffer.index + 40)}..."`)
      }
    }
  }

  assert.deepEqual(fouten, [], `deze teksten spreken met "u":\n${fouten.join('\n')}`)
})

test('geen restjes van de redactie in de teksten', () => {
  // Aanwijzingen die tijdens het schrijven of nakijken ontstaan en die per
  // ongeluk in de tekst kunnen blijven staan.
  const restjes = [
    /\bTODO\b/i,
    /\bLET OP\b/,
    /\bplaatshouder\b/i,
    /\(schrappen/i,
    /zet .{0,30}als open punt/i,
    /graag (aanleveren|bevestigen)/i,
    /\bnog (aan te leveren|invullen)\b/i,
    /\blorem ipsum\b/i,
    /\bXXX\b/,
  ]
  const fouten: string[] = []

  for (const pagina of PAGINAS) {
    for (const { waar, tekst } of alleTeksten(pagina)) {
      for (const restje of restjes) {
        if (restje.test(tekst)) fouten.push(`${pagina.slug} > ${waar}: ${tekst.slice(0, 120)}`)
      }
    }
  }

  assert.deepEqual(fouten, [], `hier staat nog een aanwijzing in de tekst:\n${fouten.join('\n')}`)
})

test('geen dubbel geplakte zinnen', () => {
  const fouten: string[] = []

  for (const pagina of PAGINAS) {
    for (const { waar, tekst } of alleTeksten(pagina)) {
      const zinnen = tekst.split(/(?<=[.!?])\s+/).map((z) => z.trim()).filter((z) => z.length > 25)
      const gezien = new Set<string>()
      for (const zin of zinnen) {
        if (gezien.has(zin)) fouten.push(`${pagina.slug} > ${waar}: "${zin.slice(0, 80)}..."`)
        gezien.add(zin)
      }
    }
  }

  assert.deepEqual(fouten, [], `deze zin staat er twee keer in:\n${fouten.join('\n')}`)
})

test('elke pagina is compleet ingevuld', () => {
  for (const pagina of PAGINAS) {
    assert.ok(pagina.slug, 'slug ontbreekt')
    assert.ok(pagina.h1?.length > 3, `${pagina.slug}: h1 ontbreekt`)
    assert.ok(pagina.inleiding?.length > 20, `${pagina.slug}: inleiding ontbreekt`)
    assert.ok(pagina.secties.length > 0, `${pagina.slug}: geen secties`)
    assert.ok(pagina.oproep?.knop?.length > 2, `${pagina.slug}: oproep ontbreekt`)

    for (const [i, sectie] of pagina.secties.entries()) {
      assert.ok(sectie.kop?.length > 2, `${pagina.slug}: sectie ${i} heeft geen kop`)
      assert.ok(
        sectie.alineas.length > 0 || sectie.opsomming.length > 0,
        `${pagina.slug}: sectie "${sectie.kop}" is leeg`,
      )
    }
  }
})

test('de meta-teksten hebben een bruikbare lengte voor Google', () => {
  for (const pagina of PAGINAS) {
    assert.ok(
      pagina.metaTitel.length >= 15 && pagina.metaTitel.length <= 70,
      `${pagina.slug}: meta-titel is ${pagina.metaTitel.length} tekens (streef naar 15-70): "${pagina.metaTitel}"`,
    )
    assert.ok(
      pagina.metaOmschrijving.length >= 70 && pagina.metaOmschrijving.length <= 175,
      `${pagina.slug}: meta-omschrijving is ${pagina.metaOmschrijving.length} tekens (streef naar 70-175)`,
    )
  }
})

test('de vragen hebben een echt antwoord', () => {
  for (const pagina of PAGINAS) {
    for (const vraag of pagina.vragen) {
      assert.ok(vraag.vraag.trim().length > 8, `${pagina.slug}: lege vraag`)
      assert.ok(
        vraag.antwoord.trim().length > 25,
        `${pagina.slug}: te kort antwoord bij "${vraag.vraag}"`,
      )
    }
  }
})
