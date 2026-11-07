import { describe, expect, test } from 'bun:test'
import { breakEvenDate, computeBreakEven } from '../app/utils/breakEven.ts'

describe('computeBreakEven', () => {
  test("calcule tous les indicateurs de l'exemple de la boulangerie", () => {
    const result = computeBreakEven({ turnover: 180_000, fixedCosts: 81_000, variableCosts: 72_000, averagePrice: 6 })

    expect(result?.kind).toBe('ok')
    if (result?.kind !== 'ok') return

    expect(result.contributionMargin).toBe(108_000)
    expect(result.contributionMarginRate).toBeCloseTo(0.6, 12)
    expect(result.variableCostRate).toBeCloseTo(0.4, 12)
    expect(result.breakEvenPoint).toBeCloseTo(135_000, 6)
    expect(result.safetyMargin).toBeCloseTo(45_000, 6)
    expect(result.safetyIndex).toBeCloseTo(0.25, 12)
    expect(result.operatingResult).toBe(27_000)
    expect(result.breakEvenMonths).toBeCloseTo(9, 12)
    expect(result.breakEvenUnits).toBe(22_500)
  })

  test("n'arrondit pas le taux de marge avant de calculer le seuil", () => {
    // L'ancienne version arrondissait le taux à 0,67 et trouvait 74 626,87 €.
    const result = computeBreakEven({ turnover: 100_000, fixedCosts: 50_000, variableCosts: 33_333 })

    expect(result?.kind).toBe('ok')
    if (result?.kind !== 'ok') return
    expect(result.breakEvenPoint).toBeCloseTo(50_000 / 0.66667, 6)
  })

  test("signale une perte quand le CA est sous le seuil", () => {
    const result = computeBreakEven({ turnover: 60_000, fixedCosts: 50_000, variableCosts: 20_000 })

    expect(result?.kind).toBe('ok')
    if (result?.kind !== 'ok') return
    expect(result.breakEvenPoint).toBeCloseTo(75_000, 6)
    expect(result.operatingResult).toBe(-10_000)
    expect(result.safetyMargin).toBeCloseTo(-15_000, 6)
    expect(result.safetyIndex).toBeCloseTo(-0.25, 12)
    expect(result.breakEvenMonths).toBeCloseTo(15, 12)
  })

  test("retourne un seuil nul quand il n'y a aucune charge fixe", () => {
    const result = computeBreakEven({ turnover: 10_000, fixedCosts: 0, variableCosts: 4_000, averagePrice: 25 })

    expect(result?.kind).toBe('ok')
    if (result?.kind !== 'ok') return
    expect(result.breakEvenPoint).toBe(0)
    expect(result.breakEvenMonths).toBe(0)
    expect(result.safetyIndex).toBe(1)
    // Zéro positif : un -0 s'afficherait « -0 vente ».
    expect(Object.is(result.breakEvenUnits, 0)).toBe(true)
  })

  test("indique l'absence de seuil quand les charges variables absorbent tout le CA", () => {
    const equal = computeBreakEven({ turnover: 50_000, fixedCosts: 10_000, variableCosts: 50_000 })
    const above = computeBreakEven({ turnover: 50_000, fixedCosts: 10_000, variableCosts: 65_000 })

    expect(equal?.kind).toBe('no-margin')
    expect(above?.kind).toBe('no-margin')
    expect(above?.contributionMargin).toBe(-15_000)
    expect(above?.operatingResult).toBe(-25_000)
  })

  test('attend un chiffre d’affaires strictement positif', () => {
    expect(computeBreakEven({ turnover: 0, fixedCosts: 10_000, variableCosts: 0 })).toBeNull()
    expect(computeBreakEven({ turnover: Number.NaN, fixedCosts: 10_000, variableCosts: 0 })).toBeNull()
    expect(computeBreakEven({ turnover: 10_000, fixedCosts: -1, variableCosts: 0 })).toBeNull()
  })

  test("arrondit le nombre de ventes à l'unité supérieure, sans bruit flottant", () => {
    const exact = computeBreakEven({ turnover: 100_000, fixedCosts: 30_000, variableCosts: 40_000, averagePrice: 40 })
    const partial = computeBreakEven({ turnover: 100_000, fixedCosts: 30_000, variableCosts: 40_000, averagePrice: 30 })

    // Seuil = 50 000 € : 1 250 ventes à 40 €, 1 666,67 ventes à 30 € donc 1 667.
    expect(exact?.kind === 'ok' && exact.breakEvenUnits).toBe(1_250)
    expect(partial?.kind === 'ok' && partial.breakEvenUnits).toBe(1_667)
  })

  test('ignore un prix moyen nul ou absent', () => {
    const withoutPrice = computeBreakEven({ turnover: 100_000, fixedCosts: 30_000, variableCosts: 40_000 })
    const zeroPrice = computeBreakEven({ turnover: 100_000, fixedCosts: 30_000, variableCosts: 40_000, averagePrice: 0 })

    expect(withoutPrice?.kind === 'ok' && withoutPrice.breakEvenUnits).toBeNull()
    expect(zeroPrice?.kind === 'ok' && zeroPrice.breakEvenUnits).toBeNull()
  })
})

describe('breakEvenDate', () => {
  const day = (date: Date | null) => date && [date.getFullYear(), date.getMonth() + 1, date.getDate()]

  test('tombe le dernier jour du mois pour un nombre de mois entier', () => {
    expect(day(breakEvenDate(9, 0, 2026))).toEqual([2026, 9, 30])
    expect(day(breakEvenDate(1, 0, 2026))).toEqual([2026, 1, 31])
    expect(day(breakEvenDate(12, 0, 2026))).toEqual([2026, 12, 31])
  })

  test('répartit la fraction de mois sur les jours du mois suivant', () => {
    // 8,571 mois : 8 mois pleins, puis 0,571 × 30 jours = 17,1 jours, donc le 18 septembre.
    expect(day(breakEvenDate((85_714.29 / 120_000) * 12, 0, 2026))).toEqual([2026, 9, 18])
    // 0,5 mois en février 2026 (28 jours) : le 14 février.
    expect(day(breakEvenDate(1.5, 0, 2026))).toEqual([2026, 2, 14])
  })

  test("tient compte du mois de début de l'exercice et du changement d'année", () => {
    expect(day(breakEvenDate(5, 8, 2026))).toEqual([2027, 1, 31])
    expect(day(breakEvenDate(4.5, 9, 2026))).toEqual([2027, 2, 14])
  })

  test("renvoie le premier jour de l'exercice sans charges fixes", () => {
    expect(day(breakEvenDate(0, 3, 2026))).toEqual([2026, 4, 1])
  })

  test('absorbe le bruit des nombres flottants', () => {
    expect(day(breakEvenDate(8.999_999_999_9, 0, 2026))).toEqual([2026, 9, 30])
    expect(day(breakEvenDate(9.000_000_000_1, 0, 2026))).toEqual([2026, 9, 30])
  })

  test("renvoie null si le seuil n'est pas atteint pendant l'exercice", () => {
    expect(breakEvenDate(12.01, 0, 2026)).toBeNull()
    expect(breakEvenDate(Number.POSITIVE_INFINITY, 0, 2026)).toBeNull()
    expect(breakEvenDate(-1, 0, 2026)).toBeNull()
  })
})
