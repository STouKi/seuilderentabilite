/** Saisie brute des champs, telle que tapée par l'utilisateur. */
export interface SimulationFields {
  turnover: string
  fixedCosts: string
  variableCosts: string
  averagePrice: string
  /** Mois de début de l'exercice : 0 = janvier. */
  startMonth: number
}

type AmountKey = Exclude<keyof SimulationFields, 'startMonth'>

/** L'exemple de la boulangerie, repris dans la section « Exemple de calcul ». */
export const EXAMPLE_VALUES: Record<AmountKey, number> & { startMonth: number } = {
  turnover: 180_000,
  fixedCosts: 81_000,
  variableCosts: 72_000,
  averagePrice: 6,
  startMonth: 0,
}

/** Clés courtes et lisibles utilisées dans l'ancre de l'URL : #ca=180000&cf=81000&cv=72000 */
const HASH_KEYS: Record<AmountKey, string> = {
  turnover: 'ca',
  fixedCosts: 'cf',
  variableCosts: 'cv',
  averagePrice: 'pv',
}
const START_MONTH_KEY = 'debut'

const AMOUNT_KEYS = Object.keys(HASH_KEYS) as AmountKey[]

function emptyFields(): SimulationFields {
  return { turnover: '', fixedCosts: '', variableCosts: '', averagePrice: '', startMonth: 0 }
}

export function useBreakEvenSimulation() {
  const fields = reactive<SimulationFields>(emptyFields())

  const parsed = computed(() => ({
    turnover: parseAmount(fields.turnover),
    fixedCosts: parseAmount(fields.fixedCosts),
    variableCosts: parseAmount(fields.variableCosts),
    averagePrice: parseAmount(fields.averagePrice),
  }))

  /** Montants valides, ou `null` tant qu'un des trois montants obligatoires manque. */
  const amounts = computed(() => {
    const { turnover, fixedCosts, variableCosts, averagePrice } = parsed.value
    if (!turnover?.ok || !fixedCosts?.ok || !variableCosts?.ok) return null
    return {
      turnover: turnover.value,
      fixedCosts: fixedCosts.value,
      variableCosts: variableCosts.value,
      averagePrice: averagePrice?.ok && averagePrice.value > 0 ? averagePrice.value : null,
    }
  })

  const result = computed(() => (amounts.value ? computeBreakEven(amounts.value) : null))

  /** Libellés des montants obligatoires encore vides, pour guider la saisie. */
  const missingFields = computed(() => {
    const labels: Record<'turnover' | 'fixedCosts' | 'variableCosts', string> = {
      turnover: 'le chiffre d’affaires',
      fixedCosts: 'les charges fixes',
      variableCosts: 'les charges variables',
    }
    return (Object.keys(labels) as Array<keyof typeof labels>)
      .filter(key => parsed.value[key] === null)
      .map(key => labels[key])
  })

  const hasInvalidField = computed(() => Object.values(parsed.value).some(value => value?.ok === false))
  const isEmpty = computed(() => AMOUNT_KEYS.every(key => fields[key].trim() === ''))

  function fill(values: Partial<Record<AmountKey, number>> & { startMonth?: number }) {
    for (const key of AMOUNT_KEYS) {
      const value = values[key]
      fields[key] = value === undefined ? '' : formatAmountInput(value)
    }
    fields.startMonth = values.startMonth ?? 0
  }

  function loadExample() {
    fill(EXAMPLE_VALUES)
  }

  function reset() {
    Object.assign(fields, emptyFields())
  }

  // --- Ancre de l'URL ---------------------------------------------------------
  // L'ancre (après le #) n'est jamais envoyée au serveur : les chiffres restent privés,
  // tout en permettant de recharger la page ou de partager une simulation.

  function serialize(): string {
    const params = new URLSearchParams()
    for (const key of AMOUNT_KEYS) {
      const value = parsed.value[key]
      if (value?.ok) params.set(HASH_KEYS[key], String(value.value))
    }
    if (params.size > 0 && fields.startMonth !== 0) params.set(START_MONTH_KEY, String(fields.startMonth + 1))
    return params.toString()
  }

  /** Remplit le formulaire depuis l'ancre. Retourne `true` si l'ancre portait une simulation. */
  function readHash(): boolean {
    const hash = window.location.hash.slice(1)
    if (!hash.includes('=')) return false

    const params = new URLSearchParams(hash)
    const values: Partial<Record<AmountKey, number>> & { startMonth?: number } = {}
    for (const key of AMOUNT_KEYS) {
      const value = parseAmount(params.get(HASH_KEYS[key]) ?? '')
      if (value?.ok) values[key] = value.value
    }
    const month = Number(params.get(START_MONTH_KEY))
    if (Number.isInteger(month) && month >= 1 && month <= 12) values.startMonth = month - 1

    fill(values)
    return true
  }

  /** Un lien interne (« Charger cet exemple ») a changé l'ancre : on remonte au simulateur. */
  function onHashChange() {
    if (!readHash()) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('simulateur')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  function writeHash() {
    const hash = serialize()
    const { pathname, search, hash: currentHash } = window.location
    // On ne remplace pas une ancre de navigation (#methode) par une ancre vide.
    if (!hash && !currentHash.includes('=')) return

    const url = `${pathname}${search}${hash ? `#${hash}` : ''}`
    if (url !== `${pathname}${search}${currentHash}`) {
      // On conserve l'état de l'historique, utilisé par le routeur de Nuxt.
      window.history.replaceState(window.history.state, '', url)
    }
  }

  /** Lien complet vers la simulation en cours. */
  function shareUrl(): string {
    const hash = serialize()
    return `${window.location.origin}${window.location.pathname}${hash ? `#${hash}` : ''}`
  }

  let timer: ReturnType<typeof setTimeout> | undefined

  onMounted(() => {
    readHash()
    window.addEventListener('hashchange', onHashChange)

    watch(fields, () => {
      clearTimeout(timer)
      timer = setTimeout(writeHash, 300)
    }, { deep: true })
  })

  onBeforeUnmount(() => {
    clearTimeout(timer)
    window.removeEventListener('hashchange', onHashChange)
  })

  return {
    fields,
    parsed,
    amounts,
    result,
    missingFields,
    hasInvalidField,
    isEmpty,
    loadExample,
    reset,
    shareUrl,
  }
}
