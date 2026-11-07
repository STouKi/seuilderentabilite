/**
 * Calculs du seuil de rentabilité (méthode de la marge sur coûts variables).
 *
 * Toutes les fonctions sont pures : elles ne dépendent ni de Vue ni du navigateur,
 * ce qui permet de les tester directement avec `bun test`.
 */

/** Montants saisis, en euros HT, sur un exercice de 12 mois. */
export interface BreakEvenInput {
  /** Chiffre d'affaires HT de l'exercice. */
  turnover: number
  /** Charges fixes de l'exercice (loyer, assurances, salaires fixes...). */
  fixedCosts: number
  /** Charges variables de l'exercice (achats, matières, commissions...). */
  variableCosts: number
  /** Prix de vente moyen HT d'une unité vendue (facultatif). */
  averagePrice?: number | null
}

interface MarginFigures {
  /** Marge sur coûts variables : CA - charges variables. */
  contributionMargin: number
  /** Taux de marge sur coûts variables : marge / CA (entre 0 et 1 si rentable). */
  contributionMarginRate: number
  /** Part des charges variables dans le CA : charges variables / CA. */
  variableCostRate: number
  /** Résultat d'exploitation estimé : marge sur coûts variables - charges fixes. */
  operatingResult: number
}

/**
 * Les charges variables absorbent tout le chiffre d'affaires : aucune quantité
 * vendue ne permet de couvrir les charges fixes, le seuil n'existe pas.
 */
export interface NoMarginResult extends MarginFigures {
  kind: 'no-margin'
}

export interface BreakEvenSuccess extends MarginFigures {
  kind: 'ok'
  /** Seuil de rentabilité : CA à partir duquel le résultat devient positif. */
  breakEvenPoint: number
  /** Marge de sécurité : CA - seuil (négative si le seuil n'est pas atteint). */
  safetyMargin: number
  /** Indice de sécurité : marge de sécurité / CA. */
  safetyIndex: number
  /** Point mort exprimé en mois d'activité : seuil / CA × 12. */
  breakEvenMonths: number
  /** Nombre de ventes à réaliser pour atteindre le seuil, si un prix moyen est connu. */
  breakEvenUnits: number | null
}

export type BreakEvenResult = NoMarginResult | BreakEvenSuccess

/**
 * Calcule l'ensemble des indicateurs. Retourne `null` tant que le chiffre
 * d'affaires est nul : aucun taux de marge ne peut alors être calculé.
 */
export function computeBreakEven(input: BreakEvenInput): BreakEvenResult | null {
  const { turnover, fixedCosts, variableCosts, averagePrice } = input

  if (!(turnover > 0) || !(fixedCosts >= 0) || !(variableCosts >= 0)) return null

  const contributionMargin = turnover - variableCosts
  const figures: MarginFigures = {
    contributionMargin,
    contributionMarginRate: contributionMargin / turnover,
    variableCostRate: variableCosts / turnover,
    operatingResult: contributionMargin - fixedCosts,
  }

  if (contributionMargin <= 0) return { kind: 'no-margin', ...figures }

  // CF × CA / MCV est strictement équivalent à CF / taux de MCV, avec une division
  // de moins : aucun arrondi intermédiaire ne vient fausser le résultat.
  const breakEvenPoint = (fixedCosts * turnover) / contributionMargin
  const safetyMargin = turnover - breakEvenPoint

  return {
    kind: 'ok',
    ...figures,
    breakEvenPoint,
    safetyMargin,
    safetyIndex: safetyMargin / turnover,
    breakEvenMonths: (breakEvenPoint / turnover) * 12,
    breakEvenUnits: averagePrice && averagePrice > 0
      // On ne vend pas une fraction de produit : on arrondit à l'unité supérieure,
      // en tolérant le bruit des nombres flottants (1250.0000000001 -> 1250).
      // Math.max écarte le -0 produit par Math.ceil(-1e-9) quand le seuil est nul.
      ? Math.max(0, Math.ceil(breakEvenPoint / averagePrice - 1e-9))
      : null,
  }
}

/**
 * Date à laquelle le seuil est franchi, pour un exercice de 12 mois débutant le 1er
 * du mois `startMonth` (0 = janvier) de l'année `year`, en supposant un chiffre
 * d'affaires réparti régulièrement sur l'exercice.
 *
 * Comme en comptabilité de gestion, on compte en mois entiers puis on répartit la
 * fraction restante sur les jours du mois suivant : 9 mois pile tombent le dernier
 * jour du 9e mois, 8,57 mois tombent le 18 du 9e mois.
 *
 * Retourne `null` si le seuil n'est pas atteint au cours de l'exercice.
 */
export function breakEvenDate(months: number, startMonth: number, year: number): Date | null {
  if (!Number.isFinite(months) || months < 0) return null

  // Arrondi à 6 décimales pour absorber le bruit des flottants (8.9999999 -> 9).
  const rounded = Math.round(months * 1e6) / 1e6
  if (rounded > 12) return null

  const wholeMonths = Math.floor(rounded)
  const fraction = rounded - wholeMonths
  const daysInMonth = new Date(year, startMonth + wholeMonths + 1, 0).getDate()
  const dayOfMonth = Math.ceil(fraction * daysInMonth - 1e-9)

  if (dayOfMonth <= 0) {
    // Seuil franchi exactement à la fin d'un mois (ou dès l'ouverture si aucune charge fixe).
    return wholeMonths === 0
      ? new Date(year, startMonth, 1)
      : new Date(year, startMonth + wholeMonths, 0)
  }

  return new Date(year, startMonth + wholeMonths, dayOfMonth)
}
