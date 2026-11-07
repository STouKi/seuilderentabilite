import { describe, expect, test } from 'bun:test'
import {
  formatAmountInput,
  formatCompactEuros,
  formatDay,
  formatEuros,
  formatPercent,
  formatSignedEuros,
  monthName,
  parseAmount,
} from '../app/utils/amount.ts'

/** Remplace les espaces insécables d'Intl par des espaces simples, pour des attentes lisibles. */
const plain = (text: string) => text.replace(/[  ]/g, ' ')

describe('parseAmount', () => {
  test.each([
    ['120000', 120_000],
    ['120 000', 120_000],
    ['120 000', 120_000],
    ['120 000 €', 120_000],
    ['120000€', 120_000],
    ['120 000 euros', 120_000],
    ['4,5', 4.5],
    ['4.50', 4.5],
    ['12 500,50', 12_500.5],
    ['12.500,50', 12_500.5],
    ['12,500.50', 12_500.5],
    ['1.234.567', 1_234_567],
    ['1,234,567', 1_234_567],
    [',5', 0.5],
    ['+250', 250],
    ['0', 0],
    ['-0', 0],
  ])('« %s » vaut %d', (raw, expected) => {
    expect(parseAmount(raw)).toEqual({ ok: true, value: expected })
  })

  test('renvoie null pour une saisie vide', () => {
    expect(parseAmount('')).toBeNull()
    expect(parseAmount('   ')).toBeNull()
    expect(parseAmount('€')).toBeNull()
  })

  test.each(['abc', '12a', '1e5', '.', '12,50,3.4.5', '--5'])('refuse le format « %s »', (raw) => {
    expect(parseAmount(raw)).toEqual({ ok: false, error: 'format' })
  })

  test('refuse les montants négatifs', () => {
    expect(parseAmount('-1500')).toEqual({ ok: false, error: 'negative' })
    expect(parseAmount('−1500')).toEqual({ ok: false, error: 'negative' })
  })

  test('refuse les montants démesurés', () => {
    expect(parseAmount('9999999999999')).toEqual({ ok: false, error: 'too-large' })
  })
})

describe('formatage', () => {
  test('remet en forme la saisie et reste relisible par parseAmount', () => {
    expect(plain(formatAmountInput(120_000))).toBe('120 000')
    expect(plain(formatAmountInput(4.5))).toBe('4,50')
    expect(parseAmount(formatAmountInput(12_500.5))).toEqual({ ok: true, value: 12_500.5 })
  })

  test('affiche les euros à la française', () => {
    expect(plain(formatEuros(85_714.2857))).toBe('85 714 €')
    expect(plain(formatEuros(85_714.2857, { cents: true }))).toBe('85 714,29 €')
    expect(plain(formatEuros(-0.2))).toBe('0 €')
    expect(plain(formatSignedEuros(20_000))).toBe('+20 000 €')
    expect(plain(formatSignedEuros(-5_000))).toBe('-5 000 €')
    expect(plain(formatSignedEuros(0.3))).toBe('0 €')
  })

  test('abrège les graduations des axes', () => {
    expect(plain(formatCompactEuros(5_000))).toBe('5 000 €')
    expect(plain(formatCompactEuros(135_000))).toBe('135 k€')
    expect(plain(formatCompactEuros(1_250_000))).toBe('1,3 M€')
  })

  test('affiche les pourcentages', () => {
    expect(plain(formatPercent(0.583333))).toBe('58,33 %')
    expect(plain(formatPercent(0.25))).toBe('25 %')
  })

  test('écrit « 1er » pour le premier jour du mois', () => {
    expect(formatDay(new Date(2026, 9, 1))).toBe('1er octobre')
    expect(formatDay(new Date(2026, 8, 18))).toBe('18 septembre')
    expect(formatDay(new Date(2026, 0, 11))).toBe('11 janvier')
  })

  test('nomme les mois', () => {
    expect(monthName(0)).toBe('janvier')
    expect(monthName(11)).toBe('décembre')
  })
})
