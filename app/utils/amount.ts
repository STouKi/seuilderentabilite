/**
 * Saisie et affichage des montants au format français.
 * Fonctions pures, testées avec `bun test`.
 */

/** Au-delà de 1 000 milliards d'euros, on considère la saisie comme une erreur de frappe. */
export const MAX_AMOUNT = 1e12

export type AmountError = 'format' | 'negative' | 'too-large'

export type ParsedAmount =
  | { ok: true, value: number }
  | { ok: false, error: AmountError }

/**
 * Convertit une saisie libre en nombre. Accepte les espaces (y compris insécables),
 * le symbole €, la virgule ou le point décimal et les séparateurs de milliers :
 * « 12 500,50 », « 12500.50 », « 12.500,50 », « 12 500 € ».
 *
 * Retourne `null` pour une saisie vide.
 */
export function parseAmount(raw: string): ParsedAmount | null {
  let text = raw
    .replace(/\s/g, '') // espaces, espaces insécables et espaces fines
    .replace(/€|euros?$/gi, '')

  if (text === '') return null

  const negative = /^[-−]/.test(text)
  text = text.replace(/^[-−+]/, '')

  if (!/^[\d.,]+$/.test(text) || !/\d/.test(text)) return { ok: false, error: 'format' }

  const commas = text.split(',').length - 1
  const dots = text.split('.').length - 1

  if (commas > 0 && dots > 0) {
    // Les deux séparateurs sont présents : le dernier est le séparateur décimal.
    const decimal = text.lastIndexOf(',') > text.lastIndexOf('.') ? ',' : '.'
    const thousands = decimal === ',' ? '.' : ','
    if (text.split(decimal).length - 1 > 1) return { ok: false, error: 'format' }
    text = text.replaceAll(thousands, '').replace(decimal, '.')
  }
  else if (commas > 1 || dots > 1) {
    // Un séparateur répété ne peut être qu'un séparateur de milliers : 1.234.567
    text = text.replaceAll(commas > 1 ? ',' : '.', '')
  }
  else {
    text = text.replace(',', '.')
  }

  const value = Number(text)
  if (!Number.isFinite(value)) return { ok: false, error: 'format' }
  if (negative && value !== 0) return { ok: false, error: 'negative' }
  if (value > MAX_AMOUNT) return { ok: false, error: 'too-large' }

  return { ok: true, value }
}

export const AMOUNT_ERROR_MESSAGES: Record<AmountError, string> = {
  'format': 'Saisissez un montant en chiffres, par exemple 25 000.',
  'negative': 'Le montant ne peut pas être négatif.',
  'too-large': 'Ce montant semble trop élevé.',
}

const integerFormat = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })
const centsFormat = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** Remet en forme une saisie valide : 120000 -> « 120 000 », 4.5 -> « 4,50 ». */
export function formatAmountInput(value: number): string {
  return Number.isInteger(value) ? integerFormat.format(value) : centsFormat.format(value)
}

const euroFormats = {
  0: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
  2: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }),
}
const signedEuroFormat = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
  signDisplay: 'exceptZero',
})

/** 85714.29 -> « 85 714 € » ; avec `cents`, -> « 85 714,29 € ». */
export function formatEuros(value: number, { cents = false } = {}): string {
  // Évite l'affichage « -0 € » pour un montant arrondi à zéro.
  const safe = Math.abs(value) < (cents ? 0.005 : 0.5) ? 0 : value
  return euroFormats[cents ? 2 : 0].format(safe)
}

/** Montant exact : centimes affichés seulement s'il y en a (180000 -> « 180 000 € », 4.5 -> « 4,50 € »). */
export function formatEurosExact(value: number): string {
  return formatEuros(value, { cents: !Number.isInteger(Math.round(value * 100) / 100) })
}

/** 20000 -> « +20 000 € », -5000 -> « -5 000 € ». */
export function formatSignedEuros(value: number): string {
  return signedEuroFormat.format(Math.abs(value) < 0.5 ? 0 : value)
}

const compactEuroFormat = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

/** Graduations d'axe : 135000 -> « 135 k€ ». */
export function formatCompactEuros(value: number): string {
  if (Math.abs(value) < 10_000) return formatEuros(value)
  // Intl écrit « 135 k € » : on colle l'unité au symbole, comme dans l'usage « 135 k€ ».
  return compactEuroFormat.format(value).replace(/(k|M|Md)\s€/, '$1€')
}

const percentFormat = new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 2 })

/** 0.583333 -> « 58,33 % » */
export function formatPercent(ratio: number): string {
  return percentFormat.format(ratio)
}

const decimalFormat = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 })

/** 8.571 -> « 8,6 » */
export function formatDecimal(value: number): string {
  return decimalFormat.format(value)
}

/** 22500 -> « 22 500 » */
export function formatInteger(value: number): string {
  return integerFormat.format(value)
}

const dayFormat = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' })

/** Date courte à la française : « 18 septembre », « 1er octobre ». */
export function formatDay(date: Date): string {
  const text = dayFormat.format(date)
  return date.getDate() === 1 ? text.replace(/^1(?=\s)/, '1er') : text
}

const monthNames = Array.from({ length: 12 }, (_, month) =>
  new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(new Date(2026, month, 1)),
)

/** Nom du mois : 0 -> « janvier ». */
export function monthName(month: number): string {
  return monthNames[month] ?? ''
}
